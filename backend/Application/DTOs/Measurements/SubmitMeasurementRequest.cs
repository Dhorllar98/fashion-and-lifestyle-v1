namespace FashionLifestyle.API.Application.DTOs.Measurements;

public record SubmitMeasurementRequest(
    string ClientName,
    string ClientEmail,
    double Chest,
    double Waist,
    double Hips,
    double ShoulderWidth,
    double SleeveLength,
    double InseamLength,
    double Height,
    string? Notes
);
