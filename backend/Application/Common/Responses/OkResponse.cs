namespace FashionLifestyle.API.Application.Common.Responses;

public class OkResponse<T> : ApiBaseResponse<T>
{
    public OkResponse(T data, string message = "Request successful.")
    {
        Success = true;
        Message = message;
        Data = data;
    }
}
