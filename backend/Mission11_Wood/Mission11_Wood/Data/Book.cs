using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mission11_Wood.Data;

/// <summary>
/// Entity mapped to the Books table. Field names and types match the SQLite schema.
/// </summary>
public partial class Book
{
    [Key] [Required]
    public int BookId { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Author { get; set; }

    [Required]
    public string Publisher { get; set; }

    [Required]
    public string Isbn { get; set; }

    [Required]
    public string Classification { get; set; }

    [Required]
    public string Category { get; set; }

    [Required]
    public int PageCount { get; set; }

    [Required]
    public double Price { get; set; }
}
