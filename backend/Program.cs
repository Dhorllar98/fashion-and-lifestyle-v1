using System.Text;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Application.Services;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Enums;
using FashionLifestyle.API.Infrastructure.Logging;
using FashionLifestyle.API.Infrastructure.Persistence;
using FashionLifestyle.API.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ── JWT configuration — env vars take priority, appsettings.Development.json as fallback ──
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? builder.Configuration["Jwt:SecretKey"]
    ?? throw new InvalidOperationException(
        "JWT secret key is not configured. " +
        "Set JWT_SECRET_KEY env var (production) or Jwt:SecretKey in appsettings.Development.json (local).");

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? builder.Configuration["Jwt:Issuer"]
    ?? "FashionLifestyle";

var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? builder.Configuration["Jwt:Audience"]
    ?? "FashionLifestyle.Clients";

// ── Authentication & Authorization ───────────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew                = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── Database ──────────────────────────────────────────────────────────────────
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=fashionlifestyle.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// ── Infrastructure ────────────────────────────────────────────────────────────
builder.Services.AddScoped<IAuditLogger, AuditLogger>();

// ── Application Services ──────────────────────────────────────────────────────
builder.Services.AddScoped<ICatalogueService, CatalogueService>();
builder.Services.AddScoped<IMeasurementService, MeasurementService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ── CORS — env var takes priority (set CORS_ORIGINS in production) ────────────
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ORIGINS")
    ?? "http://localhost:5173,http://localhost:3000,https://fashion-and-lifestyle-v1.vercel.app")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ── Controllers & Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Fashion & Lifestyle API",
        Version     = "v1",
        Description = "Custom clothing e-commerce platform API"
    });

    // JWT bearer security definition for Swagger UI — click Authorize to set your token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name        = "Authorization",
        Type        = SecuritySchemeType.Http,
        Scheme      = "bearer",
        BearerFormat = "JWT",
        In          = ParameterLocation.Header,
        Description = "Enter your JWT token. Example: Bearer {token}"
    });
});

// ── Pipeline ──────────────────────────────────────────────────────────────────
var app = builder.Build();

// Ensure the database schema exists and seed initial data on first run.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    SeedDatabase(db);
}

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Skip HTTPS redirect in Development — the 307 redirect causes browsers to strip
// the Authorization header before it reaches the JWT middleware, producing a 401
// on any authenticated endpoint even when the token is present and valid.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// ── Seed helper ───────────────────────────────────────────────────────────────
static void SeedDatabase(AppDbContext db)
{
    // Admin user — only seeded when the Users table is empty.
    if (!db.Users.Any())
    {
        db.Users.Add(new User
        {
            FullName     = "Fashion Admin",
            Email        = "admin@fashionlifestyle.com",
            Phone        = "+2348000000000",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@2025!"),
            Role         = UserRole.Admin,
            CreatedAt    = DateTime.UtcNow,
            CreatedBy    = "system"
        });
        db.SaveChanges();
    }

    // Designs — only seeded when the Designs table is empty.
    if (!db.Designs.Any())
    {
        db.Designs.AddRange(
            new Design
            {
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
                Name             = "Pencil Skirt",
                Description      = "A structured mid-length pencil skirt with a back slit for ease of movement.",
                Category         = "Bottoms",
                Price            = 22000,
                ImageUrl         = "/images/pencil-skirt.jpg",
                AvailableColors  = new() { "Black", "Nude", "Navy", "Burgundy" },
                AvailableFabrics = new() { "Crepe", "Ponte", "Wool Blend" },
                StockQuantity    = 0,   // intentionally out of stock
                CreatedAt        = DateTime.UtcNow
            }
        );
        db.SaveChanges();
    }
}
