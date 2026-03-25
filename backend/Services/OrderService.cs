using FashionLifestyle.API.Models;

namespace FashionLifestyle.API.Services;

// V1: In-memory store. Replace with DbContext in v2.
public class OrderService : IOrderService
{
    private readonly List<Order> _orders = new();
    private int _nextId = 1;

    public Task<Order> CreateOrderAsync(Order order)
    {
        order.Id = _nextId++;
        order.OrderNumber = $"FAL-{DateTime.UtcNow.Year}-{order.Id:D4}";
        order.OrderDate = DateTime.UtcNow;
        order.Status = OrderStatus.InProduction;
        order.EstimatedDelivery = DateTime.UtcNow.AddDays(14);
        _orders.Add(order);
        return Task.FromResult(order);
    }

    public Task<Order?> GetOrderByIdAsync(int id) =>
        Task.FromResult(_orders.FirstOrDefault(o => o.Id == id));

    public Task<Order?> GetOrderByNumberAsync(string orderNumber) =>
        Task.FromResult(_orders.FirstOrDefault(o =>
            o.OrderNumber.Equals(orderNumber, StringComparison.OrdinalIgnoreCase)));

    public Task<Order?> UpdateOrderStatusAsync(int id, OrderStatus status, string? note = null)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order is null) return Task.FromResult<Order?>(null);

        order.Status = status;
        if (note is not null) order.TrackingNote = note;
        if (status == OrderStatus.Delivered) order.DeliveredAt = DateTime.UtcNow;

        return Task.FromResult<Order?>(order);
    }

    public Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email) =>
        Task.FromResult(_orders.Where(o =>
            o.ClientEmail.Equals(email, StringComparison.OrdinalIgnoreCase)));
}
