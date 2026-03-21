import { useEffect, useState } from "react";
import type { Book } from './types/Book.ts'

/**
 * Book catalog: fetches paginated rows from the API, supports sort by title and page size.
 */
function BookList () {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    // Total rows in the database (used for page count and labels).
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    // Matches API query param sortTitleAsc: true = A–Z, false = Z–A.
    const [sortTitleAsc, setSortTitleAsc] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(
                `https://localhost:5000/Bookstore/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}&sortTitleAsc=${sortTitleAsc}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
            // Use server count from this response so page math is not stale (closure issue with totalItems).
            setTotalPages(Math.ceil(totalItems / pageSize));
        };
        fetchBooks();
    }, [pageSize, pageNum, totalItems, sortTitleAsc]);

    return (
        <>
            <h1>Spenny's Books</h1>
            <br />
            {/* Sort by title — server applies OrderBy before Skip/Take */}
            <div className="mb-3">
                <label className="form-label me-2">Sort by title:</label>
                <select
                    className="form-select d-inline-block w-auto"
                    value={sortTitleAsc ? "asc" : "desc"}
                    onChange={(e) => {
                        setSortTitleAsc(e.target.value === "asc");
                        setPageNum(1);
                    }}
                >
                    <option value="asc">A → Z</option>
                    <option value="desc">Z → A</option>
                </select>
            </div>

            {books.map((b) =>
                <div id="bookCard" className="card" key={b.bookId}>
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body" >
                        <ul className="list-unstyled">
                            <li><strong>Author:</strong> {b.author}</li>
                            <li><strong>Publisher: </strong>{b.publisher}</li>
                            <li><strong>Isbn: </strong>{b.isbn}</li>
                            <li><strong>Genre: </strong>{b.classification}</li>
                            <li><strong>Category: </strong>{b.category}</li>
                            <li><strong>Number of Pages: </strong>{b.pageCount}</li>
                            <li><strong>Price: </strong>${b.price}</li>
                        </ul>
                    </div>

                </div>
            )}

            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

            {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => setPageNum(index +1)} disabled={pageNum === (index + 1)}>
                    {index + 1}
                </button>
            ))}

            <button disabled={pageNum === totalPages || totalPages === 0} onClick={() => setPageNum(pageNum + 1)}>Next</button>

            <br />
            <label>
                Results per page:
                <select
                value={pageSize}
                onChange={(p) => {
                    setPageSize(Number(p.target.value));
                    setPageNum(1);

                }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;