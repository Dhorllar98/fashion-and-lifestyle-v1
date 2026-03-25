namespace FashionLifestyle.API.Models;

public enum OrderStatus
{
    InProduction,
    Ready,
    Dispatched,
    InTransit,
    Delivered
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty; // e.g. FAL-2024-0001
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;

    public int DesignId { get; set; }
    public Design? Design { get; set; }

    public int MeasurementId { get; set; }
    public Measurement? Measurement { get; set; }

    public string SelectedColor { get; set; } = string.Empty;
    public string SelectedFabric { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }
    public bool IsPaid { get; set; } = false;
    public string? PaymentReference { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.InProduction;
    public string? TrackingNote { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? EstimatedDelivery { get; set; }
    public DateTime? DeliveredAt { get; set; }
}
