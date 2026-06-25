import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Profile() {
    const [user, setUser] = useState({ 
        name: "", 
        email: "", 
        addresses: { home: "", work: "" } 
    });

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            setUser({
                ...data,
                addresses: data.addresses || { home: "", work: "" }
            });
            localStorage.setItem("userName", data.name || "");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/update-profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(user)
        });

        if (res.ok) {
            const updated = await res.json();
            setUser({
                ...updated,
                addresses: updated.addresses || { home: "", work: "" }
            });
            toast.success("DB updated successfully! ✅");
        } else {
            toast.error("Failed to save to DB");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-20 flex justify-center font-montserrat">
             <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-2xl border-t-8 border-red-600">
                <h2 className="text-3xl font-black uppercase italic mb-8">Account Settings</h2>
                
                <div className="space-y-6">
                    <input 
                        value={user.name || ""} 
                        placeholder="Your Name"
                        className="w-full border-2 p-4 rounded-2xl font-bold focus:border-red-600 outline-none"
                        onChange={(e) => setUser({...user, name: e.target.value})} 
                    />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <input 
                            value={user.addresses?.home || ""} 
                            placeholder="Home Address"
                            className="border-2 p-4 rounded-2xl font-bold text-sm focus:border-red-600 outline-none"
                            onChange={(e) => setUser({
                                ...user, 
                                addresses: { ...(user.addresses || { home: "", work: "" }), home: e.target.value }
                            })} 
                        />
                        <input 
                            value={user.addresses?.work || ""} 
                            placeholder="Work Address"
                            className="border-2 p-4 rounded-2xl font-bold text-sm focus:border-red-600 outline-none"
                            onChange={(e) => setUser({
                                ...user, 
                                addresses: { ...(user.addresses || { home: "", work: "" }), work: e.target.value }
                            })} 
                        />
                    </div>

                    <button onClick={handleUpdate} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-red-700">
                        Update Database
                    </button>
                </div>
             </div>
        </div>
    );
}
export default Profile;
