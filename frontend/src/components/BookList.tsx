import { useEffect, useState } from "react";
import type { Book } from '../types/Book.ts'
import { useNavigate } from "react-router-dom";

/**
 * Book catalog: fetches paginated rows from the API, supports sort by title and page size.
 */
function BookList ({selectedCategories}: {selectedCategories: string[]}) {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    // Total rows in the database (used for page count and labels).
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    // Matches API query param sortTitleAsc: true = A–Z, false = Z–A.
    const [sortTitleAsc, setSortTitleAsc] = useState<boolean>(true);
    // Controls Bootstrap-style details modal for the selected card.
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {

            const categoryParams = selectedCategories
                .map((cat) => `categories=${encodeURIComponent(cat)}`)
                .join('&');
            
            const response = await fetch(
                `https://localhost:5000/Bookstore/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}&sortTitleAsc=${sortTitleAsc}${selectedCategories.length ? `&${categoryParams}` : ''}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
            // Use server count from this response so page math is not stale (closure issue with totalItems).
            setTotalPages(Math.ceil(totalItems / pageSize));
        };
        fetchBooks();
    }, [pageSize, pageNum, totalItems, sortTitleAsc, selectedCategories]);

    return (
        <>
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
                <div id="bookCard" className="card position-relative mb-3" key={b.bookId}>
                    <div className="card-body pb-5">
                        <h3 className="card-title text-center mb-3">{b.title}</h3>
                        <p className="text-center text-muted mb-1">by {b.author}</p>
                        <p className="text-center fw-bold fs-4 mb-3">${b.price.toFixed(2)}</p>
                        <div className="d-flex justify-content-start gap-2 position-absolute bottom-0 start-0 m-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => setSelectedBook(b)}
                            >
                                View Details
                            </button>
                            <button 
                                className="btn btn-success" 
                                onClick={() => navigate(`/add/${b.title}/${b.bookId}`)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    {/* Keep category chip pinned to the lower-right corner of each card. */}
                    <div className="position-absolute bottom-0 end-0 m-2 d-flex gap-1">
                        <span className="badge text-bg-primary small">{b.category}</span>
                    </div>

                </div>
            )}

            {selectedBook && (
                <>
                    {/* Manual Bootstrap modal rendering (state-driven instead of data-bs-toggle attributes). */}
                    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedBook.title}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setSelectedBook(null)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <ul className="list-group">
                                        <li className="list-group-item"><strong>Author:</strong> {selectedBook.author}</li>
                                        <li className="list-group-item"><strong>Publisher:</strong> {selectedBook.publisher}</li>
                                        <li className="list-group-item"><strong>ISBN:</strong> {selectedBook.isbn}</li>
                                        <li className="list-group-item"><strong>Classification:</strong> {selectedBook.classification}</li>
                                        <li className="list-group-item"><strong>Category:</strong> {selectedBook.category}</li>
                                        <li className="list-group-item"><strong>Pages:</strong> {selectedBook.pageCount}</li>
                                        <li className="list-group-item"><strong>Price:</strong> ${selectedBook.price.toFixed(2)}</li>
                                    </ul>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedBook(null)}>
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => navigate(`/add/${selectedBook.title}/${selectedBook.bookId}`)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={() => setSelectedBook(null)} />
                </>
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