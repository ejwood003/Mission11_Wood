import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { CartItem } from "../types/CartItem";
import type { Book } from "../types/Book";

function AddToCartPage() {
    const navigate = useNavigate();
    const { bookName, bookId } = useParams();
    const {addToCart} = useCart();
    const [book, setBook] = useState<Book | null>(null);
    // Quantity is user-entered; price always comes from the selected book record.
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        const loadBook = async () => {
            if (!bookId) return;
            // Pull fresh book data so cart pricing cannot be typed/overridden by the user.
            const response = await fetch(`https://localhost:5000/Bookstore/Book/${bookId}`);
            if (!response.ok) return;
            const data = (await response.json()) as Book;
            setBook(data);
        };

        loadBook();
    }, [bookId]);

    const handleAddToCart = () => {
        if (!book) return;

        // Guardrails: force a positive integer before writing quantity into cart state.
        const safeQty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
        const newItem: CartItem = {
            bookId: Number(bookId),
            title: book.title,
            unitPrice: book.price,
            quantity: safeQty,
        };
        addToCart(newItem);
        navigate('/cart');
    }
    
    
    return(
        <>
            <WelcomeBand />
            <h2>{book?.title ?? bookName ?? "No Book Found"}</h2>

            <div>
                <p>Unit price: ${book?.price?.toFixed(2) ?? "--"}</p>
                <label htmlFor="quantityInput">Quantity: </label>
                <input 
                    id="quantityInput"
                    type="number" 
                    min={1}
                    step={1}
                    placeholder="Quantity" 
                    value={quantity} 
                    onChange={(x) => setQuantity(Number(x.target.value))}
                />
                <p>
                    Line total: $
                    {book ? (book.price * (Number.isFinite(quantity) ? quantity : 0)).toFixed(2) : "--"}
                </p>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>

            <button onClick={() => navigate('/')}>Go Back</button>
        </>
    );
}
export default AddToCartPage;