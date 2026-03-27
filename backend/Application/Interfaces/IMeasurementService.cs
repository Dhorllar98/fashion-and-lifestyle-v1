using FashionLifestyle.API.Application.DTOs.Measurements;
using FashionLifestyle.API.Domain.Entities;

namespace FashionLifestyle.API.Application.Interfaces;

public interface IMeasurementService
{
    Task<Measurement> SubmitMeasurementAsync(SubmitMeasurementRequest request);
    Task<Measurement> GetMeasurementByIdAsync(int id);
}
