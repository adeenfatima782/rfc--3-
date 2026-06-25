import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

// MAP CLICK HANDLER
function MapEventsHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);

      toast.success("Delivery pin coordinate updated! 📍", {
        id: "map-click",
      });
    },
  });

  return null;
}

function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  // FORM STATES
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("COD");

  // DEFAULT LOCATION
  const [position, setPosition] = useState([31.5204, 74.3587]);

  // BILLING STATE
  const [billing, setBilling] = useState({
    subtotal: 0,
    deliveryFee: 200,
    tax: 0,
    finalTotal: 0,
  });

  // LOAD BILLING
  useEffect(() => {
    if (!cart || cart.length === 0) {
      toast.error("Your food bucket is empty. Redirecting to menu...");
      navigate("/");
      return;
    }

    const savedSubtotal =
      Number(localStorage.getItem("rfc_subtotal")) || 0;

    const savedTax =
      Number(localStorage.getItem("rfc_tax")) || 0;

    const savedTotal =
      Number(localStorage.getItem("rfc_final_total")) ||
      savedSubtotal + 200;

    setBilling({
      subtotal: savedSubtotal,
      deliveryFee: savedSubtotal > 0 ? 200 : 0,
      tax: savedTax,
      finalTotal: savedTotal,
    });
  }, [cart, navigate]);

  // PLACE ORDER
  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Session expired. Please re-authenticate your profile!"
      );

      return navigate("/login");
    }

    if (!address.trim() || address.trim().length < 10) {
      return toast.error(
        "Please insert a complete delivery address!"
      );
    }

    const loadingToast = toast.loading(
      "Processing your crispy food order... 🍗"
    );

    try {
      const res = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: cart,
            total: billing.finalTotal,
            address: address.trim(),
            paymentMethod: payment,

            location: {
              lat: position[0],
              lng: position[1],
            },
          }),
        }
      );

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (res.ok && data.success) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } 
              max-w-md w-full bg-white shadow-2xl rounded-2xl 
              pointer-events-auto flex ring-1 ring-black ring-opacity-5 
              p-4 border-l-8 border-green-500 font-montserrat`}
            >
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900 uppercase">
                  RFC Order Placed! 🎉
                </p>

                <p className="mt-1 text-xs font-bold text-gray-500">
                  ID: {data.shortId} via {payment}
                </p>
              </div>
            </div>
          ),
          { duration: 5000 }
        );

        // CLEAR LOCAL STORAGE
        localStorage.removeItem("cart");
        localStorage.removeItem("rfc_subtotal");
        localStorage.removeItem("rfc_discount");
        localStorage.removeItem("rfc_tax");
        localStorage.removeItem("rfc_final_total");

        clearCart();

        navigate("/track-order");
      } else {
        toast.error(
          data.message ||
            "Logistics system rejected order validation schemas."
        );
      }
    } catch (err) {
      toast.dismiss(loadingToast);

      console.error("Checkout submission crash:", err);

      toast.error(
        "Network communication failure with RFC Cloud servers."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 font-montserrat">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[35px] shadow-xl border border-gray-100 space-y-6">

          {/* Heading */}
          <div className="border-b pb-3">
            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">
              Delivery <span className="text-red-600">Details</span>
            </h2>

            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              Specify dispatch coordinates and street metrics
            </p>
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
              Full Physical Street Address
            </label>

            <textarea
              placeholder="Apartment/House#, Street Name, Block, Nearby Landmark..."
              className="w-full border-2 border-gray-100 bg-gray-50/50 p-4 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition-all font-semibold text-sm leading-relaxed text-gray-800"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* MAP */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
              Geographic Delivery Location Pin
            </label>

            <div className="h-56 rounded-2xl overflow-hidden border-2 border-red-100 shadow-md relative z-10">

              <MapContainer
                center={position}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                  position={position}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const latlng = e.target.getLatLng();

                      setPosition([
                        latlng.lat,
                        latlng.lng,
                      ]);
                    },
                  }}
                >
                  <Popup className="font-montserrat font-bold text-xs">
                    Drop my meal here! 🍔
                  </Popup>
                </Marker>

                <MapEventsHandler
                  setPosition={setPosition}
                />
              </MapContainer>
            </div>

            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider italic">
              * Drag the marker or click anywhere on the map to
              set your delivery location.
            </p>
          </div>

          {/* PAYMENT METHODS */}
          <div className="space-y-3 pt-2">

            <h3 className="text-sm font-black uppercase text-gray-700 tracking-wide">
              Select Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">

              {["COD", "JazzCash", "EasyPaisa", "Card"].map(
                (m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-3 border-2 p-4 rounded-2xl cursor-pointer transition-all ${
                      payment === m
                        ? "border-red-600 bg-red-50/40 text-red-600 font-black shadow-sm scale-[1.01]"
                        : "border-gray-100 bg-gray-50/20 font-bold text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay_framework"
                      value={m}
                      checked={payment === m}
                      className="accent-red-600 h-4 w-4 cursor-pointer"
                      onChange={() => setPayment(m)}
                    />

                    <span className="text-sm uppercase tracking-wide">
                      {m === "COD"
                        ? "Cash On Delivery"
                        : m}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-5 bg-gray-900 text-white p-6 md:p-8 rounded-[35px] shadow-2xl border border-black h-fit flex flex-col justify-between space-y-6">

          {/* Order Items */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-red-500 border-b border-gray-800 pb-3 italic">
              Order Ledger
            </h2>

            <div className="divide-y divide-gray-800/60 max-h-48 overflow-y-auto pr-2 mt-4 space-y-2 scrollbar-hide">

              {cart.map((i) => (
                <div
                  key={i._id}
                  className="flex justify-between items-center text-xs font-bold pt-2"
                >
                  <span className="text-gray-400 truncate max-w-[200px]">
                    <span className="text-red-500 font-black pr-1">
                      x{i.qty || 1}
                    </span>

                    {i.name}
                  </span>

                  <span className="text-gray-200">
                    Rs {i.price * (i.qty || 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BILLING */}
          <div className="border-t border-gray-800 pt-4 space-y-3 text-xs font-bold text-gray-400">

            <p className="flex justify-between">
              <span>Gross Items Price:</span>

              <span className="text-white">
                Rs {billing.subtotal}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Rider Delivery Routing:</span>

              <span className="text-white">
                Rs {billing.deliveryFee}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Regional Excise GST Tax:</span>

              <span className="text-white">
                Rs {billing.tax}
              </span>
            </p>

            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">

              <span className="text-lg font-black uppercase text-white">
                Total Net Amount:
              </span>

              <span className="text-2xl font-black text-red-500">
                Rs {billing.finalTotal}
              </span>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
              onClick={placeOrder}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 mt-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/20 transition-all active:scale-[0.98]"
            >
              Transmit Secure Order 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;