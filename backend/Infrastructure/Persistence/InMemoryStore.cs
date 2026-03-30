using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Enums;

namespace FashionLifestyle.API.Infrastructure.Persistence;

/// <summary>
/// Shared in-memory data store. All services use this singleton.
/// Replace with EF Core DbContext in v2.
/// </summary>
public class InMemoryStore
{
    private int _measurementNextId = 1;
    private int _orderNextId       = 1;
    private int _userNextId;          // set in constructor after seeding

    public int NextMeasurementId() => _measurementNextId++;
    public int NextOrderId()       => _orderNextId++;
    public int NextUserId()        => _userNextId++;

    public List<Measurement> Measurements { get; } = new();
    public List<Order>       Orders       { get; } = new();
    public List<User>        Users        { get; }

    public InMemoryStore()
    {
        // Seed one admin user — credentials: admin@fashionlifestyle.com / Admin@2025!
        Users = new List<User>
        {
            new User
            {
                Id           = 1,
                FullName     = "Fashion Admin",
                Email        = "admin@fashionlifestyle.com",
                Phone        = "+2348000000000",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@2025!"),
                Role         = UserRole.Admin,
                CreatedAt    = DateTime.UtcNow,
                CreatedBy    = "system"
            }
        };

        _userNextId = 2; // next registered customer gets Id = 2, 3, …
    }

    public List<Design> Designs { get; } = new()
    {
        new Design
        {
            Id               = 1,
            Name             = "Classic Tailored Suit",
            Description      = "A timeless two-piece suit with a slim fit silhouette, perfect for formal occasions.",
            Category         = "Suits",
            Price            = 85000,
            ImageUrl         = "/images/suit-classic.jpg",
            AvailableColors  = new() { "Navy", "Charcoal", "Black", "Beige" },
            AvailableFabrics = new() { "Wool Blend", "Linen", "Cotton" },
            StockQuantity    = 8,
            CreatedAt        = DateTime.UtcNow
        },
        new Design
        {
            Id               = 2,
            Name             = "Ankara Wrap Dress",
            Description      = "A vibrant Ankara print wrap dress with a flattering V-neckline and flowing silhouette.",
            Category         = "Dresses",
            Price            = 35000,
            ImageUrl         = "/images/ankara-dress.jpg",
            AvailableColors  = new() { "Blue/Gold Print", "Red/Green Print", "Purple/Yellow Print" },
            AvailableFabrics = new() { "Ankara Cotton", "Satin-Backed Ankara" },
            StockQuantity    = 15,
            CreatedAt        = DateTime.UtcNow
        },
        new Design
        {
            Id               = 3,
            Name             = "Agbada Ceremonial Set",
            Description      = "A full traditional Agbada set with embroidered detailing, ideal for ceremonies and celebrations.",
            Category         = "Traditional",
            Price            = 120000,
            ImageUrl         = "/images/agbada-set.jpg",
            AvailableColors  = new() { "White", "Royal Blue", "Deep Purple", "Emerald Green" },
            AvailableFabrics = new() { "Aso-Oke", "Damask", "Velvet" },
            StockQuantity    = 5,
            CreatedAt        = DateTime.UtcNow
        },
        new Design
        {
            Id               = 4,
            Name             = "Casual Linen Shirt",
            Description      = "A breathable linen shirt with a relaxed fit, great for casual and smart-casual looks.",
            Category         = "Tops",
            Price            = 18000,
            ImageUrl         = "/images/linen-shirt.jpg",
            AvailableColors  = new() { "White", "Sky Blue", "Olive", "Terracotta" },
            AvailableFabrics = new() { "Pure Linen", "Linen-Cotton Blend" },
            StockQuantity    = 20,
            CreatedAt        = DateTime.UtcNow
        },
        new Design
        {
            Id               = 5,
            Name             = "Pencil Skirt",
            Description      = "A structured mid-length pencil skirt with a back slit for ease of movement.",
            Category         = "Bottoms",
            Price            = 22000,
            ImageUrl         = "/images/pencil-skirt.jpg",
            AvailableColors  = new() { "Black", "Nude", "Navy", "Burgundy" },
            AvailableFabrics = new() { "Crepe", "Ponte", "Wool Blend" },
            StockQuantity    = 0, // intentionally out of stock
            CreatedAt        = DateTime.UtcNow
        }
    };
}
