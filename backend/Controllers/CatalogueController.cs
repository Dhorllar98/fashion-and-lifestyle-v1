using FashionLifestyle.API.Application.Common.Responses;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FashionLifestyle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogueController : ControllerBase
{
    private readonly ICatalogueService _catalogueService;

    public CatalogueController(ICatalogueService catalogueService) => _catalogueService = catalogueService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var designs = await _catalogueService.GetAllDesignsAsync(page, pageSize);
        var total = await _catalogueService.GetTotalDesignCountAsync();
        return Ok(new PagedResponse<Design>(designs, page, pageSize, total));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var design = await _catalogueService.GetDesignByIdAsync(id);
        return Ok(new OkResponse<Design>(design));
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(string category)
    {
        var designs = await _catalogueService.GetDesignsByCategoryAsync(category);
        return Ok(new OkResponse<IEnumerable<Design>>(designs));
    }
}
