import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import LocationModal from "./LocationModal";

import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSearch,
  FaMicrophone,
} from "react-icons/fa";

import toast from "react-hot-toast";

function Navbar({ darkMode, setDarkMode }) {

  const [openLocation, setOpenLocation] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [search, setSearch] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = cart.reduce(
    (total, item) => total + (item.qty || 1),
    0
  );


  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };


  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    navigate(`/?search=${value}`);
  };


  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice search not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      toast("Listening... Speak now 🎤", {
        icon: "🎧",
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setSearch(transcript);

      navigate(`/?search=${transcript}`);

      toast.success(`Searching for: ${transcript}`);
    };

    recognition.onerror = () => {
      toast.error("Voice search failed");
    };

    recognition.start();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black text-white shadow-2xl border-b border-red-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-3xl hover:text-red-500 transition"
            >
              ☰
            </button>

            <Link
              to="/"
              className="text-5xl font-black italic tracking-tighter text-red-600"
            >
              RFC
            </Link>
          </div>

          {/* CENTER */}
          <div className="hidden lg:flex items-center gap-6">

            {/* SEARCH DESKTOP */}
            <div className="flex items-center bg-white rounded-full px-5 py-3 w-[350px] border-2 border-red-600 shadow-xl relative">
              
              <FaSearch className="text-gray-500 text-lg" />

              <input
                type="text"
                placeholder="Search burgers, deals..."
                value={search}
                onChange={handleSearch}
                className="bg-transparent outline-none px-3 text-black w-full font-semibold"
              />

              {/* MIC BUTTON */}
              <button
                onClick={startVoiceSearch}
                className="text-red-600 hover:scale-125 transition ml-2"
              >
                <FaMicrophone />
              </button>
            </div>

            {/* DELIVERY / PICKUP */}
            <div className="flex bg-[#1a1a1a] rounded-full p-1 border border-red-600">
              
              <button
                onClick={() => setDeliveryType("delivery")}
                className={`px-5 py-2 rounded-full font-bold transition ${
                  deliveryType === "delivery"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300"
                }`}
              >
                Delivery
              </button>

              <button
                onClick={() => setDeliveryType("pickup")}
                className={`px-5 py-2 rounded-full font-bold transition ${
                  deliveryType === "pickup"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300"
                }`}
              >
                Pickup
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className="hover:text-red-500 uppercase text-sm font-extrabold"
            >
              Home
            </Link>

            <Link
              to="/track-order"
              className="hover:text-red-500 uppercase text-sm font-extrabold"
            >
              Track Order
            </Link>

            {/* CART */}
            <Link to="/cart" className="relative">
              
              <FaShoppingCart size={26} />

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
            {token ? (
              <div className="relative">

                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FaUserCircle size={32} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-14 bg-black border border-red-600 rounded-xl w-52 overflow-hidden">

                    <Link
                      to="/profile"
                      className="block px-5 py-4 hover:bg-red-600 transition border-b border-gray-800"
                    >
                      👤 My Profile
                    </Link>

                    {role === "admin" && (
                      <>
                        <Link
                          to="/admin"
                          className="block px-4 py-3 hover:bg-red-600"
                        >
                          Admin Panel
                        </Link>

                        <Link
                          to="/admin-orders"
                          className="block px-4 py-3 hover:bg-red-600"
                        >
                          All Orders
                        </Link>
                      </>
                    )}

                    <Link
                      to="/orders"
                      className="block px-4 py-3 hover:bg-red-600"
                    >
                      My Orders
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 px-5 py-2 rounded-full"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-black px-6 py-6 space-y-5">

            {/* MOBILE SEARCH */}
            <div className="flex items-center bg-white rounded-full px-4 py-3 border border-red-600">

              <FaSearch className="text-gray-500" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="bg-transparent outline-none px-3 text-black w-full"
              />

              {/* MOBILE MIC */}
              <button
                onClick={startVoiceSearch}
                className="text-red-600 ml-2"
              >
                <FaMicrophone />
              </button>
            </div>

            <Link to="/">Home</Link>

            <Link to="/track-order">
              Track Order
            </Link>

            <Link to="/cart">
              Cart ({cartCount})
            </Link>

            {token ? (
              <>
                <Link to="/orders">
                  My Orders
                </Link>

                {role === "admin" && (
                  <>
                    <Link to="/admin">
                      Admin
                    </Link>

                    <Link to="/admin-orders">
                      All Orders
                    </Link>
                  </>
                )}

                <button
                  onClick={logout}
                  className="text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* LOCATION MODAL */}
      <LocationModal
        isOpen={openLocation}
        onClose={() => setOpenLocation(false)}
      />
    </>
  );
}

export default Navbar;