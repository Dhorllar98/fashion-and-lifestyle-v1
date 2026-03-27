namespace FashionLifestyle.API.Application.DTOs.Auth;

public record RegisterRequest(
    string FullName,
    string Email,
    string Phone,
    string Password
);
