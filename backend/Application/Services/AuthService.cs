using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using FashionLifestyle.API.Application.DTOs.Auth;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Enums;
using FashionLifestyle.API.Domain.Exceptions;
using FashionLifestyle.API.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FashionLifestyle.API.Application.Services;

public partial class AuthService : IAuthService
{
    private readonly InMemoryStore _store;
    private readonly IAuditLogger _audit;
    private readonly IConfiguration _config;

    public AuthService(InMemoryStore store, IAuditLogger audit, IConfiguration config)
    {
        _store = store;
        _audit = audit;
        _config = config;
    }

    public Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        ValidateRegistration(request);

        if (_store.Users.Any(u => u.Email.Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase)))
            throw new ValidationException("An account with this email address already exists.");

        var user = new User
        {
            Id = _store.NextUserId(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLower(),
            Phone = request.Phone.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = request.Email
        };

        _store.Users.Add(user);
        _audit.Log("Register", "User", new { user.Id, user.Email, user.Role });

        var (token, expiresAt) = GenerateJwtToken(user);
        return Task.FromResult(new AuthResponse(user.Id, user.FullName, user.Email, user.Role.ToString(), token, expiresAt));
    }

    public Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ValidationException("Password is required.");

        var user = _store.Users.FirstOrDefault(u =>
            u.Email.Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase) && !u.IsDeleted)
            ?? throw new ValidationException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new ValidationException("Invalid email or password.");

        _audit.Log("Login", "User", new { user.Id, user.Email });

        var (token, expiresAt) = GenerateJwtToken(user);
        return Task.FromResult(new AuthResponse(user.Id, user.FullName, user.Email, user.Role.ToString(), token, expiresAt));
    }

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(User user)
    {
        var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
            ?? _config["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT secret key is not configured.");

        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
            ?? _config["Jwt:Issuer"]
            ?? "FashionLifestyle";

        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
            ?? _config["Jwt:Audience"]
            ?? "FashionLifestyle.Clients";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddDays(7);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    private static void ValidateRegistration(RegisterRequest r)
    {
        var errors = new List<string>();

        // Name: at least two words, each starting with uppercase
        if (string.IsNullOrWhiteSpace(r.FullName))
        {
            errors.Add("Full name is required.");
        }
        else
        {
            var parts = r.FullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length < 2)
                errors.Add("Full name must include at least a first name and a last name.");
            else if (parts.Any(p => !char.IsUpper(p[0])))
                errors.Add("Each part of the name must start with a capital letter (e.g. 'John Doe').");
        }

        // Email
        if (string.IsNullOrWhiteSpace(r.Email))
            errors.Add("Email is required.");
        else if (!EmailRegex().IsMatch(r.Email.Trim()))
            errors.Add("Email format is invalid.");

        // Phone: international format e.g. +2348012345678
        if (string.IsNullOrWhiteSpace(r.Phone))
            errors.Add("Phone number is required.");
        else if (!PhoneRegex().IsMatch(r.Phone.Trim()))
            errors.Add("Phone must be in international format (e.g. +2348012345678).");

        // Password
        if (string.IsNullOrWhiteSpace(r.Password))
            errors.Add("Password is required.");
        else if (r.Password.Length < 8)
            errors.Add("Password must be at least 8 characters.");

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }

    [GeneratedRegex(@"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"^\+[1-9]\d{7,14}$")]
    private static partial Regex PhoneRegex();
}
