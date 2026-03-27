using FashionLifestyle.API.Application.Interfaces;

namespace FashionLifestyle.API.Infrastructure.Logging;

public class AuditLogger : IAuditLogger
{
    private readonly ILogger<AuditLogger> _logger;

    public AuditLogger(ILogger<AuditLogger> logger)
    {
        _logger = logger;
    }

    public void Log(string action, string entity, object? details = null, string? performedBy = null)
    {
        _logger.LogInformation(
            "[AUDIT] Action={Action} Entity={Entity} PerformedBy={PerformedBy} Details={@Details} Timestamp={Timestamp}",
            action,
            entity,
            performedBy ?? "System",
            details,
            DateTime.UtcNow
        );
    }
}
