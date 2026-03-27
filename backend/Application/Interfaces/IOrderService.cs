using FashionLifestyle.API.Application.DTOs.Orders;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Enums;

namespace FashionLifestyle.API.Application.Interfaces;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
    Task<Order> GetOrderByIdAsync(int id);
    Task<OrderTrackingResponse> TrackOrderAsync(string orderNumber);
    Task<Order> UpdateOrderStatusAsync(int id, OrderStatus status, string? note = null);
    Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email);
}
