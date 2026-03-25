using FashionLifestyle.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FashionLifestyle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogueController : ControllerBase
{
    private readonly ICatalogueService _catalogueService;

    public CatalogueController(ICatalogueService catalogueService)
    {
        _catalogueService = catalogueService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var designs = await _catalogueService.GetAllDesignsAsync();
        return Ok(designs);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var design = await _catalogueService.GetDesignByIdAsync(id);
        if (design is null) return NotFound();
        return Ok(design);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(string category)
    {
        var designs = await _catalogueService.GetDesignsByCategoryAsync(category);
        return Ok(designs);
    }
}
