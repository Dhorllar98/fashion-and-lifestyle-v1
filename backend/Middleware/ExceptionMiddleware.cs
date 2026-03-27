using System.Text.Json;
using FashionLifestyle.API.Domain.Exceptions;

namespace FashionLifestyle.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, ex);
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            ValidationException ve  => (400, ve.Errors.Count == 1
                                            ? ve.Errors[0]
                                            : string.Join(" | ", ve.Errors)),
            NotFoundException nfe   => (404, nfe.Message),
            OutOfStockException ose => (422, ose.Message),
            UnauthorizedException ue => (401, ue.Message),
            _                       => (500, exception.Message)
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode  = statusCode;

        var body = JsonSerializer.Serialize(new
        {
            success    = false,
            message,
            statusCode
        }, _jsonOptions);

        await context.Response.WriteAsync(body);
    }
}
