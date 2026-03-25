namespace FashionLifestyle.API.Models;

public class Design
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // e.g. Tops, Bottoms, Dresses, Suits
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> AvailableColors { get; set; } = new();
    public List<string> AvailableFabrics { get; set; } = new();
    public bool IsAvailable { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
