import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaStar, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const { addToCart } = useContext(CartContext);

    const fetchProduct = () => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Please login to leave a review");

        const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rating, comment })
        });

        if (res.ok) {
            toast.success("Review Submitted! ⭐");
            setComment("");
            fetchProduct();
        } else {
            const data = await res.json();
            toast.error(data.message || "Failed to submit review");
        }
    };

    if (!product) return <div className="p-20 text-center font-black uppercase italic animate-pulse text-red-600">Loading Product...</div>;

    return (
        <div className="min-h-screen bg-white p-6 md:p-20 font-montserrat">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                
                {/* LEFT: IMAGE */}
                <div className="bg-gray-50 rounded-[40px] p-12 flex justify-center shadow-inner sticky top-28">
                    <img src={product.image} alt={product.name} className="w-full max-w-md object-contain hover:scale-110 transition-transform duration-700" />
                </div>

                {/* RIGHT: CONTENT */}
                <div>
                    <p className="text-red-600 font-black uppercase tracking-[5px] text-xs mb-4">RFC Special</p>
                    <h1 className="text-6xl font-black uppercase italic text-gray-900 leading-none">{product.name}</h1>
                    
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, indexCheck) => (
                                indexCheck < Math.round(product.rating || 0) ? <FaStar key={indexCheck} /> : <FaRegStar key={indexCheck} />
                            ))}
                        </div>
                        <span className="text-gray-400 font-bold text-xs">({product.numReviews || 0} Reviews)</span>
                    </div>

                    <p className="text-red-600 text-5xl font-black mt-6 italic">Rs {product.price}</p>
                    
                    <div className="mt-10 space-y-6">
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            {product.description || "Indulge in the world's most famous crispy chicken, made with our secret 11 herbs and spices. Always fresh, always hot!"}
                        </p>
                        
                        <div className="flex gap-10 py-6 border-y border-gray-100 uppercase">
                            <div><p className="text-[10px] font-black text-gray-400 mb-1">Calories</p><p className="font-black text-sm">540 kcal</p></div>
                            <div><p className="text-[10px] font-black text-gray-400 mb-1">Stock</p><p className={`font-black text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} available` : 'Sold Out'}</p></div>
                        </div>
                    </div>

                    <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full mt-10 py-6 rounded-2xl font-black uppercase text-xl transition-all shadow-2xl tracking-widest ${
                            product.stock <= 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-red-200"
                        }`}
                    >
                        {product.stock <= 0 ? "Unavailable" : "Add to Bucket"}
                    </button>

                    {/* --- REVIEWS SECTION --- */}
                    <div className="mt-20 border-t pt-12">
                        <h3 className="text-3xl font-black uppercase italic mb-8">Customer Voice</h3>
                        
                        {/* REVIEW FORM */}
                        <form onSubmit={submitReview} className="mb-12 bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
                            <h4 className="font-black uppercase text-sm mb-4">Rate your experience</h4>
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button key={num} type="button" onClick={() => setRating(num)} className="text-2xl transition-transform active:scale-125">
                                        {rating >= num ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                                    </button>
                                ))}
                            </div>
                            <textarea 
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="How was the taste? (e.g. Extra Crispy!)" 
                                className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-red-600 font-medium transition-all"
                            />
                            <button type="submit" className="mt-4 bg-black text-white px-10 py-3 rounded-xl font-black uppercase text-xs hover:bg-red-600 transition-colors">Post Review</button>
                        </form>

                        {/* REVIEWS LIST */}
                        <div className="space-y-6">
                            {!product.reviews || product.reviews.length === 0 ? (
                                <p className="text-gray-400 italic font-medium">No reviews yet. Be the first to rate!</p>
                            ) : (
                                product.reviews.map((r, idx) => (
                                    <div key={r._id || idx} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="font-black text-xs uppercase tracking-widest text-gray-800">{r.name}</p>
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(Number(r.rating) || 5)].map((_, starIdx) => <FaStar key={starIdx} />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed italic">"{r.comment}"</p>
                                        <p className="text-[9px] text-gray-300 font-bold mt-4 uppercase">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Just Now"}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
