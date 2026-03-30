using FashionLifestyle.API.Application.DTOs.Orders;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Enums;
using FashionLifestyle.API.Domain.Exceptions;
using FashionLifestyle.API.Infrastructure.Persistence;

namespace FashionLifestyle.API.Application.Services;

public class OrderService : IOrderService
{
    private readonly InMemoryStore _store;
    private readonly IAuditLogger _audit;

    public OrderService(InMemoryStore store, IAuditLogger audit)
    {
        _store = store;
        _audit = audit;
    }

    public Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        Validate(request);

        var design = _store.Designs.FirstOrDefault(d => d.Id == request.DesignId && !d.IsDeleted)
            ?? throw new NotFoundException($"Design with ID {request.DesignId} was not found.");

        if (design.StockQuantity == 0)
            throw new OutOfStockException(design.Name);

        if (request.Quantity > design.StockQuantity)
            throw new ValidationException(
                $"Requested quantity ({request.Quantity}) exceeds available stock ({design.StockQuantity}) for '{design.Name}'.");

        // Deduct stock
        design.StockQuantity -= request.Quantity;
        design.UpdatedAt = DateTime.UtcNow;

        var orderId = _store.NextOrderId();
        var order = new Order
        {
            Id = orderId,
            OrderNumber = $"FAL-{DateTime.UtcNow.Year}-{orderId:D4}",
            ClientName = request.ClientName.Trim(),
            ClientEmail = request.ClientEmail.Trim().ToLower(),
            ClientPhone = request.ClientPhone.Trim(),
            DesignId = request.DesignId,
            Design = design,
            MeasurementId = request.MeasurementId,
            SelectedColor = request.SelectedColor.Trim(),
            SelectedFabric = request.SelectedFabric.Trim(),
            Quantity = request.Quantity,
            TotalAmount = design.Price * request.Quantity,
            Status = OrderStatus.InProduction,
            OrderDate = DateTime.UtcNow,
            EstimatedDelivery = DateTime.UtcNow.AddDays(14),
            CreatedAt = DateTime.UtcNow,
            CreatedBy = request.ClientEmail
        };

        _store.Orders.Add(order);
        _audit.Log("Create", "Order", new { order.OrderNumber, order.ClientEmail, order.TotalAmount });
        return Task.FromResult(order);
    }

    public Task<Order> GetOrderByIdAsync(int id)
    {
        var order = _store.Orders.FirstOrDefault(o => o.Id == id && !o.IsDeleted)
            ?? throw new NotFoundException($"Order with ID {id} was not found.");

        return Task.FromResult(order);
    }

    public Task<OrderTrackingResponse> TrackOrderAsync(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
            throw new ValidationException("Order number is required.");

        var order = _store.Orders.FirstOrDefault(o =>
            o.OrderNumber.Equals(orderNumber.Trim(), StringComparison.OrdinalIgnoreCase) && !o.IsDeleted)
            ?? throw new NotFoundException($"No order found with number '{orderNumber}'. Please check and try again.");

        var response = new OrderTrackingResponse(
            order.OrderNumber,
            order.ClientName,
            order.Status,
            order.Status.ToString(),
            order.TrackingNote,
            order.OrderDate,
            order.EstimatedDelivery,
            order.DeliveredAt
        );

        _audit.Log("Track", "Order", new { orderNumber });
        return Task.FromResult(response);
    }

    public Task<Order> UpdateOrderStatusAsync(int id, OrderStatus status, string? note = null)
    {
        var order = _store.Orders.FirstOrDefault(o => o.Id == id && !o.IsDeleted)
            ?? throw new NotFoundException($"Order with ID {id} was not found.");

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        if (note is not null)
            order.TrackingNote = note;

        if (status == OrderStatus.Delivered)
            order.DeliveredAt = DateTime.UtcNow;

        _audit.Log("UpdateStatus", "Order", new { id, status, note });
        return Task.FromResult(order);
    }

    public Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email)
    {
        var orders = _store.Orders
            .Where(o => o.ClientEmail.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase) && !o.IsDeleted)
            .ToList();

        return Task.FromResult<IEnumerable<Order>>(orders);
    }

    public Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        var orders = _store.Orders
            .Where(o => !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToList();

        return Task.FromResult<IEnumerable<Order>>(orders);
    }

    private static void Validate(CreateOrderRequest r)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(r.ClientName)) errors.Add("Client name is required.");
        if (string.IsNullOrWhiteSpace(r.ClientEmail)) errors.Add("Client email is required.");
        if (string.IsNullOrWhiteSpace(r.ClientPhone)) errors.Add("Client phone is required.");
        if (string.IsNullOrWhiteSpace(r.SelectedColor)) errors.Add("Selected color is required.");
        if (string.IsNullOrWhiteSpace(r.SelectedFabric)) errors.Add("Selected fabric is required.");
        if (r.DesignId <= 0) errors.Add("A valid design must be selected.");
        if (r.MeasurementId <= 0) errors.Add("A valid measurement record must be provided.");
        if (r.Quantity < 1) errors.Add("Quantity must be at least 1.");

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }
}
