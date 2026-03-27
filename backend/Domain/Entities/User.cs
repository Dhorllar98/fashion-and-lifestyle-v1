using FashionLifestyle.API.Domain.Common;
using FashionLifestyle.API.Domain.Enums;

namespace FashionLifestyle.API.Domain.Entities;

public class User : AuditableEntity
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;
}
