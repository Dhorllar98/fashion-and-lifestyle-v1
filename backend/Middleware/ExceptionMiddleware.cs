using System.Net;
using System.Text.Json;
using FashionLifestyle.API.Application.Common.Responses;
using FashionLifestyle.API.Domain.Exceptions;

namespace FashionLifestyle.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

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
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        ApiBaseResponse<object> response;

        switch (exception)
        {
            case ValidationException ve:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new ApiBaseResponse<object>
                {
                    Success = false,
                    Message = "Validation failed.",
                    Errors = ve.Errors.ToList()
                };
                break;

            case NotFoundException nfe:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = new ApiBaseResponse<object>
                {
                    Success = false,
                    Message = nfe.Message,
                    Errors = new List<string> { nfe.Message }
                };
                break;

            case OutOfStockException ose:
                context.Response.StatusCode = (int)HttpStatusCode.UnprocessableEntity;
                response = new ApiBaseResponse<object>
                {
                    Success = false,
                    Message = ose.Message,
                    Errors = new List<string> { ose.Message }
                };
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response = new ApiBaseResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred. Please try again later.",
                    Errors = new List<string> { "Internal server error." }
                };
                break;
        }

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
