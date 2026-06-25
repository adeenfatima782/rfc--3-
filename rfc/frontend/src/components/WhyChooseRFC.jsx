const features = [
  "Fresh Food",
  "Fast Delivery",
  "Hygienic",
  "Affordable",
];

function WhyChooseRFC() {
  return (
    <section className="bg-black text-white py-20 px-6">

      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-5xl font-black uppercase mb-14">
          Why Choose RFC
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-[#111111] border border-red-600 rounded-3xl py-12 px-6 shadow-2xl hover:scale-105 transition"
            >
              <h3 className="text-2xl font-black">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseRFC;