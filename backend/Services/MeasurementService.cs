using FashionLifestyle.API.Models;

namespace FashionLifestyle.API.Services;

// V1: In-memory store. Replace with DbContext in v2.
public class MeasurementService : IMeasurementService
{
    private readonly List<Measurement> _measurements = new();
    private int _nextId = 1;

    public Task<Measurement> SubmitMeasurementAsync(Measurement measurement)
    {
        measurement.Id = _nextId++;
        measurement.SubmittedAt = DateTime.UtcNow;
        _measurements.Add(measurement);
        return Task.FromResult(measurement);
    }

    public Task<Measurement?> GetMeasurementByIdAsync(int id) =>
        Task.FromResult(_measurements.FirstOrDefault(m => m.Id == id));
}
