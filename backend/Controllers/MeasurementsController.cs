using FashionLifestyle.API.Application.Common.Responses;
using FashionLifestyle.API.Application.DTOs.Measurements;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionLifestyle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeasurementsController : ControllerBase
{
    private readonly IMeasurementService _measurementService;

    public MeasurementsController(IMeasurementService measurementService) => _measurementService = measurementService;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitMeasurementRequest request)
    {
        var result = await _measurementService.SubmitMeasurementAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new OkResponse<Measurement>(result, "Measurements submitted successfully."));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var measurement = await _measurementService.GetMeasurementByIdAsync(id);
        return Ok(new OkResponse<Measurement>(measurement));
    }
}
