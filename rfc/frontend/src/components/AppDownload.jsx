function AppDownload() {
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h2 className="text-5xl font-black uppercase leading-tight">
            Download RFC App
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Order your favorite meals anytime anywhere.
          </p>
          <div className="flex gap-4 mt-8">
            <button className="bg-white text-black px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
              Play Store
            </button>
            <button className="bg-red-600 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
              App Store
            </button>
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex justify-center">
          <img
            src="/mobile.png"
            alt="Mobile App"
            className="w-[300px]"
          />
        </div>
      </div>
    </section>
  );
}
export default AppDownload;