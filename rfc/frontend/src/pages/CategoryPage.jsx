import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
        .then(res => res.json())
        .then(data => {
            // ✅ FIX: Pagination data check (data.products use karein agar array nahi hai)
            const productsArray = Array.isArray(data) ? data : data.products || [];
            
            // Ab filter sahi kaam karega
            const filtered = productsArray.filter(p => p.category === categoryName);
            setProducts(filtered);
        })
        .catch(err => console.log("Category Fetch Error:", err));
}, [categoryName]);


  // ✅ 1. ADD TO CART FUNCTION (Yahan lazmi add karein)
  const addToBucket = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      alert(`${product.name} already in bucket!`);
    } else {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to bucket!`);
      // Page reload taake navbar update ho jaye (agar zaroorat ho)
      window.location.reload(); 
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-3 h-12 bg-red-600"></div>
        <h2 className="text-5xl font-black uppercase italic tracking-tighter text-gray-800">
          {categoryName}
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 font-bold italic">No items found in this category yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(item => (
            <div key={item._id} className="bg-white border rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform flex flex-col items-center text-center">
              <img src={item.image} className="h-48 object-contain mb-6" alt={item.name} />
              <h3 className="text-xl font-black uppercase text-gray-800 min-h-[56px]">{item.name}</h3>
              <p className="text-red-600 font-black text-3xl mt-4">Rs {item.price}</p>
              
              {/* ✅ 2. Button par onClick lagayein */}
              <button 
                onClick={() => addToBucket(item)}
                className="bg-red-600 text-white w-full py-3 mt-6 rounded-full font-black uppercase shadow-lg hover:bg-red-700 active:scale-95 transition-all"
              >
                + ADD TO BUCKET
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
