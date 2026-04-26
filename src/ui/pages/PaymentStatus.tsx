import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const PaymentStatus: React.FC = () => {
  const { status } = useParams<{ status: string }>();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [syncing, setSyncing] = useState(false);
  const [realStatus, setRealStatus] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      setSyncing(true);
      // Panggil endpoint sync untuk memaksa update status dari Midtrans
      axios
        .get(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/orders/${orderId}/sync`,
        )
        .then((res) => {
          setRealStatus(res.data.status);
        })
        .catch((err) => console.error("Sync failed", err))
        .finally(() => setSyncing(false));
    }
  }, [orderId]);

  const renderContent = () => {
    if (syncing) {
      return (
        <div className="text-center py-8">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Checking your payment status...</p>
        </div>
      );
    }

    // Gunakan status dari URL sebagai fallback, tapi utamakan realStatus dari DB
    const displayStatus = realStatus || (status === "finish" ? "paid" : status);

    switch (displayStatus) {
      case "paid":
      case "settlement":
      case "capture":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you for your order. We will process your request shortly.
            </p>
            {orderId && (
              <p className="text-sm text-slate-400 mb-8">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
          </div>
        );
      case "failed":
      case "deny":
      case "cancel":
      case "error":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-slate-600 mb-8">
              There was an issue with your transaction. Please try again or
              contact support.
            </p>
          </div>
        );
      case "pending":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Payment Pending
            </h1>
            <p className="text-slate-600 mb-8">
              Your payment is being processed. Please check back later.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Unknown Status
            </h1>
            <p className="text-slate-600 mb-8">
              We couldn't determine the status of your payment ({displayStatus}
              ).
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Payment Status - Fujiwara Creative</title>
      </Helmet>
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
        {renderContent()}
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 text-blue-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default PaymentStatus;
