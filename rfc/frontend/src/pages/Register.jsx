import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        const { name, email, password, confirmPassword } = formData;
        
        if (!name || !email || !password) return setError("Please fill all fields!");
        if (password !== confirmPassword) return setError("Passwords do not match!");
        if (password.length < 6) return setError("Password must be 6+ characters!");

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Account Created! Welcome to RFC.");
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white shadow-2xl rounded-3xl flex w-full max-w-4xl overflow-hidden border border-gray-100">
                <div className="hidden md:flex w-1/2 bg-red-600 items-center justify-center p-12">
                    <div className="text-center">
                        <h1 className="text-6xl font-black text-white italic">RFC</h1>
                        <p className="text-red-100 mt-4 font-bold uppercase tracking-widest text-xs">Join the Crispy Revolution</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-10">
                    <h2 className="text-3xl font-black mb-2 uppercase italic">Create Account</h2>
                    <p className="text-gray-400 text-sm mb-8 font-bold">Start your flavor journey today.</p>
                    
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border-l-4 border-red-600 font-bold text-sm">{error}</div>}

                    <div className="space-y-4">
                        <input type="text" placeholder="Full Name" className="w-full border-2 p-4 rounded-2xl outline-none focus:border-red-600 transition-all bg-gray-50 font-medium" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        
                        <input type="email" placeholder="Email Address" className="w-full border-2 p-4 rounded-2xl outline-none focus:border-red-600 transition-all bg-gray-50 font-medium" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />

                        <input type="password" placeholder="Create Password" className="w-full border-2 p-4 rounded-2xl outline-none focus:border-red-600 transition-all bg-gray-50 font-medium" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />

                        <input type="password" placeholder="Confirm Password" className="w-full border-2 p-4 rounded-2xl outline-none focus:border-red-600 transition-all bg-gray-50 font-medium" 
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />

                        <button onClick={handleRegister} disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-red-700 active:scale-95 transition-all">
                            {loading ? "Registering..." : "Sign Up"}
                        </button>
                    </div>
                    <p className="mt-8 text-center text-sm font-bold text-gray-500 uppercase">Already a member? <Link to="/login" className="text-red-600 underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
