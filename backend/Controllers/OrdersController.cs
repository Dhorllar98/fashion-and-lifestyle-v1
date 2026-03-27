using FashionLifestyle.API.Application.Common.Responses;
using FashionLifestyle.API.Application.DTOs.Orders;
using FashionLifestyle.API.Application.Interfaces;
using FashionLifestyle.API.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionLifestyle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        var result = await _orderService.CreateOrderAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new OkResponse<Order>(result, "Order placed successfully."));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        return Ok(new OkResponse<Order>(order));
    }

    [HttpGet("track/{orderNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> TrackOrder(string orderNumber)
    {
        var tracking = await _orderService.TrackOrderAsync(orderNumber);
        return Ok(new OkResponse<OrderTrackingResponse>(tracking));
    }

    [HttpGet("client/{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var orders = await _orderService.GetOrdersByEmailAsync(email);
        return Ok(new OkResponse<IEnumerable<Order>>(orders));
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var order = await _orderService.UpdateOrderStatusAsync(id, request.Status, request.Note);
        return Ok(new OkResponse<Order>(order, "Order status updated."));
    }
}
