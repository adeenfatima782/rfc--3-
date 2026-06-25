import React, { useEffect, useState } from 'react';

function Promotions() {
  const [offers, setOffers] = useState([]);
  const [isVIPSubscriber, setIsVIPSubscriber] = useState(false);

  // ==========================================
  // FETCH USER STATUS & ACTIVE COUPONS LOGIC
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // 1. Fetch current user context to verify subscriber status
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.isSubscriber) {
          setIsVIPSubscriber(true); // User is confirmed sub!
        }
      })
      .catch(err => console.log("Profile verification error"));
    }

    // 2. Fetch Active Promo Coupons
    fetch("http://localhost:5000/api/auth/active-coupons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffers(data);
        } else if (data && typeof data === 'object') {
          setOffers([data]);
        }
      })
      .catch((err) => console.log("Offers Fetch Error:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-montserrat">
      
      {/* ✅ 1. PREMIUM DYNAMIC ALERTS (Changes style depending on subscriber status) */}
      {offers.length > 0 && (
        <div className="mb-10 space-y-4">
          {offers.map((coupon, index) => (
            <div 
              key={index} 
              className={`py-5 px-6 rounded-3xl font-black text-center uppercase tracking-widest text-xs md:text-sm animate-pulse flex flex-col md:flex-row justify-center items-center gap-3 shadow-xl border-2 transition-all duration-500 ${
                isVIPSubscriber 
                  ? "bg-black text-yellow-400 border-yellow-400" // ⭐ VIP Subscriber Theme (Black & Gold)
                  : "bg-yellow-400 text-black border-transparent" // Standard User Theme (Yellow)
              }`}
            >
              {isVIPSubscriber ? (
                <>
                  <span>👑 RFC VIP Club Member Offer: Use Your Special Code</span>
                  <span className="bg-red-600 text-white px-5 py-2 rounded-2xl font-black text-sm select-all tracking-widest shadow-lg">
                    {coupon.code}
                  </span>
                  <span>To claim your exclusive loyalty {coupon.discount}% Discount! 🍟</span>
                </>
              ) : (
                <>
                  <span>🎉 Exclusive Public Offer: Use Promo Code</span>
                  <span className="bg-black text-white px-5 py-2 rounded-2xl font-black text-sm select-all tracking-widest shadow-inner">
                    {coupon.code}
                  </span>
                  <span>And get {coupon.discount}% OFF on your bucket! (Subscribe below to unlock VIP perks)</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. TOP IMAGE BANNERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-500">
          <img src="/pro1.jpg" alt="Pickup" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-500">
          <img src="/pro2.jpg" alt="Value Bucket" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 3. APP & EXPLORE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Box */}
        <div className="bg-black rounded-3xl p-8 flex flex-col items-center text-white text-center min-h-[300px] justify-center shadow-xl border border-gray-900">
          <h2 className="text-5xl font-black uppercase italic leading-none font-bebas mb-4 tracking-tighter">
            CRISPY<br/><span className="text-red-600">CRAVINGS?</span>
          </h2>
          <p className="text-gray-400 mb-6 font-black uppercase text-[10px] tracking-[0.2em]">Download the RFC App</p>
          <div className="flex gap-4">
            <img src="/app.png" alt="App Store" className="h-10 cursor-pointer hover:scale-105 transition-transform" />
            <img src="/play.png" alt="Google Play" className="h-10 cursor-pointer hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Explore Box */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl min-h-[300px] justify-center">
          <img src="/bucket_icon.png" alt="Bucket" className="h-20 mb-6 animate-bounce duration-1000" />
          <p className="text-gray-500 font-bold mb-6 text-sm uppercase max-w-[280px] leading-relaxed">
            Adding 11 secret herbs and spices. Explore our premium menu and add hot items to your bucket!
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById("explore-menu");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" }); // Smooth scroll animation
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="bg-red-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:bg-red-700 active:scale-95 transition-all duration-300"
          >
            Explore Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default Promotions;
