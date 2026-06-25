import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { CartContext } from "../context/CartContext";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // ✅ DOWNLOAD INVOICE
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RFC - ROYAL FOOD CENTER", 20, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: ${order.shortId || order._id}`, 20, 35);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      20,
      42
    );

    doc.line(20, 48, 190, 48);

    let y = 58;

    order.items?.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} x${item.qty || 1}`,
        20,
        y
      );

      doc.text(
        `Rs ${(item.price || 0) * (item.qty || 1)}`,
        150,
        y
      );

      y += 10;
    });

    doc.line(20, y, 190, y);

    y += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(`TOTAL BILL: Rs ${order.total}`, 20, y);

    doc.save(`Invoice_${order.shortId || order._id}.pdf`);
  };

  // ✅ REORDER FUNCTION
  const handleReorder = (items) => {
    items.forEach((item) => {
      addToCart(item);
    });

    alert("Items added back to cart!");
    navigate("/cart");
  };

  // ✅ FETCH ORDERS
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* PAGE TITLE */}
        <h2 className="text-4xl font-black mb-10 text-red-600 uppercase italic tracking-tight">
          My Order History
        </h2>

        {/* EMPTY ORDERS */}
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
            <p className="text-gray-500 text-lg font-semibold">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-5 bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-full font-black uppercase text-sm"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border-l-8 border-red-600 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between gap-6"
              >
                
                {/* LEFT */}
                <div className="flex-1">
                  
                  {/* ORDER HEADER */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-bold">
                      #{order.shortId || order._id.slice(-6).toUpperCase()}
                    </span>

                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold uppercase">
                      {order.status || "Confirmed"}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="mb-4">
                    {order.items?.map((item, index) => (
                      <p
                        key={index}
                        className="text-gray-700 text-sm font-medium"
                      >
                        • {item.name} x{item.qty || 1}
                      </p>
                    ))}
                  </div>

                  {/* DATE */}
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      onClick={() => handleReorder(order.items)}
                      className="bg-black hover:bg-gray-800 transition text-white px-5 py-2 rounded-xl text-xs font-black uppercase"
                    >
                      Reorder
                    </button>

                    <button
                      onClick={() => downloadInvoice(order)}
                      className="bg-gray-100 hover:bg-gray-200 transition text-gray-700 px-5 py-2 rounded-xl text-xs font-black uppercase border"
                    >
                      Download Invoice
                    </button>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Total Amount
                    </p>

                    <p className="text-4xl font-black text-red-600">
                      Rs {order.total}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;