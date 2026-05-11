import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

function PlaceOrder() {
  const { food_list } = useContext(StoreContext);
  const { cartItems } = useCart();

  const navigate = useNavigate();

  const [address, setAddress] = useState("");

  const getTotalAmount = () => {
    let total = 0;

    food_list.forEach((item) => {
      if (cartItems[item._id]) {
        total += item.price * cartItems[item._id];
      }
    });

    return total;
  };

  // const loadRazorpay = () => {
  //   return new Promise((resolve) => {
  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.onload = () => {
  //       resolve(true);
  //     };
  //     script.onerror = () => {
  //       resolve(false);
  //     };
  //     document.body.appendChild(script);
  //   });
  // };

  const handlePayment = async () => {
    // const isLoaded = await loadRazorpay();

    // if (!isLoaded) {
    //   toast.error("Razorpay SDK failed to load");
    //   return;
    // }

    try {
      const items = food_list
        .filter((food) => cartItems[food._id] > 0)
        .map((food) => ({
          food: food._id,
          name: food.name,
          quantity: cartItems[food._id],
          price: food.price,
        }));

      const totalAmount = getTotalAmount() + 50;

      const res = await API.post("/orders/create", {
        items,
        totalAmount,
        deliveryAddress: address,
      });

      const order = res.data.razorpayOrder;

      const options = {
        key: "rzp_test_Sb2jm8dxMJNPdl",
        amount: order.amount,
        currency: "INR",
        name: "FoodDeli",
        description: "Foo Order Payment",
        order_id: order.id,

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        handler: async function (response) {
          await API.post("/orders/verify", {
            ...response,
            items,
            totalAmount,
            deliveryAddress: address,
          });

          toast.success("Payment Successful");

          navigate("/order-success");
        },

        theme: {
          color: "#ff6347",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed");

        console.log(response.error);
      });

      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="place-order">
      <div className="place-order-left">
        <h2>Delivery Information</h2>

        <textarea
          placeholder="Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="place-order-right">
        <h2>Order Summary</h2>

        <p>Total Amount: ₹{getTotalAmount()}</p>
        <p>Delivery Fee: ₹50</p>

        <h3>Total: ₹{getTotalAmount() + 50}</h3>

        <button onClick={handlePayment}>PAY WITH RAZORPAY</button>
      </div>
    </div>
  );
}

export default PlaceOrder;
