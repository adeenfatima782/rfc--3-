import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ 1. Navigation ke liye import kiya

const slides = [
  {
    image: "/b1.jpg",
    title: "CRISPY HOT",
    subtitle: "Mega RFC Deals Starting From Rs 499",
  },
  {
    image: "/b2.jpg",
    title: "MIGHTY ZINGER",
    subtitle: "The King Of Burgers Is Here",
  },
  {
    image: "/b3.jpg",
    title: "FAMILY BUCKET",
    subtitle: "Share Happiness With Friends",
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate(); // ✅ 2. Hook initialize kiya

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // ✅ 3. ORDER NOW LOGIC
  const handleOrderNow = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0) {
      navigate("/cart"); // Bucket mein mal hai toh foran Cart Page
    } else {
      // Empty bucket hai toh smoothly menu section par slide kare
      const element = document.getElementById("explore-menu");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#explore-menu"; // Fallback refresh path
      }
    }
  };

  // ✅ 4. EXPLORE MENU LOGIC
  const handleExploreMenu = () => {
    const element = document.getElementById("explore-menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // Smooth slide click animation
    } else {
      window.location.href = "/#explore-menu";
    }
  };

  return (
    <section className="relative w-full h-[92vh] overflow-hidden bg-black text-white">
      {/* SLIDES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[current].image})`,
            }}
          />
          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            {/* TOP TEXT */}
            <p className="text-yellow-400 uppercase tracking-[10px] font-montserrat font-black text-sm md:text-base">
              RFC SPECIAL MENU
            </p>

            {/* TITLE */}
            <h1 className="mt-5 text-7xl md:text-9xl leading-none font-bebas tracking-wide drop-shadow-2xl">
              {slides[current].title}
            </h1>

            {/* SUBTITLE */}
            <p className="mt-6 text-lg md:text-2xl font-poppins font-semibold text-gray-200 leading-relaxed max-w-2xl">
              {slides[current].subtitle}
            </p>

            {/* ✅ DYNAMIC ACTIONS BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-10">
              <button 
                onClick={handleOrderNow} // ✅ Function map kiya
                className="bg-red-600 hover:bg-red-700 hover:scale-105 transition duration-300 px-10 py-5 rounded-full font-montserrat font-black uppercase tracking-wider shadow-2xl"
              >
                Order Now
              </button>

              <button 
                onClick={handleExploreMenu} // ✅ Function map kiya
                className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition duration-300 px-10 py-5 rounded-full font-montserrat font-black uppercase tracking-wider shadow-2xl"
              >
                Explore Menu
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-red-600 backdrop-blur-md w-14 h-14 rounded-full text-white text-2xl transition duration-300"
      >
        ❮
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-red-600 backdrop-blur-md w-14 h-14 rounded-full text-white text-2xl transition duration-300"
      >
        ❯
      </button>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              current === index ? "bg-red-600 w-12 h-3" : "bg-white/50 w-3 h-3"
            }`}
          />
        ))}
      </div>

      {/* BOTTOM GRADIENT */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}

export default Hero;
