const reviews = [
  {
    name: "Ali",
    review: "Best burgers in town 🔥",
  },
  {
    name: "Sara",
    review: "Fast delivery and amazing taste!",
  },
  {
    name: "Ahmed",
    review: "Very hygienic and affordable.",
  },
];

function CustomerReviews() {
  return (
    <section className="bg-[#111111] text-white py-20 px-6">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-black text-center mb-14 uppercase">
          Customer Reviews
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-black border border-red-600 rounded-3xl p-8 shadow-2xl"
            >
              <p className="text-lg text-gray-300">
                “{item.review}”
              </p>

              <h3 className="mt-6 text-2xl font-black text-red-500">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;