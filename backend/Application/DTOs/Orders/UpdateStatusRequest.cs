using FashionLifestyle.API.Domain.Enums;

namespace FashionLifestyle.API.Application.DTOs.Orders;

public record UpdateStatusRequest(OrderStatus Status, string? Note);
