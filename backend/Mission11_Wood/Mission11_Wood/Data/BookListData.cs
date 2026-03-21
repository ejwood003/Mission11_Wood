namespace Mission11_Wood.Data;

/// <summary>
/// DTO shape for returning a book list plus total count (optional use with typed responses).
/// </summary>
public class BookListData
{
    public List<Book> Books { get; set; }
    public int TotalNumBooks { get; set; }
}