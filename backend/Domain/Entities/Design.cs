using FashionLifestyle.API.Domain.Common;

namespace FashionLifestyle.API.Domain.Entities;

public class Design : AuditableEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> AvailableColors { get; set; } = new();
    public List<string> AvailableFabrics { get; set; } = new();
    public bool IsAvailable { get; set; } = true;
    public int StockQuantity { get; set; } = 10;
    public bool IsOutOfStock => StockQuantity <= 0;
}
