using FashionLifestyle.API.Models;

namespace FashionLifestyle.API.Services;

public interface IMeasurementService
{
    Task<Measurement> SubmitMeasurementAsync(Measurement measurement);
    Task<Measurement?> GetMeasurementByIdAsync(int id);
}
