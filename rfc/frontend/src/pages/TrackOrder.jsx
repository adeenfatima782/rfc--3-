import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 Minutes baseline default countdown
  const [error, setError] = useState("");
  
  // Adaptive rider mapping center nodes synchronizer
  const [mapCenter, setMapCenter] = useState([31.5204, 74.3587]); // Default Sahiwal / Punjab coordinates baseline

  // Automatic state countdown runtime clock engine
  useEffect(() => {
    let timer;
    if (
      orderStatus &&
      orderStatus.status !== "Delivered" &&
      orderStatus.status !== "Cancelled" &&
      orderStatus.status !== "Rejected"
    ) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [orderStatus]);

  // Formatter parser to render seconds as MM:SS framework strings
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Main background dispatcher to extract operational order tracking logs
  const handleTrack = async () => {
    let searchId = orderId.trim().toUpperCase();
    if (!searchId) {
      setError("");
      return toast.error("Please provide a valid transaction search tracker identifier!");
    }

    if (!searchId.startsWith("RFC-")) {
      searchId = "RFC-" + searchId;
    }

    const loadToast = toast.loading("Connecting with RFC Logistics Cloud...");

    try {
      const res = await fetch(`http://localhost:5000/api/orders/track/${searchId}`);
      const data = await res.json();
      toast.dismiss(loadToast);

      if (res.ok && data) {
        setOrderStatus(data);
        setError("");
        toast.success("Live dispatch metrics updated! ⚡");

        // Sync leaf maps marker to coordinates pushed on database during checkout
        if (data.location && data.location.lat) {
          setMapCenter([data.location.lat, data.location.lng]);
        } else if (data.order?.location?.lat) {
          setMapCenter([data.order.location.lat, data.order.location.lng]);
        }
      } else {
        setError("Order references not found in active database registries!");
        setOrderStatus(null);
        toast.error("Invalid transaction query reference.");
      }
    } catch (err) {
      toast.dismiss(loadToast);
      console.error("Tracking log communication sync crash:", err);
      setError("Network logistics communication failure.");
    }
  };

  // Timeline active color status index selectors array helpers
  const statuses = ["Pending", "Confirmed", "Preparing", "On Way", "Delivered"];
  const getCurrentStepIndex = () => {
    if (!orderStatus) return -1;
    return statuses.indexOf(orderStatus.status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 font-montserrat flex flex-col items-center">
      
      {/* HEADER SECTION COMPONENTS BLOCK */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-red-600 italic uppercase tracking-tighter">
          Track <span className="text-gray-900">RFC Order</span>
        </h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          Real-time Satellite Delivery Tracking System
        </p>
      </div>

      {/* CORE CONTAINER WORKSPACE VIEW CARD */}
      <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-2xl w-full max-w-xl border-t-8 border-red-600 border border-gray-100 space-y-6 relative z-10">
        
        {/* INPUT TRANSACTION TRACKER ROW PANELS */}
        <div className="flex gap-2">
          <input
            placeholder="Enter Code (e.g., 4B1C2A)"
            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-red-600 focus:bg-white font-black uppercase text-xl transition-all placeholder-gray-300 tracking-wider text-center"
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          />
          <button
            onClick={handleTrack}
            className="bg-red-600 text-white px-8 rounded-2xl font-black hover:bg-red-700 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-md shadow-red-100"
          >
            Go
          </button>
        </div>

        {/* ORDER TRACKING LOGISTICS MONITOR RENDERING */}
        {orderStatus && (
          <div className="space-y-6 pt-2">
            
            {/* COMPACT CLOCK MODULES BLOCK */}
            <div className="bg-gray-900 text-white p-6 rounded-3xl text-center shadow-xl border border-black relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Estimated Delivery Window
              </p>
              <h3 className="text-5xl font-black text-yellow-400 mt-2 tracking-tight">
                {orderStatus.status === "Delivered" ? "00:00" : formatTime(timeLeft)}
              </h3>
              <p className="text-[10px] mt-3 font-bold text-gray-300 bg-white/5 border border-white/10 px-4 py-2 inline-block rounded-full">
                📢 Your bucket is currently: <span className="text-red-400 uppercase font-black">{orderStatus.status}</span>
              </p>
            </div>

            {/* PROFESSIONAL VISUAL STEP TIMELINE CHANNELS BLOCK */}
            <div className="flex justify-between items-center px-2 py-4 border-y border-gray-100">
              {statuses.map((step, idx) => {
                const isActive = idx <= getCurrentStepIndex();
                return (
                  <div key={step} className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 z-10 ${
                        isActive ? "bg-red-600 text-white scale-110 shadow-md" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase tracking-tighter mt-2 text-center w-12 truncate ${
                        isActive ? "text-gray-900 font-black" : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                    {idx < statuses.length - 1 && (
                      <div
                        className={`absolute top-3 left-1/2 w-full h-1 transition-all duration-500 -z-0 ${
                          idx < getCurrentStepIndex() ? "bg-red-600" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* RESPONSIVE LOGISTICS BIKE MOVEMENT ROW CONTROLLER */}
            <div className="relative h-14 bg-gray-50 rounded-2xl overflow-hidden border border-dashed border-gray-200 flex items-center px-4 w-full">
              <motion.div
                animate={{
                  x: orderStatus.status === "On Way" ? ["0%", "85%"] : "0%",
                  opacity: orderStatus.status === "On Way" ? 1 : 0.4,
                  scale: orderStatus.status === "On Way" ? [1, 1.05, 1] : 1
                }}
                transition={{
                  repeat: orderStatus.status === "On Way" ? Infinity : 0,
                  duration: 5,
                  ease: "linear",
                }}
                className="text-3xl relative z-10"
              >
                🛵
              </motion.div>
              <div className="absolute right-4 text-2xl opacity-40">🏠</div>
            </div>

            {/* LIVE Leaflet ROUTING MAPS MODULE */}
            {(orderStatus.status === "On Way" || orderStatus.status === "Delivered") && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block text-left">
                  Live Dispatch Satellite Location
                </label>
                <div className="h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-white relative z-10">
                  <MapContainer center={mapCenter} zoom={15} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={mapCenter}>
                      <Popup className="font-montserrat font-bold text-xs">
                        {orderStatus.status === "Delivered" ? "Meal Drop point Confirmed! 🍗" : "Rider carrying your crispy zinger! 🛵"}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOGISTICS FAIL STATUS METRIC REVENUE WARNINGS */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl text-center">
            <p className="text-red-600 font-black text-xs uppercase tracking-wider">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
