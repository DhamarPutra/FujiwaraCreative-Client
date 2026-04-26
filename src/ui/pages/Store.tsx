import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { ShoppingCart, Zap, Key, Book } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import JsonLd from "../components/JsonLd";
import type { RootState } from "../../application/store";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  type: string;
}

interface Snap {
  pay: (url: string, callbacks: {
    onSuccess: (result: unknown) => void;
    onPending: (result: unknown) => void;
    onError: (result: unknown) => void;
    onClose: () => void;
  }) => void;
}

declare global {
  interface Window {
    snap: Snap;
  }
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleCheckout = async (productId: string) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/store" } } });
      return;
    }

    // Pastikan script Midtrans terload
    if (!window.snap) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXFJTmV1Jc4Nl7J8");
      document.body.appendChild(script);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCheckoutLoading(productId);
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/checkout`,
        { items: [{ id: productId, quantity: 1 }] },
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      const { token, redirect_url } = response.data;
      const snap = window.snap;

      if (token && snap) {
        snap.pay(token, {
          onSuccess: () => navigate("/payment/finish?order_id=" + response.data.order_id),
          onPending: () => navigate("/payment/finish?order_id=" + response.data.order_id),
          onError: () => navigate("/payment/error"),
          onClose: () => console.log("Customer closed the popup"),
        });
      } else if (redirect_url) {
        window.location.href = redirect_url;
      } else {
        alert("Gagal memuat modul pembayaran.");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Gagal memproses pesanan.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  useEffect(() => {
    // In a real app, this would be an API call to the Laravel backend
    // For now, we'll use the sample data we seeded
    axios
      .get(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/products`,
      )
      .then((res) => {
        // Laravel API Resources membungkus data dalam properti 'data'
        const productsData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setProducts(productsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 bg-white">
      <Helmet>
        <title>Store - Fujiwara Creative Services</title>
        <meta
          name="description"
          content="Browse our premium web development and HAKI services."
        />
      </Helmet>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.map((p, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${import.meta.env.VITE_URL || 'http://localhost:5173'}/store`,
          "name": p.name,
          "description": p.description,
          "image": p.image_url,
          "offers": {
            "@type": "Offer",
            "price": p.price,
            "priceCurrency": "IDR",
            "availability": "https://schema.org/InStock"
          }
        }))
      }} />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Service Catalog
            </h1>
            <p className="text-slate-500 text-lg">
              Choose the right solution for your business.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            {isAuthenticated && (
              <>
                <Link to="/developer" className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm">
                  <Key className="w-4 h-4" />
                  <span>Key Access</span>
                </Link>
                <Link to="/docs/api" className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm">
                  <Book className="w-4 h-4" />
                  <span>Docs</span>
                </Link>
              </>
            )}
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest pl-4 border-l border-slate-200">
              {products.length} Items Available
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                      <ShoppingCart className="w-16 h-16 text-blue-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {product.type}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-slate-400 block uppercase font-bold tracking-tighter">
                        Price Starts From
                      </span>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <span className="text-2xl font-bold text-slate-900">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        <button
                          onClick={() => handleCheckout(product.id)}
                          disabled={checkoutLoading === product.id}
                          className="btn-primary py-2.5 px-6 flex items-center space-x-2 text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all">
                          {checkoutLoading === product.id ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              <span>Buy Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
