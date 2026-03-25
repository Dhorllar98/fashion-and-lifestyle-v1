using FashionLifestyle.API.Models;
using FashionLifestyle.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FashionLifestyle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Order order)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _orderService.CreateOrderAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order is null) return NotFound();
        return Ok(order);
    }

    [HttpGet("track/{orderNumber}")]
    public async Task<IActionResult> TrackOrder(string orderNumber)
    {
        var order = await _orderService.GetOrderByNumberAsync(orderNumber);
        if (order is null) return NotFound(new { message = "Order not found. Please check your order number." });
        return Ok(new
        {
            order.OrderNumber,
            order.ClientName,
            order.Status,
            order.TrackingNote,
            order.OrderDate,
            order.EstimatedDelivery,
            order.DeliveredAt
        });
    }

    [HttpGet("client/{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var orders = await _orderService.GetOrdersByEmailAsync(email);
        return Ok(orders);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var order = await _orderService.UpdateOrderStatusAsync(id, request.Status, request.Note);
        if (order is null) return NotFound();
        return Ok(order);
    }
}

public record UpdateStatusRequest(OrderStatus Status, string? Note);
