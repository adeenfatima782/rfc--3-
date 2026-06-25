import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
function Menu({ products = [] }) { 
  const { addToCart } = useContext(CartContext);
  const [internalProducts, setInternalProducts] = useState([]);
  const categories = [
    { name: "Everyday Value", img: "/cat1.jpg" },
    { name: "Ala-Carte", img: "/cat2.jpg" },
    { name: "Signature Boxes", img: "/cat3.jpg" },
    { name: "Sharing", img: "/cat4.jpg" },
    { name: "Snacks", img: "/cat5.jpg" },
  ];
  useEffect(() => {
    if (products.length === 0) {
      fetch("http://localhost:5000/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setInternalProducts(data);
          } else if (data && data.products) {
            setInternalProducts(data.products);
          }
        })
        .catch((err) => console.log("Error fetching products:", err));
    }
  }, [products]);

  const finalProducts = products.length > 0 ? products : internalProducts;

  const bestSellers = finalProducts.filter((p) => p.isBestSeller);
  const topDeals = finalProducts.filter((p) => p.isTopDeal);

  return (
    /* ✅ Crucial Fix: id="explore-menu" lagaya hai taake Hero buttons smoothly scroll kar sakein */
    <div id="explore-menu" className="p-6 transition-colors duration-300 max-w-7xl mx-auto scroll-mt-24">
      {/* 1. EXPLORE MENU */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight border-b-4 border-red-600 pb-1 dark:text-white">
            Explore Menu
          </h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <Link to={`/category/${cat.name}`} key={i} className="flex-shrink-0 flex flex-col items-center group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all shadow-sm">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="mt-3 font-bold text-xs text-gray-700 dark:text-gray-300 text-center w-24 uppercase leading-tight">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. BEST SELLERS */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-8 bg-red-600"></div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-800 dark:text-white">Best Sellers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item) => (
            <div key={item._id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col justify-between relative">
              {item.stock <= 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 animate-pulse">
                  OUT OF STOCK
                </div>
              )}
              <div>
                <div className="flex gap-1 mb-4"><div className="w-1.5 h-6 bg-red-600"></div><div className="w-1.5 h-6 bg-red-600"></div><div className="w-1.5 h-6 bg-red-600"></div></div>
                <Link to={`/product/${item._id}`}>
                  <img src={item.image} className={`h-40 w-full object-contain mb-4 cursor-pointer hover:scale-105 transition-transform ${item.stock <= 0 ? "grayscale opacity-50" : ""}`} alt={item.name} />
                </Link>
                <Link to={`/product/${item._id}`}>
                  <h3 className="font-black text-lg text-gray-800 dark:text-white uppercase leading-tight min-h-[44px] hover:text-red-600 transition-colors">{item.name}</h3>
                </Link>
                <p className="text-2xl font-black text-red-600 mt-2">{item.price} Rs</p>
              </div>
              <button disabled={item.stock <= 0} onClick={() => addToCart(item)} className={`mt-6 w-full font-black py-3 rounded-lg uppercase text-sm transition-all ${item.stock <= 0 ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-lg"}`} >
                {item.stock <= 0 ? "Unavailable" : "Add to Bucket"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TOP DEALS */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-8 bg-red-600"></div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-800 dark:text-white">Top Deals</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topDeals.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between relative">
              {item.stock <= 0 && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-black px-2 py-1 rounded z-10">
                  SOLD OUT
                </div>
              )}
              <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 p-2">
                <Link to={`/product/${item._id}`}>
                  <img src={item.image} className={`h-44 w-full object-contain group-hover:scale-110 transition-transform cursor-pointer ${item.stock <= 0 ? "grayscale" : ""}`} alt={item.name} />
                </Link>
                <div className="absolute top-2 right-2 text-red-500 bg-white dark:bg-gray-800 w-8 h-8 flex items-center justify-center rounded-full shadow-md">❤</div>
              </div>
              <div>
                <Link to={`/product/${item._id}`}>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white uppercase leading-tight h-12 overflow-hidden hover:text-red-600">{item.name}</h3>
                </Link>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">Grab the ultimate crispy experience at RFC!</p>
                <div className="flex justify-between items-end mt-4">
                  <p className="text-xl font-black text-gray-900 dark:text-red-500">Rs {item.price}</p>
                  {item.stock > 0 && item.stock < 10 && (
                    <p className="text-[10px] text-orange-500 font-bold animate-bounce">Only {item.stock} left!</p>
                  )}
                </div>
              </div>
              <button disabled={item.stock <= 0} onClick={() => addToCart(item)} className={`mt-4 w-full font-black py-2 rounded uppercase tracking-tighter transition-colors ${item.stock <= 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 shadow-md"}`} >
                {item.stock <= 0 ? "Out of Stock" : "+ Add to Bucket"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;
