using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Exceptions;
using FashionLifestyle.API.Infrastructure.Persistence;

namespace FashionLifestyle.API.Application.Services;

public class CatalogueService : ICatalogueService
{
    private readonly InMemoryStore _store;
    private readonly IAuditLogger _audit;

    public CatalogueService(InMemoryStore store, IAuditLogger audit)
    {
        _store = store;
        _audit = audit;
    }

    public Task<IEnumerable<Design>> GetAllDesignsAsync(int page = 1, int pageSize = 10)
    {
        var designs = _store.Designs
            .Where(d => !d.IsDeleted && d.IsAvailable)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        _audit.Log("GetAll", "Design", new { page, pageSize, count = designs.Count });
        return Task.FromResult<IEnumerable<Design>>(designs);
    }

    public Task<int> GetTotalDesignCountAsync()
    {
        var count = _store.Designs.Count(d => !d.IsDeleted && d.IsAvailable);
        return Task.FromResult(count);
    }

    public Task<Design> GetDesignByIdAsync(int id)
    {
        var design = _store.Designs.FirstOrDefault(d => d.Id == id && !d.IsDeleted)
            ?? throw new NotFoundException($"Design with ID {id} was not found.");

        _audit.Log("GetById", "Design", new { id });
        return Task.FromResult(design);
    }

    public Task<IEnumerable<Design>> GetDesignsByCategoryAsync(string category)
    {
        var designs = _store.Designs
            .Where(d => d.Category.Equals(category, StringComparison.OrdinalIgnoreCase)
                        && !d.IsDeleted && d.IsAvailable)
            .ToList();

        _audit.Log("GetByCategory", "Design", new { category, count = designs.Count });
        return Task.FromResult<IEnumerable<Design>>(designs);
    }
}
