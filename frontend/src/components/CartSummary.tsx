import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartSummary = () => {
    const navigate = useNavigate();
    const {cart} = useCart();
    // Compact running total shown in the floating summary card.
    const totalAmount = cart.reduce((sum,item) => sum + item.unitPrice * item.quantity, 0);

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '20px',
            background: '#f8f9fa',
            padding: '10px 15px',
            borderRadius: '8px',
            minWidth: '320px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2',
            fontSize: '14px',
            }}
        >
            <div
                style={{ cursor: 'pointer', marginBottom: '8px', fontSize: '16px' }}
                onClick={() => navigate('/cart')}
            >
                🛒 <strong>Cart Summary</strong>
            </div>

            {cart.length === 0 ? (
                <div>Your cart is empty.</div>
            ) : (
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    {cart.map((item) => (
                        <li key={item.bookId}>
                            {item.title} - Qty: {item.quantity} @ ${item.unitPrice.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ marginTop: '8px', fontWeight: 700 }}>
                Total: ${totalAmount.toFixed(2)}
            </div>
        </div>
    );
};

export default CartSummary;