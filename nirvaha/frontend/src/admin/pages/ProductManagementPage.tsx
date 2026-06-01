import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, RotateCw, Edit3, Trash2, 
  Package, Tag, IndianRupee, Layers, 
  AlertCircle, CheckCircle2, ShoppingBag, X
} from "lucide-react";
import { BACKEND_CONFIG } from "@/config/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductStatus = "active" | "out-of-stock" | "inactive";

interface Product {
  id: string;
  _id?: string;
  type: "product";
  status: ProductStatus;
  data: {
    title: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    image?: string;
  };
  createdAt: string;
}

const STATUS_CONFIG: Record<ProductStatus, { label: string; pill: string; dot: string }> = {
  active: { label: "Active", pill: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  "out-of-stock": { label: "Out of Stock", pill: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
  inactive: { label: "Inactive", pill: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: 0,
    stock: 0,
    status: "active" as ProductStatus,
    image: "",
    description: ""
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/items/all`);
      if (res.ok) {
        const data = await res.json();
        const prods = data.filter((i: any) => i.type === "product");
        setProducts(prods);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      category: "",
      price: 0,
      stock: 0,
      status: "active",
      image: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.data.title,
      category: p.data.category,
      price: p.data.price,
      stock: p.data.stock,
      status: p.status,
      image: p.data.image || "",
      description: p.data.description || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const url = editingProduct 
        ? `${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/items/${editingProduct.id || editingProduct._id}`
        : `${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/items`;
      
      const method = editingProduct ? "PUT" : "POST";
      
      const body = {
        type: "product",
        status: formData.status,
        data: {
          title: formData.title,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: formData.image,
          description: formData.description
        }
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadProducts();
      }
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/items/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadProducts();
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => 
      p.data.title.toLowerCase().includes(q) || 
      p.data.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf9] via-[#fdfdfd] to-[#f0f9f4] p-8 -m-8 rounded-tl-[40px]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[20px] bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0a2e1f]">Product Marketplace</h1>
                <p className="text-[#5a8c72] font-medium text-sm">Manage your wellness shop inventory</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              className="p-3.5 rounded-2xl bg-white border border-emerald-100 text-emerald-600 shadow-sm hover:bg-emerald-50 transition-all"
            >
              <RotateCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#0a2e1f] text-white rounded-[22px] font-bold shadow-xl shadow-emerald-900/10 hover:bg-[#0d3a27] transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </motion.button>
          </div>
        </div>

        {/* Filters & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9dc9b4]" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product name or category..."
              className="w-full h-[64px] pl-12 pr-6 rounded-3xl bg-white border border-emerald-100 shadow-sm text-[#0a2e1f] placeholder:text-[#9dc9b4] focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div className="lg:col-span-4 flex gap-4">
             <div className="flex-1 bg-white border border-emerald-100 rounded-3xl p-4 flex flex-col justify-center shadow-sm">
                <p className="text-[10px] font-extrabold text-[#7a9c8a] uppercase tracking-widest">Total Products</p>
                <p className="text-2xl font-bold text-[#0a2e1f]">{products.length}</p>
             </div>
             <div className="flex-1 bg-white border border-emerald-100 rounded-3xl p-4 flex flex-col justify-center shadow-sm">
                <p className="text-[10px] font-extrabold text-[#7a9c8a] uppercase tracking-widest">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">{products.filter(p => p.data.stock < 10 && p.data.stock > 0).length}</p>
             </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white/70 backdrop-blur-md rounded-[40px] border border-emerald-100/50 shadow-2xl shadow-emerald-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50">
                  <th className="px-8 py-6 text-[11px] font-black text-[#1a4d32] uppercase tracking-[0.2em]">Product Details</th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#1a4d32] uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#1a4d32] uppercase tracking-[0.2em]">Pricing</th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#1a4d32] uppercase tracking-[0.2em]">Inventory</th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#1a4d32] uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#1a4d32] uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {filtered.map((p) => {
                  const status = p.status || (p.data.stock <= 0 ? "out-of-stock" : "active");
                  const cfg = STATUS_CONFIG[status as ProductStatus] || STATUS_CONFIG.active;
                  
                  return (
                    <tr 
                      key={p.id || p._id}
                      className="group hover:bg-emerald-50/30 transition-colors border-b border-emerald-50"
                    >
                      {/* Product Title */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-100 overflow-hidden shrink-0 shadow-sm p-1">
                             {p.data.image ? (
                               <img src={p.data.image} alt="" className="w-full h-full object-cover rounded-xl" />
                             ) : (
                               <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300">
                                 <Package className="w-6 h-6" />
                               </div>
                             )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[15px] font-bold text-[#0a2e1f] truncate">{p.data.title}</p>
                            <p className="text-xs text-[#7a9c8a] font-medium truncate">ID: {p.id?.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-8 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-emerald-100 text-xs font-bold text-emerald-700">
                          <Layers className="w-3.5 h-3.5" />
                          {p.data.category}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1 text-[15px] font-black text-[#0a2e1f]">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {p.data.price?.toLocaleString()}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <div className="w-24 h-2 bg-emerald-50 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full transition-all ${p.data.stock > 10 ? 'bg-emerald-400' : p.data.stock > 0 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                 style={{ width: `${Math.min((p.data.stock / 50) * 100, 100)}%` }}
                               />
                             </div>
                             <span className={`text-xs font-bold ${p.data.stock > 10 ? 'text-emerald-600' : p.data.stock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                               {p.data.stock}
                             </span>
                          </div>
                          <p className="text-[9px] font-extrabold text-[#9dc9b4] uppercase tracking-widest">Available Items</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-bold ${cfg.pill}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                           {cfg.label}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(p)}
                            className="w-10 h-10 rounded-xl bg-white border border-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id || p._id || "")}
                            className="w-10 h-10 rounded-xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-emerald-200" />
                        </div>
                        <div>
                          <p className="text-[#0a2e1f] font-bold">No products found</p>
                          <p className="text-sm text-[#7a9c8a]">Try a different search or add a new product</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add/Edit Product */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white">
            <div className="bg-emerald-500 p-8 text-white relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  {editingProduct ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  {editingProduct ? "Edit Product" : "New Marketplace Product"}
                </DialogTitle>
                <p className="text-emerald-100 font-medium opacity-80">
                  {editingProduct ? "Modify existing inventory details" : "Create a new high-quality product listing"}
                </p>
              </DialogHeader>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Product Title</label>
                  <Input 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="h-14 rounded-2xl border-emerald-100 focus:ring-emerald-200 bg-emerald-50/20"
                    placeholder="e.g. Zen Meditation Mat"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Category</label>
                  <Input 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="h-14 rounded-2xl border-emerald-100 focus:ring-emerald-200 bg-emerald-50/20"
                    placeholder="e.g. Wellness Essentials"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Price (₹)</label>
                  <Input 
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="h-14 rounded-2xl border-emerald-100 focus:ring-emerald-200 bg-emerald-50/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Stock Level</label>
                  <Input 
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="h-14 rounded-2xl border-emerald-100 focus:ring-emerald-200 bg-emerald-50/20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Image URL</label>
                  <Input 
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="h-14 rounded-2xl border-emerald-100 focus:ring-emerald-200 bg-emerald-50/20"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-24 p-4 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20 text-sm outline-none"
                    placeholder="Short product details..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-[#7a9c8a] uppercase tracking-widest px-1">Availability Status</label>
                  <div className="flex gap-3">
                    {Object.keys(STATUS_CONFIG).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s as ProductStatus })}
                        className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.status === s 
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200" 
                            : "bg-white border-emerald-100 text-[#7a9c8a] hover:bg-emerald-50"
                        }`}
                      >
                        {STATUS_CONFIG[s as ProductStatus].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 pt-0 flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-14 rounded-2xl border border-emerald-100 font-bold text-[#7a9c8a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-[2] h-14 rounded-2xl bg-[#0a2e1f] text-white font-bold hover:bg-[#0d3a27] shadow-xl shadow-emerald-900/10"
              >
                {editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
