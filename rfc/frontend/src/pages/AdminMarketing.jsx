import { useState, useEffect } from "react";
import toast from "react-hot-toast";
function AdminMarketing() {
    const [subscribers, setSubscribers] = useState([]);
    const [couponForm, setCouponForm] = useState({ code: "", discount: "" });
    const [loading, setLoading] = useState(true);
   const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("http://localhost:5000/api/auth/subscribers", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        // ✅ FIX: Sjekk karein ke data direct array hai ya backend object format (.subscribers) bhej raha hai
        if (Array.isArray(data)) {
            setSubscribers(data);
        } else if (data && data.subscribers) {
            setSubscribers(data.subscribers);
        } else {
            setSubscribers([]);
        }
    } catch (err) {
        toast.error("Failed to load subscriber data pool");
    } finally {
        setLoading(false);
    }
};


    useEffect(() => { loadData(); }, []);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/auth/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(couponForm)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setCouponForm({ code: "", discount: "" });
            } else {
                toast.error(data.message || "Failed to launch promo code");
            }
        } catch (err) {
            toast.error("Network communication error");
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-red-600 animate-pulse">Loading Analytics...</div>;

    return (
        <div className="p-6 md:p-12 bg-gray-50 min-h-screen font-montserrat">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight text-gray-900">
                        Marketing & <span className="text-red-600">Offers</span> Panel
                    </h2>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Loyalty Club and Promo Campaign Manager</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* LEFT CONTAINER: PROMO CODE GENERATOR FORM */}
                    <div className="bg-white p-8 rounded-[35px] shadow-xl border-t-8 border-red-600 h-fit">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-6">Launch Special Code</h3>
                        <form onSubmit={handleCreateCoupon} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offer Promo Code</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. ZINGER50, SAHIWAL20" 
                                    value={couponForm.code}
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold uppercase tracking-wider outline-none focus:border-red-600 transition-all placeholder-gray-300"
                                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount Percentage (%)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="1" max="100"
                                    placeholder="e.g. 20 (for 20% off)" 
                                    value={couponForm.discount}
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-red-600 transition-all placeholder-gray-300"
                                    onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
                                Activate Promo Offer
                            </button>
                        </form>
                    </div>

                    {/* RIGHT CONTAINER: LIVE SUBSCRIBERS AUDIT LIST LEDGER */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[35px] shadow-xl border-t-8 border-black">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black uppercase tracking-tight">Active Club Subscribers</h3>
                            <span className="bg-red-50 text-red-600 font-black px-4 py-1 rounded-full text-xs">
                                {subscribers.length} Members
                            </span>
                        </div>
                        
                        <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 scrollbar-hide">
                            {subscribers.length === 0 ? (
                                <p className="text-gray-400 italic text-sm">No members registered in the newsletter database loop yet.</p>
                            ) : (
                                subscribers.map((sub) => (
                                    <div key={sub._id} className="border-2 border-dashed border-gray-100 p-4 rounded-2xl bg-gray-50/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-sm text-gray-800 tracking-tight">{sub.email}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                                                Joined: {new Date(sub.subscribedAt).toLocaleDateString()} at {new Date(sub.subscribedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                            <span className="w-1 h-1 bg-green-600 rounded-full animate-ping"></span> Verified Club Member
                                        </div>
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

export default AdminMarketing;
