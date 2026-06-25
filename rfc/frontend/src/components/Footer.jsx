import { useState } from "react";
import toast from "react-hot-toast";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"; // Icons import kiye

function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter a valid email address!");

    try {
        // ✅ Subscription ka data yahan is URL par jayega
        const res = await fetch("http://localhost:5000/api/auth/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Footer.jsx ke handleSubscribe mein JSON.stringify ko aise badlein:
body: JSON.stringify({ 
    email, 
    userId: localStorage.getItem("userId") // Agar login user ki id mojud ho
})

        });
        
        const data = await res.json();
        if (res.ok) {
            toast.success(data.message);
            setEmail(""); 
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        toast.error("Server error");
    }
};


    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-900 font-montserrat">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                
                {/* COLUMN 1: BRAND */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-red-600">RFC</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed max-w-xs">
                        The ultimate taste of crispy golden fried chicken prepared fresh daily in Sahiwal.
                    </p>
                    
                    {/* ✅ REFINED SOCIAL MEDIA ICONS: Empty circles are now full professional hyperlinks */}
                    <div className="flex gap-4 pt-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 hover:bg-red-600 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-800">
                            <FaFacebookF className="text-sm" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 hover:bg-red-600 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-800">
                            <FaTwitter className="text-sm" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 hover:bg-red-600 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-800">
                            <FaInstagram className="text-sm" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 hover:bg-red-600 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-800">
                            <FaYoutube className="text-sm" />
                        </a>
                    </div>
                </div>

                {/* COLUMN 2: QUICK NAVIGATION */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Explore</h3>
                    <ul className="space-y-3 text-xs font-bold uppercase text-gray-500">
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Our Menu</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Store Locator</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Track Order</li>
                    </ul>
                </div>

                {/* COLUMN 3: INFORMATION */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Support</h3>
                    <ul className="space-y-3 text-xs font-bold uppercase text-gray-500">
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Contact Us</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Privacy Policy</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Terms & Conditions</li>
                    </ul>
                </div>

                {/* COLUMN 4: NEWSLETTER (SUBSCRIBE FUNCTIONAL) */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Join the Club</h3>
                    <p className="text-[11px] text-gray-500 font-bold uppercase mb-4 leading-normal">
                        Subscribe to get exclusive discount codes and zinger updates straight to your inbox!
                    </p>
                    
                    {/* ✅ DYNAMIC FORM SUBMITTER */}
                    <form onSubmit={handleSubscribe} className="space-y-3">
                        <input 
                            type="email" 
                            required
                            placeholder="Your Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#111111] border-2 border-gray-900 focus:border-red-600 rounded-xl px-4 py-3 outline-none font-bold text-xs transition-all placeholder-gray-700"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-xl active:scale-95 transition-all duration-300"
                        >
                            {loading ? "Processing..." : "Subscribe Now"}
                        </button>
                    </form>
                </div>
            </div>

            {/* COPYRIGHT NOTICE BLOCK */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">
                    © {new Date().getFullYear()} RFC Pakistan ERP. All Rights Reserved.
                </p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 italic">
                    Mitao Bhook
                </p>
            </div>
        </footer>
    );
}

export default Footer;
