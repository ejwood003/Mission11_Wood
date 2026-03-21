using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Mission11_Wood.Data;

/// <summary>
/// EF Core database context for the bookstore SQLite database.
/// </summary>
public partial class BookstoreContext : DbContext
{
    public BookstoreContext()
    {
    }

    public BookstoreContext(DbContextOptions<BookstoreContext> options)
        : base(options)
    {
    }

    /// <summary>Books table — maps to the Book entity.</summary>
    public virtual DbSet<Book> Books { get; set; }
}