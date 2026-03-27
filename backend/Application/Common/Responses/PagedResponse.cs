namespace FashionLifestyle.API.Application.Common.Responses;

public class PagedResponse<T> : ApiBaseResponse<IEnumerable<T>>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;

    public PagedResponse(IEnumerable<T> data, int page, int pageSize, int totalCount, string message = "Request successful.")
    {
        Success = true;
        Message = message;
        Data = data;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
}
