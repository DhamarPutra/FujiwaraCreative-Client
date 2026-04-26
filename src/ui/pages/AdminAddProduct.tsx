import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import {
  PlusCircle,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const AdminAddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "99",
    type: "service",
    meta_title: "",
    meta_description: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name if slug is empty
      slug:
        name === "name" && !prev.slug
          ? value.toLowerCase().replace(/ /g, "-")
          : prev.slug,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (image) {
      try {
        // Image Compression & WebP Conversion
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
        };
        const compressedFile = await imageCompression(image, options);
        data.append("image", compressedFile, `${formData.slug}.webp`);
      } catch (error) {
        console.error("Compression failed:", error);
        data.append("image", image); // fallback to original
      }
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/products`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSuccess(true);
      setTimeout(() => navigate("/store"), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to add product. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <Helmet>
        <title>Add New Service - Admin Panel</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <PlusCircle className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Add New Service</h1>
            </div>
            <p className="text-slate-400">
              Expand your catalog with new high-quality offerings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3">
                <AlertCircle className="w-6 h-6" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center space-x-3">
                <Save className="w-6 h-6" />
                <span className="font-medium">
                  Service added successfully! Redirecting...
                </span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Enterprise Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="enterprise-web-dev"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Price (IDR)
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="5000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="service">Service</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media & SEO */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                  Media & SEO
                </h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Cover Image
                  </label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/webp,image/png,image/jpeg"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:bg-slate-100 group-hover:border-blue-400 transition-all">
                      {image ? (
                        <span className="text-blue-600 font-bold">
                          {image.name}
                        </span>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-xs text-slate-500">
                            Upload WebP (Max 1MB)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="SEO Title"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Describe the value of this service..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto px-12 py-4 flex items-center justify-center space-x-3 text-lg">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    <span>Publish Service</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
