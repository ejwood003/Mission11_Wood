import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types/CartItem";

function CartPage () {
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();
    // Page-level total derived from quantity * unit price for each line item.
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return(
        <div className="container mt-4">
            <h2>Your cart</h2>
            <div>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul className="list-group mb-3">
                        {cart.map((item: CartItem) => (
                            <li
                                key={item.bookId}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <div className="fw-semibold">{item.title}</div>
                                    <div className="text-muted small">
                                        Qty: {item.quantity} @ ${item.unitPrice.toFixed(2)}
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="fw-semibold">
                                        ${(item.unitPrice * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeFromCart(item.bookId)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Total: ${total.toFixed(2)}</h3>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary">Checkout</button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Continue Browsing</button>
                </div>
            </div>

        </div>
    );
}

export default CartPage;