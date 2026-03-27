namespace FashionLifestyle.API.Domain.Exceptions;

public class OutOfStockException : Exception
{
    public OutOfStockException(string designName)
        : base($"'{designName}' is Out of Stock.") { }
}
