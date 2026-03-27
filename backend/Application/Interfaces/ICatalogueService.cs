using FashionLifestyle.API.Domain.Entities;

namespace FashionLifestyle.API.Application.Interfaces;

public interface ICatalogueService
{
    Task<IEnumerable<Design>> GetAllDesignsAsync(int page = 1, int pageSize = 10);
    Task<int> GetTotalDesignCountAsync();
    Task<Design> GetDesignByIdAsync(int id);
    Task<IEnumerable<Design>> GetDesignsByCategoryAsync(string category);
}
