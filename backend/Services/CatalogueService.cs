using FashionLifestyle.API.Models;

namespace FashionLifestyle.API.Services;

// V1: In-memory mock data. Replace with DbContext in v2.
public class CatalogueService : ICatalogueService
{
    private readonly List<Design> _designs = new()
    {
        new Design
        {
            Id = 1,
            Name = "Classic Tailored Suit",
            Description = "A timeless two-piece suit with a slim fit silhouette, perfect for formal occasions.",
            Category = "Suits",
            Price = 85000,
            ImageUrl = "/images/suit-classic.jpg",
            AvailableColors = new() { "Navy", "Charcoal", "Black", "Beige" },
            AvailableFabrics = new() { "Wool Blend", "Linen", "Cotton" }
        },
        new Design
        {
            Id = 2,
            Name = "Ankara Wrap Dress",
            Description = "A vibrant Ankara print wrap dress with a flattering V-neckline and flowing silhouette.",
            Category = "Dresses",
            Price = 35000,
            ImageUrl = "/images/ankara-dress.jpg",
            AvailableColors = new() { "Blue/Gold Print", "Red/Green Print", "Purple/Yellow Print" },
            AvailableFabrics = new() { "Ankara Cotton", "Satin-Backed Ankara" }
        },
        new Design
        {
            Id = 3,
            Name = "Agbada Ceremonial Set",
            Description = "A full traditional Agbada set with embroidered detailing, ideal for ceremonies and celebrations.",
            Category = "Traditional",
            Price = 120000,
            ImageUrl = "/images/agbada-set.jpg",
            AvailableColors = new() { "White", "Royal Blue", "Deep Purple", "Emerald Green" },
            AvailableFabrics = new() { "Aso-Oke", "Damask", "Velvet" }
        },
        new Design
        {
            Id = 4,
            Name = "Casual Linen Shirt",
            Description = "A breathable linen shirt with a relaxed fit, great for both casual and smart-casual looks.",
            Category = "Tops",
            Price = 18000,
            ImageUrl = "/images/linen-shirt.jpg",
            AvailableColors = new() { "White", "Sky Blue", "Olive", "Terracotta" },
            AvailableFabrics = new() { "Pure Linen", "Linen-Cotton Blend" }
        },
        new Design
        {
            Id = 5,
            Name = "Pencil Skirt",
            Description = "A structured mid-length pencil skirt with a back slit for ease of movement.",
            Category = "Bottoms",
            Price = 22000,
            ImageUrl = "/images/pencil-skirt.jpg",
            AvailableColors = new() { "Black", "Nude", "Navy", "Burgundy" },
            AvailableFabrics = new() { "Crepe", "Ponte", "Wool Blend" }
        }
    };

    public Task<IEnumerable<Design>> GetAllDesignsAsync() =>
        Task.FromResult(_designs.Where(d => d.IsAvailable));

    public Task<Design?> GetDesignByIdAsync(int id) =>
        Task.FromResult(_designs.FirstOrDefault(d => d.Id == id));

    public Task<IEnumerable<Design>> GetDesignsByCategoryAsync(string category) =>
        Task.FromResult(_designs.Where(d =>
            d.Category.Equals(category, StringComparison.OrdinalIgnoreCase) && d.IsAvailable));
}
