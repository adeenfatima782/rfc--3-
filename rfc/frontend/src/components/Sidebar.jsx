import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose, darkMode, setDarkMode }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  // ✅ FORCE GOOGLE MAPS OPENER FUNCTION
  const openStoreLocator = (e) => {
    e.preventDefault();
    onClose(); // Sidebar ko close karein
    
    // Google Maps ka pure official satellite embedding search link
    const mapsUrl = "https://google.com";
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* 1. OVERLAY (Backdrop) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      {/* 2. SIDEBAR CONTENT */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] z-[70] transition-transform duration-300 shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          darkMode
            ? "bg-[#121212] text-white border-r border-gray-800"
            : "bg-white text-gray-800"
        }`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto scrollbar-hide">
          
          {/* TOP SECTION: Close & Theme Toggle */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={onClose}
              className={`text-2xl font-bold transition-colors ${
                darkMode ? "hover:text-red-500" : "hover:text-red-600"
              }`}
            >
              ✕
            </button>

            {/* DAY / NIGHT TOGGLE SWITCH */}
            <div
              className={`flex items-center gap-1 p-1 rounded-full border ${
                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-100"
              }`}
            >
              <button
                onClick={() => setDarkMode(false)}
                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                  !darkMode ? "bg-red-600 text-white shadow-md" : "text-gray-500"
                }`}
              >
                DAY
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                  darkMode ? "bg-gray-700 text-red-500" : "text-gray-400"
                }`}
              >
                NIGHT
              </button>
            </div>
          </div>

          {/* 3. USER WELCOME / LOGIN SECTION */}
          {token ? (
            <div className="mb-8">
                <div className={`p-5 rounded-3xl border-l-8 border-red-600 shadow-sm ${darkMode ? 'bg-gray-800/50' : 'bg-red-50'}`}>
                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                        Welcome Back
                    </p>
                    <h2 className={`text-xl font-black uppercase italic truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {userName ? `Hi, ${userName}!` : "RFC Member"}
                    </h2>
                </div>
                {/* ACCOUNT SETTINGS LINK */}
                <Link 
                    to="/profile" 
                    onClick={onClose}
                    className="flex items-center gap-2 mt-4 text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline px-2"
                >
                    ⚙️ Account Settings
                </Link>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase text-center mb-10 tracking-widest shadow-lg hover:bg-red-700 active:scale-95 transition-all"
            >
              Login / Sign Up
            </Link>
          )}

          {/* 4. MAIN NAVIGATION LINKS */}
          <div className="space-y-6">
            
            {/* ✅ FIXED FORCE OPENER: Ab click karne par plain search nahi khul sakti */}
            <button
              onClick={openStoreLocator}
              className={`flex items-center gap-4 cursor-pointer font-black transition-colors group border-none bg-transparent outline-none w-full text-left ${
                darkMode ? "hover:text-red-400 text-gray-300" : "hover:text-red-600 text-gray-800"
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📍</span>
              <span className="uppercase text-sm tracking-tighter">Store Locator</span>
            </button>

            {/* Track Order */}
            <Link
              to="/track-order"
              onClick={onClose}
              className={`flex items-center gap-4 cursor-pointer font-black transition-colors group ${darkMode ? "hover:text-red-400 text-gray-300" : "hover:text-red-600"}`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
              <span className="uppercase text-sm tracking-tighter">Track Order</span>
            </Link>

            {/* FINANCE ANALYTICS (Admin Only) */}
            {role === "admin" && (
              <Link
                to="/admin-finance"
                onClick={onClose}
                className="flex items-center gap-4 cursor-pointer font-black transition-colors group text-yellow-500 hover:text-yellow-400"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                <span className="uppercase text-sm tracking-tighter">Finance Analytics</span>
              </Link>
            )}
            {role === "admin" && (
  <Link
    to="/admin-marketing"
    onClick={onClose}
    className="flex items-center gap-4 cursor-pointer font-black transition-colors group text-red-500 hover:text-red-400"
  >
    <span className="text-xl group-hover:scale-110 transition-transform">🏷️</span>
    <span className="uppercase text-sm tracking-tighter">Marketing Specials</span>
  </Link>
)}


            {/* Explore Menu */}
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-4 cursor-pointer font-black transition-colors group ${darkMode ? "hover:text-red-400 text-gray-300" : "hover:text-red-600"}`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🍔</span>
              <span className="uppercase text-sm tracking-tighter">Explore Menu</span>
            </Link>

            <hr className={`my-8 ${darkMode ? "border-gray-800" : "border-gray-100"}`} />

            {/* SUPPORT LINKS */}
            <div className="space-y-5 text-[11px] font-black uppercase tracking-tight text-gray-400">
              <p className="hover:text-red-500 cursor-pointer transition-colors">About Us</p>
              <p className="hover:text-red-500 cursor-pointer transition-colors">Privacy Policy</p>
              <p className="hover:text-red-500 cursor-pointer transition-colors">Terms & Conditions</p>
              <p className="hover:text-red-500 cursor-pointer transition-colors">Contact Us</p>
              
              <div className="pt-4 flex flex-col gap-4">
                <p className="text-red-600 hover:underline cursor-pointer font-black text-sm italic">Mitao Bhook</p>
              </div>

              {/* Admin Management Link */}
              {role === "admin" && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="block text-yellow-500 font-black pt-2 tracking-widest hover:underline uppercase"
                >
                  Manage Inventory
                </Link>
              )}
            </div>
          </div>

          {/* 5. SIDEBAR FOOTER */}
          <div className={`mt-auto pt-6 border-t text-[9px] font-bold tracking-[0.3em] uppercase text-center ${darkMode ? "text-gray-700" : "text-gray-500"}`}>
            RFC PAKISTAN v2.5
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
