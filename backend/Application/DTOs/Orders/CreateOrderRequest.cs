namespace FashionLifestyle.API.Application.DTOs.Orders;

public record CreateOrderRequest(
    string ClientName,
    string ClientEmail,
    string ClientPhone,
    int DesignId,
    int MeasurementId,
    string SelectedColor,
    string SelectedFabric,
    int Quantity
);
