import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Menu from "../components/Menu";
import Recommendation from "../components/Recommendation";
import Promotions from "../components/Promotions";
import DeliveryBanner from "../components/DeliveryBanner";
import AppDownload from "../components/AppDownload";
import CustomerReviews from "../components/CustomerReviews";
import WhyChooseRFC from "../components/WhyChooseRFC";

function Home() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  // URL se search terms parameter extract karna
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  // ==========================================
  // FETCH ALL DATA MATRIX WITH DEPENDENCY SYSTEM
  // ==========================================
  useEffect(() => {
    // 💥 Cache-buster tag '?t=' lagaya hai taake admin panel se item add hote hi foran show ho, gayab na ho
    fetch(`http://localhost:5000/api/products?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => console.log("Products Fetch Error:", err));

    fetch(`http://localhost:5000/api/deals?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((data) => setDeals(data))
      .catch((err) => console.log("Deals Fetch Error:", err));

    fetch(`http://localhost:5000/api/categories?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log("Categories Fetch Error:", err));
  }, [location.search]); // 👈 Crutial: location tracking trigger add kiya hai taake voice/typing search par grid crash na ho

  // ==========================================
  // SAFE SEARCH FILTERING BREAKDOWN
  // ==========================================
  const filteredProducts = Array.isArray(products) 
    ? products.filter((p) => {
        if (!p.name) return false;
        return p.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];

  return (
    <div className="bg-black text-white overflow-hidden font-montserrat">
      {/* HERO SLIDER LAYOUT */}
      <Hero />

      {/* REORDER ACTION SYSTEM BUTTON */}
      <div className="bg-black py-6 flex justify-center px-4">
        <button className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-300 text-white w-full max-w-6xl py-5 rounded-full font-black text-lg tracking-[4px] uppercase shadow-2xl active:scale-95">
          Reorder Your Favorites
        </button>
      </div>

      {/* RECOMMENDATIONS CONTEXT PANEL */}
      <Recommendation products={products} />

      {/* DELIVERY SERVICE BANNER MARKETING */}
      <DeliveryBanner />

      {/* WHY CHOOSE RFC INFRASTRUCTURE GRID */}
      <WhyChooseRFC />

      {/* MENU CATEGORIES (SEARCH FILTERED ARRAYS) */}
      <div className="bg-[#111111] py-16">
        {/* Passing dynamic filtered arrays map directly to the clean Menu component */}
        <Menu products={filteredProducts} />
      </div>

      {/* PROMOTIONS VIP COUPONS STRIP CONTAINER */}
      <Promotions />

      {/* CUSTOMER REVIEWS RATING FEEDBACK LEDGER */}
      <CustomerReviews />

      {/* MOBILE MOBILE APPLICATION REDIRECT BOX */}
      <AppDownload />
    </div>
  );
}

export default Home;
