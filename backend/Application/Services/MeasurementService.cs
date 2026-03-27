using System.Text.RegularExpressions;
using FashionLifestyle.API.Application.DTOs.Measurements;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Exceptions;
using FashionLifestyle.API.Infrastructure.Persistence;

namespace FashionLifestyle.API.Application.Services;

public partial class MeasurementService : IMeasurementService
{
    private readonly InMemoryStore _store;
    private readonly IAuditLogger _audit;

    public MeasurementService(InMemoryStore store, IAuditLogger audit)
    {
        _store = store;
        _audit = audit;
    }

    public Task<Measurement> SubmitMeasurementAsync(SubmitMeasurementRequest request)
    {
        Validate(request);

        var measurement = new Measurement
        {
            Id = _store.NextMeasurementId(),
            ClientName = request.ClientName.Trim(),
            ClientEmail = request.ClientEmail.Trim().ToLower(),
            Chest = request.Chest,
            Waist = request.Waist,
            Hips = request.Hips,
            ShoulderWidth = request.ShoulderWidth,
            SleeveLength = request.SleeveLength,
            InseamLength = request.InseamLength,
            Height = request.Height,
            Notes = request.Notes?.Trim(),
            SubmittedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = request.ClientEmail
        };

        _store.Measurements.Add(measurement);
        _audit.Log("Submit", "Measurement", new { measurement.Id, measurement.ClientEmail });
        return Task.FromResult(measurement);
    }

    public Task<Measurement> GetMeasurementByIdAsync(int id)
    {
        var measurement = _store.Measurements.FirstOrDefault(m => m.Id == id && !m.IsDeleted)
            ?? throw new NotFoundException($"Measurement with ID {id} was not found.");

        return Task.FromResult(measurement);
    }

    private static void Validate(SubmitMeasurementRequest r)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(r.ClientName))
            errors.Add("Client name is required.");

        if (string.IsNullOrWhiteSpace(r.ClientEmail))
            errors.Add("Client email is required.");
        else if (!EmailRegex().IsMatch(r.ClientEmail))
            errors.Add("Client email format is invalid.");

        if (r.Chest <= 0) errors.Add("Chest measurement must be greater than zero.");
        if (r.Waist <= 0) errors.Add("Waist measurement must be greater than zero.");
        if (r.Hips <= 0) errors.Add("Hips measurement must be greater than zero.");
        if (r.ShoulderWidth <= 0) errors.Add("Shoulder width must be greater than zero.");
        if (r.SleeveLength <= 0) errors.Add("Sleeve length must be greater than zero.");
        if (r.InseamLength <= 0) errors.Add("Inseam length must be greater than zero.");
        if (r.Height <= 0) errors.Add("Height must be greater than zero.");

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }

    [GeneratedRegex(@"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")]
    private static partial Regex EmailRegex();
}
