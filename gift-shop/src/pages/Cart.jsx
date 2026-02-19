import { useNavigate } from "react-router-dom";
//checked / database

function Cart() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map((item, i) => (
        <p key={i}>{item.name} - ₹{item.price}</p>
      ))}
      <h3>Total: ₹{total}</h3>
      <button onClick={() => navigate("/checkout")}>Checkout</button>
    </div>
  );
}

export default Cart;
