using FashionLifestyle.API.Models;

namespace FashionLifestyle.API.Services;

public interface ICatalogueService
{
    Task<IEnumerable<Design>> GetAllDesignsAsync();
    Task<Design?> GetDesignByIdAsync(int id);
    Task<IEnumerable<Design>> GetDesignsByCategoryAsync(string category);
}
