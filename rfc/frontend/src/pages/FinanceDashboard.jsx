import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

function FinanceDashboard() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expenseForm, setExpenseForm] = useState({
    category: "Chicken",
    amount: "",
    description: "",
  });

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const [ordersRes, expensesRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("http://localhost:5000/api/auth/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const ordersData = await ordersRes.json();
      const expensesData = await expensesRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);

      setExpenses(
        Array.isArray(expensesData)
          ? expensesData
          : expensesData.expenses || []
      );
    } catch (err) {
      console.error("Finance Data Sync Error:", err);

      toast.error(
        "Failed to load financial analytics data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // BEST SELLING PRODUCTS
  // ==========================================

  const getBestSellingData = () => {
    const counts = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        counts[item.name] =
          (counts[item.name] || 0) +
          (item.qty || 1);
      });
    });

    return Object.keys(counts)
      .map((name) => ({
        name,
        sales: counts[name],
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  // ==========================================
  // CATEGORY ANALYTICS
  // ==========================================

  const getCategoryAnalytics = () => {
    const stats = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const category =
          item.category || "Other";

        stats[category] =
          (stats[category] || 0) +
          (item.price || 0) *
            (item.qty || 1);
      });
    });

    return Object.keys(stats).map((name) => ({
      name,
      value: stats[name],
    }));
  };

  // ==========================================
  // TIMELINE REVENUE
  // ==========================================

  const getTimelineTrendData = () => {
    const trends = {};

    orders.forEach((order) => {
      const dateStr = new Date(
        order.createdAt
      ).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });

      trends[dateStr] =
        (trends[dateStr] || 0) +
        Number(order.total || 0);
    });

    return Object.keys(trends)
      .map((date) => ({
        date,
        Revenue: trends[date],
      }))
      .reverse()
      .slice(-7);
  };

  // ==========================================
  // TOTALS
  // ==========================================

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, exp) =>
      sum + Number(exp.amount || 0),
    0
  );

  const netProfit =
    totalRevenue - totalExpenses;

  // ==========================================
  // ADD EXPENSE
  // ==========================================

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();

    if (
      !expenseForm.amount ||
      Number(expenseForm.amount) <= 0
    ) {
      return toast.error(
        "Please enter a valid expense amount"
      );
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/expenses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...expenseForm,

            amount: Number(
              expenseForm.amount
            ),
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to add expense"
        );
      }

      toast.success(
        "Expense added successfully 💰"
      );

      setExpenseForm({
        category: "Chicken",
        amount: "",
        description: "",
      });

      fetchData();
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to record expense"
      );
    }
  };

  // ==========================================
  // EXPORT PDF
  // ==========================================

  const exportFinanceReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.setFont("helvetica", "bold");

    doc.text(
      "RFC - FINANCIAL REPORT",
      14,
      25
    );

    doc.setFontSize(10);

    doc.setFont("helvetica", "normal");

    doc.text(
      `Generated On: ${new Date().toLocaleString()}`,
      14,
      32
    );

    doc.line(14, 35, 196, 35);

    doc.setFontSize(12);

    doc.text(
      `Total Revenue: Rs ${totalRevenue}`,
      14,
      48
    );

    doc.text(
      `Total Expenses: Rs ${totalExpenses}`,
      14,
      56
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      `Net Profit: Rs ${netProfit}`,
      14,
      66
    );

    doc.line(14, 72, 196, 72);

    doc.save(
      `RFC_Financial_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );

    toast.success(
      "Financial PDF exported successfully!"
    );
  };

  // ==========================================
  // DATASETS
  // ==========================================

  const bestSellingData =
    getBestSellingData();

  const categoryData =
    getCategoryAnalytics();

  const trendData =
    getTimelineTrendData();

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-20 text-center font-black text-red-600 animate-pulse">
        Loading BI Dashboards...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen font-montserrat text-gray-800">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tight text-gray-900">
              Enterprise{" "}
              <span className="text-red-600">
                BI Panel
              </span>
            </h1>

            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Executive Financial Analytics Dashboard
            </p>
          </div>

          <button
            onClick={exportFinanceReport}
            className="bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            Export Financial PDF
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-[25px] shadow-xl border-l-8 border-blue-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Gross Revenue
            </p>

            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Rs {totalRevenue}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-[25px] shadow-xl border-l-8 border-red-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total Expenses
            </p>

            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Rs {totalExpenses}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-[25px] shadow-xl border-l-8 border-green-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Net Profit
            </p>

            <h2
              className={`text-3xl font-black mt-2 ${
                netProfit >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Rs {netProfit}
            </h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* AREA CHART */}
          <div className="bg-white p-6 rounded-[35px] shadow-xl border border-gray-100">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-6">
              Revenue Timeline
            </h3>

            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <AreaChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.1}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="bg-white p-6 rounded-[35px] shadow-xl border border-gray-100">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-6">
              Top Selling Products
            </h3>

            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <BarChart data={bestSellingData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 9,
                    fontWeight: "bold",
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="sales"
                  radius={[8, 8, 0, 0]}
                >
                  {bestSellingData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === 0
                            ? "#dc2626"
                            : "#f87171"
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY + EXPENSE FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CATEGORY ANALYTICS */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[35px] shadow-xl border border-gray-100 h-fit">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">
              Category Revenue
            </h3>

            <div className="space-y-3">
              {categoryData.length === 0 ? (
                <p className="text-gray-400 italic text-xs py-4 text-center">
                  No category data available
                </p>
              ) : (
                categoryData.map((c) => (
                  <div
                    key={c.name}
                    className="flex justify-between items-center border-b border-dashed border-gray-100 pb-2"
                  >
                    <span className="text-xs font-black text-gray-600 uppercase">
                      {c.name}
                    </span>

                    <span className="text-sm font-black text-red-600">
                      Rs {c.value}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* EXPENSE FORM */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[35px] shadow-xl border border-gray-100">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-6">
              Post Expense Entry
            </h3>

            <form
              onSubmit={handleExpenseSubmit}
              className="space-y-5"
            >

              {/* CATEGORY */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Resource Category
                </label>

                <select
                  value={expenseForm.category}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      category:
                        e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-xl font-black text-xs uppercase tracking-wider outline-none text-gray-700 focus:border-red-600 focus:bg-white transition-all"
                >
                  <option value="Chicken">
                    Chicken
                  </option>

                  <option value="Oil">
                    Oil
                  </option>

                  <option value="Bill">
                    Bill
                  </option>

                  <option value="Staff">
                    Staff
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>
                </select>
              </div>

              {/* AMOUNT */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Total Transaction Amount
                </label>

                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      amount:
                        e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl font-bold text-sm outline-none focus:border-red-600 focus:bg-white transition-all"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Expense Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Describe expense details..."
                  value={
                    expenseForm.description
                  }
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      description:
                        e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl font-semibold text-xs outline-none focus:border-red-600 focus:bg-white transition-all"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 transition-all active:scale-[0.98]"
              >
                Commit Expense Entry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceDashboard;