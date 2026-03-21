using Microsoft.AspNetCore.Mvc;
using Mission11_Wood.Data;

namespace Mission11_Wood.Controllers;

[ApiController]
[Route("[controller]")]
public class BookstoreController : ControllerBase
{
    private BookstoreContext _bookContext;
    public BookstoreController(BookstoreContext temp)
    {
        _bookContext = temp;
    }
    
    [HttpGet("AllBooks")]
    public IActionResult GetProjects(int pageHowMany = 5, int pageNum = 1)
    {
        var something = _bookContext.Books
            .Skip((pageNum-1) * pageHowMany)
            .Take(pageHowMany)
            .ToList();
        
        var totalNumBooks = _bookContext.Books.Count();

        var someObject = new
        {
            Books = something,
            TotalNumBooks = totalNumBooks
        };
        
        return Ok(someObject);
    }

}