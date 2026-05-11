import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/get");
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to load orders");
      console.log("Orders.jsx error", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status });
      toast.success("Order updated");
      fetchOrders();
    } catch (err) {
      const message = err.response?.data?.message || "Status update failed";

      toast.error(message);
      console.log("Update Status error", err);
    }
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>

                <td>₹{order.totalAmount}</td>

                <td>{order.status}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <br></br>
      <br></br>
      {orders.length == 0 && (
        <h3>
          <b>No orders yet.</b>
        </h3>
      )}
    </div>
  );
}

export default Orders;
