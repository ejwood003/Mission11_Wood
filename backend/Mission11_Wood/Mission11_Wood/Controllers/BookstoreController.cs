using Microsoft.AspNetCore.Mvc;
using Mission11_Wood.Data;

namespace Mission11_Wood.Controllers;

/// <summary>
/// API endpoints for browsing books in the bookstore catalog.
/// </summary>
[ApiController]
[Route("[controller]")]
public class BookstoreController : ControllerBase
{
    // EF Core context used to query the Books table.
    private BookstoreContext _bookContext;

    public BookstoreController(BookstoreContext temp)
    {
        _bookContext = temp;
    }

    /// <summary>
    /// Returns a page of books with optional sorting by title (A–Z or Z–A).
    /// Pagination is applied after sorting so page order matches the chosen sort.
    /// </summary>
    /// <param name="pageHowMany">Number of books per page.</param>
    /// <param name="pageNum">1-based page index.</param>
    /// <param name="sortTitleAsc">When true, sort by title ascending; when false, descending.</param>
    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageHowMany = 5, int pageNum = 1, bool sortTitleAsc = true, [FromQuery] List<string>? categories = null)
    {
        var query = _bookContext.Books.AsQueryable();

        if (categories != null && categories.Any())
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        var totalNumBooks = query.Count();

        // Build a sorted query first; Skip/Take must run after OrderBy for correct paging.
        IQueryable<Book> ordered = sortTitleAsc
            ? query.OrderBy(b => b.Title)
            : query.OrderByDescending(b => b.Title);

        var pageOfBooks = ordered
            .Skip((pageNum - 1) * pageHowMany)
            .Take(pageHowMany)
            .ToList();

        var someObject = new
        {
            Books = pageOfBooks,
            TotalNumBooks = totalNumBooks
        };

        return Ok(someObject);
    }

    [HttpGet("GetCategories")]
    public IActionResult GetCategories()
    {
        var categories = _bookContext.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();
        
        return Ok(categories);
    }

    [HttpGet("Book/{bookId:int}")]
    public IActionResult GetBookById(int bookId)
    {
        // Lightweight lookup endpoint used by AddToCartPage to fetch trusted unit price.
        var book = _bookContext.Books.FirstOrDefault(b => b.BookId == bookId);
        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }


    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _bookContext.Books.Add(newBook);
        _bookContext.SaveChanges();
        return Ok(newBook);
    }

    [HttpPut("UpdateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _bookContext.Books.Find(bookId);

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.Isbn = updatedBook.Isbn;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _bookContext.Books.Update(existingBook);
        _bookContext.SaveChanges();

        return Ok(existingBook);
    }

    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _bookContext.Books.Find(bookId);

        if (book == null)
        {
            return NotFound(new {message = "Book not found"});
        }

        _bookContext.Books.Remove(book);
        _bookContext.SaveChanges();

        return NoContent();
    }

}