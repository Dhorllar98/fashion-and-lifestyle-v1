namespace FashionLifestyle.API.Application.Interfaces;

public interface IAuditLogger
{
    void Log(string action, string entity, object? details = null, string? performedBy = null);
}
