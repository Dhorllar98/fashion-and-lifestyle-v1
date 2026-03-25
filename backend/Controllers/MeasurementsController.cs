using FashionLifestyle.API.Models;
using FashionLifestyle.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FashionLifestyle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeasurementsController : ControllerBase
{
    private readonly IMeasurementService _measurementService;

    public MeasurementsController(IMeasurementService measurementService)
    {
        _measurementService = measurementService;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] Measurement measurement)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _measurementService.SubmitMeasurementAsync(measurement);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var measurement = await _measurementService.GetMeasurementByIdAsync(id);
        if (measurement is null) return NotFound();
        return Ok(measurement);
    }
}
