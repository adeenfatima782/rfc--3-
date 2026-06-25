import { useState } from "react";

function Recommendation({ products }) {
  const [mood, setMood] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [isSurprise, setIsSurprise] = useState(false);

  const getRecommendation = (type) => {
    setIsSurprise(false);
    setMood(type);
    let filtered = [];

    if (type === "Best Seller") {
      filtered = products.filter(p => p.isBestSeller).slice(0, 3);
    } else {
      filtered = products.filter(p => 
        p.tags && p.tags.some(tag => tag.toLowerCase().includes(type.toLowerCase()))
      );
    }
    setRecommended(filtered);
  };

  const handleSurprise = () => {
    if (products.length === 0) return;
    setMood("Surprise");
    setIsSurprise(true);
    const randomIndex = Math.floor(Math.random() * products.length);
    setRecommended([products[randomIndex]]); // Sirf aik random item dikhayen
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white dark:bg-gray-900 rounded-3xl shadow-inner mt-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase italic tracking-tighter">✨ RFC Smart Choice</h2>
        <p className="text-gray-500 font-bold uppercase text-[10px] mt-2">whats your mood today?</p>
      </div>

      {/* Mood Buttons + Surprise Me */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["Party", "Spicy", "Lite", "Best Seller"].map((item) => (
          <button
            key={item}
            onClick={() => getRecommendation(item)}
            className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all shadow-sm ${
              mood === item ? "bg-red-600 text-white scale-110" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50"
            }`}
          >
            {item === "Party" ? "🥳 " : item === "Spicy" ? "🔥 " : item === "Lite" ? "🥗 " : "👑 "} 
            {item}
          </button>
        ))}
        
        {/* ✅ SURPRISE ME BUTTON */}
        <button
          onClick={handleSurprise}
          className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all shadow-lg border-2 border-dashed border-red-600 ${
            mood === "Surprise" ? "bg-yellow-400 text-black scale-110" : "bg-white text-red-600 hover:bg-yellow-50"
          }`}
        >
          🎁 Surprise Me
        </button>
      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
        {recommended.map((item) => (
          <div key={item._id} className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center text-center transition-all duration-500 ${
            isSurprise ? "bg-yellow-50 border-yellow-400 scale-105" : "bg-gray-50 dark:bg-gray-800 border-red-100 dark:border-gray-700"
          }`}>
            {isSurprise && <p className="text-[10px] font-black text-yellow-600 mb-2 uppercase">✨ Special For You!</p>}
            <img src={item.image} className="h-32 object-contain mb-4" alt="" />
            <h3 className="font-black uppercase text-xs dark:text-white mb-2">{item.name}</h3>
            <p className="text-red-600 font-black text-lg">Rs {item.price}</p>
            <button className="mt-4 text-[9px] bg-black text-white px-6 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
              Add to Bucket
            </button>
          </div>
        ))}

        {mood && recommended.length === 0 && (
          <div className="col-span-3 text-center py-10 text-gray-400 italic font-bold">
             Oops! Not Avaliable
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendation;
