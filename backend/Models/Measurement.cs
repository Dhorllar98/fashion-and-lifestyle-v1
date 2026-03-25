namespace FashionLifestyle.API.Models;

public class Measurement
{
    public int Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;

    // Body measurements (in cm)
    public double Chest { get; set; }
    public double Waist { get; set; }
    public double Hips { get; set; }
    public double ShoulderWidth { get; set; }
    public double SleeveLength { get; set; }
    public double InseamLength { get; set; }
    public double Height { get; set; }

    public string? Notes { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
