import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const PremiumCheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          redirect: "if_required",
        }
      );

      if (stripeError) {
        console.error("Stripe error:", stripeError);
        setError(stripeError.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // If payment successful, update backend
      if (paymentIntent && paymentIntent.status === "succeeded") {
        try {
          const token = localStorage.getItem("authToken");
          console.log("Updating premium status for:", user.email);
          console.log("Payment Intent ID:", paymentIntent.id);
          console.log("Token exists:", !!token);

          const response = await axios.patch(
            `https://citywatch-server.vercel.app/users/${user.email}/premium`,
            { transactionId: paymentIntent.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("Backend response:", response.data);
          onSuccess();
        } catch (backendError) {
          console.error("Backend error:", backendError);
          console.error("Backend error response:", backendError.response?.data);
          setError(
            "Payment successful but failed to update account. Please contact support with payment ID: " +
              paymentIntent.id
          );
          setLoading(false);
        }
      } else {
        setError("Payment was not completed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              address: {
                country: "BD",
              },
            },
          },
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>Pay ৳1000</>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
};

export default PremiumCheckoutForm;
