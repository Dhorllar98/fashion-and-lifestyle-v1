using FashionLifestyle.API.Application.DTOs.Orders;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using FashionLifestyle.API.Domain.Enums;
using FashionLifestyle.API.Domain.Exceptions;
using FashionLifestyle.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FashionLifestyle.API.Application.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;
    private readonly IAuditLogger _audit;

    public OrderService(AppDbContext db, IAuditLogger audit)
    {
        _db = db;
        _audit = audit;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        Validate(request);

        var design = await _db.Designs.FirstOrDefaultAsync(d => d.Id == request.DesignId && !d.IsDeleted)
            ?? throw new NotFoundException($"Design with ID {request.DesignId} was not found.");

        if (design.StockQuantity == 0)
            throw new OutOfStockException(design.Name);

        if (request.Quantity > design.StockQuantity)
            throw new ValidationException(
                $"Requested quantity ({request.Quantity}) exceeds available stock ({design.StockQuantity}) for '{design.Name}'.");

        // Deduct stock
        design.StockQuantity -= request.Quantity;
        design.UpdatedAt = DateTime.UtcNow;

        var order = new Order
        {
            OrderNumber     = string.Empty,   // set after first save once Id is known
            ClientName      = request.ClientName.Trim(),
            ClientEmail     = request.ClientEmail.Trim().ToLower(),
            ClientPhone     = request.ClientPhone.Trim(),
            DesignId        = request.DesignId,
            MeasurementId   = request.MeasurementId,
            SelectedColor   = request.SelectedColor.Trim(),
            SelectedFabric  = request.SelectedFabric.Trim(),
            Quantity        = request.Quantity,
            TotalAmount     = design.Price * request.Quantity,
            Status          = OrderStatus.InProduction,
            OrderDate       = DateTime.UtcNow,
            EstimatedDelivery = DateTime.UtcNow.AddDays(14),
            CreatedAt       = DateTime.UtcNow,
            CreatedBy       = request.ClientEmail
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(); // EF sets order.Id

        order.OrderNumber = $"FAL-{DateTime.UtcNow.Year}-{order.Id:D4}";
        await _db.SaveChangesAsync();

        // Attach the already-fetched design so callers can read it without a second query
        order.Design = design;

        _audit.Log("Create", "Order", new { order.OrderNumber, order.ClientEmail, order.TotalAmount });
        return order;
    }

    public async Task<Order> GetOrderByIdAsync(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Design)
            .Include(o => o.Measurement)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted)
            ?? throw new NotFoundException($"Order with ID {id} was not found.");

        return order;
    }

    public async Task<OrderTrackingResponse> TrackOrderAsync(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
            throw new ValidationException("Order number is required.");

        var upper = orderNumber.Trim().ToUpper();
        var order = await _db.Orders
            .FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == upper && !o.IsDeleted)
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
        return response;
    }

    public async Task<Order> UpdateOrderStatusAsync(int id, OrderStatus status, string? note = null)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted)
            ?? throw new NotFoundException($"Order with ID {id} was not found.");

        order.Status    = status;
        order.UpdatedAt = DateTime.UtcNow;

        if (note is not null)
            order.TrackingNote = note;

        if (status == OrderStatus.Delivered)
            order.DeliveredAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        _audit.Log("UpdateStatus", "Order", new { id, status, note });
        return order;
    }

    public async Task<IEnumerable<Order>> GetOrdersByEmailAsync(string email)
    {
        var emailLower = email.Trim().ToLower();
        return await _db.Orders
            .Include(o => o.Design)
            .Where(o => o.ClientEmail == emailLower && !o.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        return await _db.Orders
            .Include(o => o.Design)
            .Where(o => !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    private static void Validate(CreateOrderRequest r)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(r.ClientName))   errors.Add("Client name is required.");
        if (string.IsNullOrWhiteSpace(r.ClientEmail))  errors.Add("Client email is required.");
        if (string.IsNullOrWhiteSpace(r.ClientPhone))  errors.Add("Client phone is required.");
        if (string.IsNullOrWhiteSpace(r.SelectedColor)) errors.Add("Selected color is required.");
        if (string.IsNullOrWhiteSpace(r.SelectedFabric)) errors.Add("Selected fabric is required.");
        if (r.DesignId <= 0)      errors.Add("A valid design must be selected.");
        if (r.MeasurementId <= 0) errors.Add("A valid measurement record must be provided.");
        if (r.Quantity < 1)       errors.Add("Quantity must be at least 1.");

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }
}
