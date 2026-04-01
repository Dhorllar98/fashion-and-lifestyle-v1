using System.Text.Json;
using FashionLifestyle.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FashionLifestyle.API.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Measurement> Measurements => Set<Measurement>();
    public DbSet<Design> Designs => Set<Design>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // SQLite has no native array type; store List<string> as a JSON string.
        var stringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
        );

        modelBuilder.Entity<Design>(e =>
        {
            e.HasKey(d => d.Id);
            e.Property(d => d.AvailableColors).HasConversion(stringListConverter);
            e.Property(d => d.AvailableFabrics).HasConversion(stringListConverter);
            // IsOutOfStock is a computed get-only property; EF must not map it.
            e.Ignore(d => d.IsOutOfStock);
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.HasKey(o => o.Id);
            e.HasOne(o => o.Design)
             .WithMany()
             .HasForeignKey(o => o.DesignId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(o => o.Measurement)
             .WithMany()
             .HasForeignKey(o => o.MeasurementId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Measurement>(e =>
        {
            e.HasKey(m => m.Id);
        });
    }
}
