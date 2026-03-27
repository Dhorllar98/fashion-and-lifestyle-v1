using FashionLifestyle.API.Application.DTOs.Auth;

namespace FashionLifestyle.API.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
