import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const API = "http://localhost:5000";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const socketRef = useRef(null);

  // SOCKET
  useEffect(() => {
    socketRef.current = io(API);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // FETCH DATA
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const [orderRes, riderRes] = await Promise.all([
        fetch(`${API}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/riders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!orderRes.ok) throw new Error("Orders failed");

      const ordersData = await orderRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      if (riderRes.ok) {
        const riderData = await riderRes.json();
        setRiders(Array.isArray(riderData) ? riderData : []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ASSIGN RIDER
  const handleAssignRider = async (orderId, riderId) => {
    if (!riderId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/api/orders/assign-rider/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ riderId }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Rider Assigned");
      fetchData();
    } catch {
      toast.error("Assignment failed");
    }
  };

  // STATUS UPDATE
  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/api/orders/status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(`Status: ${status}`);

      if (status === "On Way") {
        socketRef.current?.emit("join_room", orderId);
      }

      fetchData();
    } catch {
      toast.error("Status update failed");
    }
  };

  // GPS SIMULATION
  const triggerSimulationTelemetry = (orderId, lat, lng) => {
    let step = 0;

    toast.success("GPS Simulation Started");

    const interval = setInterval(() => {
      step++;

      const newLat = lat + step * 0.0005;
      const newLng = lng + step * 0.0005;

      socketRef.current?.emit("update_rider_geo", {
        orderId,
        lat: newLat,
        lng: newLng,
      });

      if (step >= 12) {
        clearInterval(interval);
        toast.success("Simulation Completed");
      }
    }, 4000);
  };

  // FILTER
  const filteredOrders = orders.filter((o) => {
    const s = searchTerm.toLowerCase();

    const matchSearch =
      o.shortId?.toLowerCase()?.includes(s) ||
      o.userId?.name?.toLowerCase()?.includes(s) ||
      o.userId?.email?.toLowerCase()?.includes(s);

    const matchStatus =
      statusFilter === "All" || o.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black">Admin Orders</h1>

          <div className="flex gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="On Way">On Way</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Rider</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    No Orders
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    
                    <td className="p-3">
                      {order.shortId || order._id.slice(-6)}
                    </td>

                    <td className="p-3">
                      <div>
                        <p className="font-bold">
                          {order.userId?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.userId?.email}
                        </p>
                      </div>
                    </td>

                    <td className="p-3">
                      {order.items?.map((i, idx) => (
                        <div key={idx}>
                          {i.qty} x {i.name}
                        </div>
                      ))}
                    </td>

                    <td className="p-3 font-bold">
                      Rs {order.total}
                    </td>

                    <td className="p-3">
                      <select
                        value={order.riderId?._id || ""}
                        onChange={(e) =>
                          handleAssignRider(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border p-1"
                      >
                        <option value="">Select</option>
                        {riders.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border p-1"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Preparing</option>
                        <option>On Way</option>
                        <option>Delivered</option>
                        <option>Rejected</option>
                      </select>
                    </td>

                    <td className="p-3">
                      {order.status === "On Way" && (
                        <button
                          className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                          onClick={() =>
                            triggerSimulationTelemetry(
                              order._id,
                              order.location?.lat || 31.52,
                              order.location?.lng || 74.35
                            )
                          }
                        >
                          GPS Sim
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminOrders;