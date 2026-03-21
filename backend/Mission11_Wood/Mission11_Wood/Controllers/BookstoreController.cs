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
    public IActionResult GetProjects(int pageHowMany = 5, int pageNum = 1, bool sortTitleAsc = true)
    {
        // Build a sorted query first; Skip/Take must run after OrderBy for correct paging.
        IQueryable<Book> ordered = sortTitleAsc
            ? _bookContext.Books.OrderBy(b => b.Title)
            : _bookContext.Books.OrderByDescending(b => b.Title);

        var pageOfBooks = ordered
            .Skip((pageNum - 1) * pageHowMany)
            .Take(pageHowMany)
            .ToList();

        var totalNumBooks = _bookContext.Books.Count();

        var someObject = new
        {
            Books = pageOfBooks,
            TotalNumBooks = totalNumBooks
        };

        return Ok(someObject);
    }
}