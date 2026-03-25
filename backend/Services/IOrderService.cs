using FashionLifestyle.API.Models;

namespace FashionLifestyle.API.Services;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(Order order);
    Task<Order?> GetOrderByIdAsync(int id);
    Task<Order?> GetOrderByNumberAsync(string orderNumber);
    Task<Order?> UpdateOrderStatusAsync(int id, OrderStatus status, string? note = null);
    Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email);
}
