using FashionLifestyle.API.Domain.Enums;

namespace FashionLifestyle.API.Application.DTOs.Orders;

public record OrderTrackingResponse(
    string OrderNumber,
    string ClientName,
    OrderStatus Status,
    string StatusLabel,
    string? TrackingNote,
    DateTime OrderDate,
    DateTime? EstimatedDelivery,
    DateTime? DeliveredAt
);
