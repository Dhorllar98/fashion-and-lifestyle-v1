using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Exceptions;
using FashionLifestyle.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FashionLifestyle.API.Application.Services;

public class CatalogueService : ICatalogueService
{
    private readonly AppDbContext _db;
    private readonly IAuditLogger _audit;

    public CatalogueService(AppDbContext db, IAuditLogger audit)
    {
        _db = db;
        _audit = audit;
    }

    public async Task<IEnumerable<Design>> GetAllDesignsAsync(int page = 1, int pageSize = 10)
    {
        var designs = await _db.Designs
            .Where(d => !d.IsDeleted && d.IsAvailable)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        _audit.Log("GetAll", "Design", new { page, pageSize, count = designs.Count });
        return designs;
    }

    public async Task<int> GetTotalDesignCountAsync()
    {
        return await _db.Designs.CountAsync(d => !d.IsDeleted && d.IsAvailable);
    }

    public async Task<Design> GetDesignByIdAsync(int id)
    {
        var design = await _db.Designs.FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted)
            ?? throw new NotFoundException($"Design with ID {id} was not found.");

        _audit.Log("GetById", "Design", new { id });
        return design;
    }

    public async Task<IEnumerable<Design>> GetDesignsByCategoryAsync(string category)
    {
        var categoryLower = category.ToLower();
        var designs = await _db.Designs
            .Where(d => d.Category.ToLower() == categoryLower && !d.IsDeleted && d.IsAvailable)
            .ToListAsync();

        _audit.Log("GetByCategory", "Design", new { category, count = designs.Count });
        return designs;
    }
}
