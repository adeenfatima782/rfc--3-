import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // Fixed: Toast import add kiya taake app freeze na ho

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role); 
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userId", data.user.id || data.user._id); // Essential tracking key index mapping
        
        toast.success("Welcome back, " + data.user.name);

        // Conditional routing matrix
        if (data.user.role === "admin") {
          window.location.href = "/admin"; 
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl flex w-[900px] overflow-hidden">
        <div className="w-1/2 bg-gray-50 flex items-center justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png" alt="kfc" className="w-72" />
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
          <p className="text-gray-500 mb-6">Login with your credentials</p>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border p-3 rounded mb-4 outline-none focus:ring-2 focus:ring-red-500" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border p-3 rounded mb-4 outline-none focus:ring-2 focus:ring-red-500" 
          />
          <button onClick={handleLogin} className="w-full bg-red-500 text-white py-3 rounded mb-3 hover:bg-red-600 font-bold">
            LOGIN
          </button>
          
          <button onClick={() => alert("Google connectivity simulation initiated!")} className="w-full border-2 border-gray-100 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all mb-4">
              <img src="https://flaticon.com" className="w-4" alt="google" />
              <span className="font-bold text-sm">Continue with Google</span>
          </button>

          <button onClick={() => alert("Password reset link sent to your email!")} className="text-xs text-gray-400 font-bold hover:text-red-600 transition-colors underline">
              Forgot Password?
          </button>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account? <Link to="/register" className="text-red-500 font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
