import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Book,
  Code,
  Terminal,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Zap,
} from "lucide-react";

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const codeExample = `import axios from "axios";
import CryptoJS from "crypto-js";

const API_KEY = "YOUR_HMAC_SECRET"; // Get this from Key Access

const request_body = {
  user_id: "YOUR_USER_UUID",
  finish_url: "https://your-site.com/success",
  error_url: "https://your-site.com/error",
  pending_url: "https://your-site.com/pending",
  items: [{ id: "PRODUCT_UUID", quantity: 1 }],
};

// 1. Stringify payload consistently (no spaces)
const payload = JSON.stringify(request_body);

// 2. Generate HMAC Signature
const signature = CryptoJS.HmacSHA256(payload, API_KEY).toString();

const options = {
  method: "POST",
  url: "${apiUrl}/orders",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Signature": signature,
  },
  data: payload,
};

try {
  const { data } = await axios.request(options);
  console.log("Order Created!", data.order_id);
  window.location.href = data.redirect_url;
} catch (error) {
  console.error("Integration Error", error.response?.data);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>API Documentation | Fujiwara Creative</title>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full text-blue-100 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-400/30">
            <Zap className="w-4 h-4 fill-current" />
            <span>Developer Documentation v2.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Integrate with <span className="text-blue-200">Fujiwara</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-90">
            Learn how to implement our external checkout system using HMAC
            SHA256 security.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Steps */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <Book className="w-5 h-5 text-blue-600" />
                <span>Integration Steps</span>
              </h3>

              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                    Get Credentials
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Go to{" "}
                    <a
                      href="/developer"
                      className="text-blue-600 hover:underline">
                      Developer Settings
                    </a>{" "}
                    and copy your HMAC Secret & User ID.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                    CORS Setup
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Register your domain in the 'Allowed Website' field to
                    bypass CORS policy.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                    Generate Signature
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Sign your request body using HMAC SHA256 with your secret
                    key.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                    Launch Payment
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Send the request and redirect your users to the provided
                    Midtrans URL.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* API Endpoint Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Checkout Endpoint
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-widest">
                  POST
                </span>
              </div>

              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8">
                <Terminal className="w-5 h-5 text-slate-400" />
                <code className="text-blue-600 font-bold break-all">
                  {apiUrl}/orders
                </code>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Request Headers</span>
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left border-b border-slate-100">
                      <th className="pb-3 font-medium">Header</th>
                      <th className="pb-3 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-4 font-mono text-blue-600">
                        X-Signature
                      </td>
                      <td className="py-4 text-slate-500 italic">
                        HMAC SHA256 Hash of Body
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-mono text-blue-600">
                        Content-Type
                      </td>
                      <td className="py-4 text-slate-500">application/json</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Code Block */}
            <div className="bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Implementation Example (Node/JS)
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-blue-300">{codeExample}</code>
                </pre>
              </div>
            </div>

            {/* Support Footer */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Need help with integration?
                </h3>
                <p className="text-blue-100 opacity-80">
                  Our team is ready to assist you 24/7.
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center space-x-2">
                <span>Contact Support</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
