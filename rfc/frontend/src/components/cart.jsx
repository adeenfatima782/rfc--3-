import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaShoppingBag,
} from "react-icons/fa";
import toast from "react-hot-toast";
function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } =
    useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/cart-coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.isSubscriber) {
            setIsSubscriber(true);
            setAvailableCoupons(data.coupons || []);
          }
        })
        .catch(() => {
          console.log("Coupon fetch sync error");
        });
    }
  }, []);
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      return toast.error("Please enter a coupon code");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return toast.error("Authentication required. Please login first.");
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/coupons/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: couponCode.trim().toUpperCase(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDiscount(data.discount);
        toast.success(`${data.discount}% RFC discount applied! 🎉`);
      } else {
        setDiscount(0);
        toast.error(data.message || "Invalid or expired coupon");
      }
    } catch (error) {
      toast.error("Network error during coupon validation");
    }
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const deliveryFee = subtotal > 0 ? 200 : 0;
  const tax = Math.round(subtotal * 0.05);
  const discountAmount = Math.round((subtotal * discount) / 100);

  const finalTotalPayable =
    subtotal + deliveryFee + tax - discountAmount;

  // Checkout
  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to proceed with your order placement");
      return navigate("/login");
    }

    if (cart.length === 0) {
      return toast.error("Your food bucket is currently empty!");
    }

    localStorage.setItem("rfc_subtotal", subtotal);
    localStorage.setItem("rfc_discount", discountAmount);
    localStorage.setItem("rfc_tax", tax);
    localStorage.setItem("rfc_final_total", finalTotalPayable);

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 font-montserrat">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* Heading */}
          <div className="flex items-center gap-3 border-b pb-4 border-gray-200">
            <FaShoppingBag className="text-red-600 text-3xl" />

            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tight">
              Your <span className="text-red-600">Bucket</span>
            </h2>
          </div>

          {/* Empty Cart */}
          {cart.length === 0 ? (
            <div className="bg-white p-12 rounded-[30px] text-center shadow-xl border border-gray-100 flex flex-col items-center">

              <p className="font-bold text-gray-400 text-lg">
                Your bucket feels light. No food items found.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all"
              >
                Start Ordering Hot Deals
              </button>
            </div>
          ) : (
            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-md border border-gray-100 hover:shadow-lg transition-all gap-4"
                >

                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain bg-gray-50 p-2 rounded-xl"
                      />
                    )}

                    <div>
                      <h3 className="font-black text-gray-800 uppercase tracking-tight text-base leading-tight">
                        {item.name}
                      </h3>

                      <p className="text-red-600 font-black text-sm mt-1">
                        Rs {item.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity + Delete */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">

                    {/* Quantity */}
                    <div className="flex gap-3 items-center border-2 border-gray-100 px-4 py-2 rounded-full bg-gray-50/50">

                      <button
                        onClick={() => updateQty(item._id, -1)}
                        className="text-gray-500 hover:text-red-600 font-black px-1 transition"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="font-black text-sm text-gray-800 min-w-[20px] text-center">
                        {item.qty || 1}
                      </span>

                      <button
                        onClick={() => updateQty(item._id, 1)}
                        className="text-gray-500 hover:text-green-600 font-black px-1 transition"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-600 transition p-2 bg-gray-50 rounded-xl hover:bg-red-50"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-gray-800 transition-all"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-2xl border border-gray-100 h-fit">

          <h3 className="font-black mb-6 uppercase text-lg text-gray-800 border-b pb-3 tracking-tight">
            Order Summary
          </h3>

          {/* Pricing */}
          <div className="space-y-4 text-sm font-semibold text-gray-500 border-b pb-4">

            <p className="flex justify-between">
              <span>Subtotal Items Cost</span>
              <span className="text-gray-900 font-black">
                Rs {subtotal}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Standard Delivery Rider Fee</span>
              <span className="text-gray-900 font-black">
                Rs {deliveryFee}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Government GST Tax (5%)</span>
              <span className="text-gray-900 font-black">
                Rs {tax}
              </span>
            </p>

            {discount > 0 && (
              <p className="flex justify-between text-green-600 bg-green-50 p-2 rounded-xl border border-dashed border-green-200">
                <span>Loyalty Discount Applied</span>

                <span className="font-black">
                  -Rs {discountAmount}
                </span>
              </p>
            )}
          </div>

          {/* Total */}
          <div className="my-6 pt-2">
            <div className="flex justify-between items-baseline">

              <h2 className="text-xl font-black text-gray-900 uppercase">
                Net Payable
              </h2>

              <span className="text-3xl font-black text-red-600 italic">
                Rs {finalTotalPayable}
              </span>
            </div>
          </div>

          {/* Coupon */}
          <div className="space-y-2 mt-8">

            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
              Have a restaurant promo?
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="PROMO CODE"
                className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-3 rounded-xl font-black uppercase text-sm outline-none focus:border-red-600 transition-all placeholder-gray-300"
              />

              <button
                onClick={applyCoupon}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-red-600 transition-colors tracking-wider"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Subscriber Coupons */}
          {isSubscriber && availableCoupons.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200">

              <p className="text-[10px] font-black uppercase text-yellow-800 tracking-widest mb-3">
                👑 RFC VIP Loyalty Club Offers
              </p>

              <div className="space-y-3">

                {availableCoupons.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setCouponCode(c.code)}
                    className="w-full bg-white border border-gray-200 hover:border-yellow-500 p-3 flex justify-between items-center text-xs rounded-xl shadow-sm hover:scale-[1.01] transition-all"
                  >
                    <span className="font-black uppercase">
                      {c.code}
                    </span>

                    <span className="text-green-600 font-black">
                      {c.discount}% OFF
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white py-4 mt-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 transition-all active:scale-[0.98]"
          >
            Confirm & Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;