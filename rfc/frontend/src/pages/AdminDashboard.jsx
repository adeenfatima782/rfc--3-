import { useEffect, useState } from "react";
function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const initialProductState = {name: "",price: "",image: "",category: "Everyday Value",isBestSeller: false,isTopDeal: false,stock: 0,tags: [],};
  const [formData, setFormData] =
    useState(initialProductState);
  const [dealData, setDealData] = useState({title: "",price: "",image: "",});
  const [categoryData, setCategoryData] =
    useState({name: "",image: "",});
  const fetchProducts = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (data.products) {
            setProducts(data.products);} else {
            setProducts(data);}} catch (err) {
        console.error(err); }};
  const fetchDeals = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/deals");
      const data = await res.json();
      setDeals(Array.isArray(data) ? data : []);} catch (err) {
      console.error("Deals Error:", err);}};
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Categories Error:", err);}};
  useEffect(() => {
    fetchProducts();
    fetchDeals();
    fetchCategories();}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,},
        body: JSON.stringify(formData),});
    if (res.ok) {
        alert("Product Added Successfully! 🍔");
        setFormData({ name: "",price: "",image: "",category: "Everyday Value", isBestSeller: false,isTopDeal: false,stock: 0,tags: [], });
        fetchProducts(); } else {
        alert("Failed to add product");}};
  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "Everyday Value",
      isBestSeller: product.isBestSeller || false,
      isTopDeal: product.isTopDeal || false,
      stock: product.stock || 0,
      tags: product.tags || [],});
    window.scrollTo({
      top: 0,
      behavior: "smooth",});};
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/products/${editingId}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,},
          body: JSON.stringify({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),}),});
      if (!res.ok) {
        throw new Error("Update failed");}
      alert("Product Updated!");
      setEditingId(null);
      setFormData(initialProductState);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error updating product");}};
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:5000/api/products/${id}`,{
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,},});
      fetchProducts();
    } catch (err) {
      console.error(err);}};
  const handleDealSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/deals",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,},
          body: JSON.stringify(dealData),});
      if (!res.ok) {
        throw new Error("Failed");}
      alert("Deal Added!");
      setDealData({
        title: "",
        price: "",
        image: "",});
      fetchDeals();
    } catch (err) {
      console.error(err);}};
  const deleteDeal = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:5000/api/deals/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,},});

      fetchDeals();
    } catch (err) {
      console.error(err);
    }
  };


  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/categories",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(categoryData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed");
      }

      alert("Category Added!");

      setCategoryData({
        name: "",
        image: "",
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };


  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };
const totalProducts = products.length;
const outOfStock = products.filter(p => p.stock <= 0).length;
const everydayCount = products.filter(p => p.category === "Everyday Value").length;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}

        <h1 className="text-5xl font-black text-red-600 mb-10 uppercase italic">
          RFC Admin Dashboard
        </h1>

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

          <div className="bg-red-600 p-6 rounded-2xl shadow-xl">
            <p className="text-xs uppercase font-bold opacity-80">
              Total Products
            </p>

            <h2 className="text-4xl font-black mt-2">
              {products.length}
            </h2>
          </div>

          <div className="bg-white text-black p-6 rounded-2xl shadow-xl">
            <p className="text-xs uppercase font-bold text-gray-500">
              Out Of Stock
            </p>

            <h2 className="text-4xl font-black text-red-600 mt-2">
              {
                products.filter(
                  (p) => Number(p.stock) <= 0
                ).length
              }
            </h2>
          </div>

          <div className="bg-white text-black p-6 rounded-2xl shadow-xl">
            <p className="text-xs uppercase font-bold text-gray-500">
              Total Deals
            </p>

            <h2 className="text-4xl font-black text-red-600 mt-2">
              {deals.length}
            </h2>
          </div>

          <div className="bg-white text-black p-6 rounded-2xl shadow-xl">
            <p className="text-xs uppercase font-bold text-gray-500">
              Categories
            </p>

            <h2 className="text-4xl font-black text-red-600 mt-2">
              {categories.length}
            </h2>
          </div>
        </div>

        {/* PRODUCT FORM */}

        <div className="bg-[#111111] p-8 rounded-3xl border border-red-600 mb-10">

          <h2 className="text-3xl font-black mb-6">
            {editingId
              ? "Update Product"
              : "Add Product"}
          </h2>

          <form
            onSubmit={
              editingId
                ? (e) => {
                    e.preventDefault();
                    handleUpdate();
                  }
                : handleSubmit
            }
            className="grid md:grid-cols-2 gap-5"
          >

            <input
              type="text"
              placeholder="Product Name"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Image URL"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={formData.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Stock"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />

            <select 
    className="bg-black border border-gray-700 p-4 rounded-xl text-white"
    value={formData.category} 
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
>
    <option value="Everyday Value">Everyday Value</option>
    <option value="Ala-Carte">Ala-Carte</option>
    <option value="Signature Boxes">Signature Boxes</option>
    <option value="Sharing">Sharing</option>
    <option value="Snacks">Snacks</option>
</select>

            <div className="flex gap-6 items-center">

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isBestSeller: e.target.checked,
                    })
                  }
                />

                Best Seller
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isTopDeal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isTopDeal: e.target.checked,
                    })
                  }
                />

                Top Deal
              </label>
            </div>

            <button className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-black uppercase transition">
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialProductState);
                }}
                className="bg-gray-700 hover:bg-gray-600 py-4 rounded-xl font-black uppercase transition"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* PRODUCTS LIST */}

        <div className="bg-[#111111] p-8 rounded-3xl border border-red-600 mb-10">

          <h2 className="text-3xl font-black mb-8">
            All Products
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-black border border-gray-800 rounded-2xl overflow-hidden"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">

                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black">
                      {product.name}
                    </h3>

                    <span className="text-red-500 font-black">
                      Rs {product.price}
                    </span>
                  </div>

                  <p className="text-gray-400 mt-2">
                    {product.category}
                  </p>

                  <p className="mt-2 text-sm">
                    Stock:{" "}
                    <span className="font-bold">
                      {product.stock}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">

                    {product.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="bg-yellow-500 text-black px-5 py-2 rounded-full font-bold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(product._id)
                      }
                      className="bg-red-600 px-5 py-2 rounded-full font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEALS */}

        <div className="bg-[#111111] p-8 rounded-3xl border border-red-600 mb-10">

          <h2 className="text-3xl font-black mb-6">
            Manage Deals
          </h2>

          <form
            onSubmit={handleDealSubmit}
            className="grid md:grid-cols-3 gap-5 mb-8"
          >

            <input
              type="text"
              placeholder="Deal Title"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={dealData.title}
              onChange={(e) =>
                setDealData({
                  ...dealData,
                  title: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={dealData.price}
              onChange={(e) =>
                setDealData({
                  ...dealData,
                  price: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Image URL"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={dealData.image}
              onChange={(e) =>
                setDealData({
                  ...dealData,
                  image: e.target.value,
                })
              }
            />

            <button className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-black uppercase transition md:col-span-3">
              Add Deal
            </button>
          </form>

          <div className="grid md:grid-cols-3 gap-6">

            {deals.map((deal) => (
              <div
                key={deal._id}
                className="bg-black border border-red-600 rounded-2xl overflow-hidden"
              >

                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <h3 className="text-2xl font-black">
                    {deal.title}
                  </h3>

                  <p className="text-red-500 mt-2 font-bold">
                    Rs {deal.price}
                  </p>

                  <button
                    onClick={() =>
                      deleteDeal(deal._id)
                    }
                    className="mt-4 bg-red-600 px-5 py-2 rounded-full font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}

        <div className="bg-[#111111] p-8 rounded-3xl border border-red-600">

          <h2 className="text-3xl font-black mb-6">
            Popular Categories
          </h2>

          <form
            onSubmit={handleCategorySubmit}
            className="grid md:grid-cols-2 gap-5 mb-8"
          >

            <input
              type="text"
              placeholder="Category Name"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={categoryData.name}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Image URL"
              className="bg-black border border-gray-700 p-4 rounded-xl"
              value={categoryData.image}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  image: e.target.value,
                })
              }
            />

            <button className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-black uppercase transition md:col-span-2">
              Add Category
            </button>
          </form>

          <div className="grid md:grid-cols-4 gap-6">

            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-black border border-red-600 rounded-2xl overflow-hidden"
              >

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5 text-center">

                  <h3 className="text-2xl font-black">
                    {cat.name}
                  </h3>

                  <button
                    onClick={() =>
                      deleteCategory(cat._id)
                    }
                    className="mt-4 bg-red-600 px-5 py-2 rounded-full font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;