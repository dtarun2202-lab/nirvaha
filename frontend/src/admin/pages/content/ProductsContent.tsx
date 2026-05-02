import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AdminTable } from "@/admin/components/AdminTable";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { ActionMenu } from "@/admin/components/ActionMenu";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Upload, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out-of-stock";
  description: string;
  image?: string;
  inventoryEnabled: boolean;
}

export function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    status: "active",
    description: "",
    inventoryEnabled: true,
  });
  const [imageName, setImageName] = useState("");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "P-001",
      name: "Spiritual Journey Kit",
      category: "Wellness Kits",
      price: 2499,
      stock: 15,
      status: "active",
      description: "Complete wellness kit with meditation accessories...",
      image: "",
      inventoryEnabled: true,
    },
    {
      id: "P-002",
      name: "Ayurvedic Herbal Tea Set",
      category: "Beverages",
      price: 599,
      stock: 0,
      status: "out-of-stock",
      description: "Organic herbal tea blends for wellness...",
      image: "",
      inventoryEnabled: true,
    },
    {
      id: "P-003",
      name: "Yoga Mat Premium",
      category: "Accessories",
      price: 1299,
      stock: 30,
      status: "active",
      description: "High-quality eco-friendly yoga mat...",
      image: "",
      inventoryEnabled: true,
    },
  ]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      status: "active",
      description: "",
      inventoryEnabled: true,
    });
    setImageName("");
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setImageName(product.image || "");
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...formData, image: imageName } : p
        )
      );
    } else {
      const newProduct: Product = {
        id: `P-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: formData.name || "",
        category: formData.category || "",
        price: formData.price || 0,
        stock: formData.stock || 0,
        status: (formData.status as Product["status"]) || "active",
        description: formData.description || "",
        image: imageName,
        inventoryEnabled: formData.inventoryEnabled ?? true,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "category",
      header: "Category",
    },
    {
      key: "price",
      header: "Price",
      render: (item: Product) => (
        <span className="font-semibold text-black">₹{item.price}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (item: Product) => (
        <span className={item.stock === 0 ? "text-red-500 font-semibold" : "text-gray-700"}>
          {item.stock} units
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Product) => (
        <StatusBadge
          status={item.status === "out-of-stock" ? "out-of-stock" : item.status}
          variant="default"
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Product) => (
        <ActionMenu
          variant="content"
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item)}
        />
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#F4FAF6] min-h-screen -m-6 rounded-tl-3xl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white border border-[#D5EEDD] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#5ABF88] p-3 rounded-xl text-white shadow-sm">
                 <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-[#1F4131]">Marketplace Products</h2>
                 <p className="text-[#64C08E] text-sm font-semibold">{filteredProducts.length} products total</p>
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-[#4EAA77] hover:bg-[#3C9162] text-white rounded-xl px-6 py-2.5 h-auto font-bold shadow-md">
              <Plus className="mr-2 w-5 h-5" />
              Add Product
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#86CDA6]" />
              <Input
                placeholder="Search by title, category or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white border border-[#BEE4CD] text-[#295641] placeholder:text-[#86CDA6] rounded-xl h-14 w-full focus-visible:ring-[#5ABF88] font-medium"
              />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-[#D5EEDD] bg-white overflow-hidden shadow-sm">
           {/* Table Header */}
           <div className="grid grid-cols-12 gap-4 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-5 text-xs font-bold text-[#1A4F35] tracking-widest uppercase">
              <div className="col-span-4 pl-2">Title</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right pr-4">Actions</div>
           </div>

           {/* Table Body */}
           <div className="divide-y divide-[#E6F5EB]">
              {filteredProducts.map((product) => (
                 <div key={product.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#F6FDF8] transition-colors">
                    <div className="col-span-4 flex items-center gap-4">
                       <div className="bg-[#E4F6EB] p-2.5 rounded-lg text-[#40B075] shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                       </div>
                       <span className="font-medium text-[#2A4939] text-[15px]">{product.name}</span>
                    </div>
                    <div className="col-span-2 text-gray-500 font-semibold text-sm">₹{product.price}</div>
                    <div className="col-span-2">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${product.stock === 0 ? 'bg-[#FEEAEA] text-[#D84C4C]' : 'bg-[#FAF2CD] text-[#9A7D11]'}`}>
                          {product.stock} units
                       </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                       <span className={`flex items-center gap-2 px-3 py-1.5 bg-[#EAFBF0] text-[#34A46B] rounded-full text-xs font-bold border border-[#BDE8CE]`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'out-of-stock' ? 'bg-red-500' : 'bg-[#40C381]'}`}></span>
                          {product.status === 'out-of-stock' ? 'Out of Stock' : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                       </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-3 pr-2">
                       <button onClick={() => handleEdit(product)} className="px-4 py-1.5 text-xs font-bold text-[#3FB878] border border-[#BDE8CE] rounded-lg hover:bg-[#E8F8EE] transition-colors bg-white shadow-sm">
                          Edit
                       </button>
                       <button onClick={() => handleDelete(product)} className="px-4 py-1.5 text-xs font-bold text-[#E76E6E] border border-[#F8CACA] rounded-lg hover:bg-red-50 transition-colors bg-white shadow-sm">
                          Delete
                       </button>
                    </div>
                 </div>
              ))}
              {filteredProducts.length === 0 && (
                 <div className="p-12 text-center text-[#64C08E] font-bold text-lg">
                    No products found
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-[#F4FAF6] border-[#D5EEDD] rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] px-6 py-5 border-b border-[#A7E2C3]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#1F4131]">{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              <DialogDescription className="text-[#329D66] font-medium text-sm mt-1">
                {selectedProduct ? "Update product details" : "Create a new marketplace product"}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="px-6 py-5 overflow-y-auto space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
              <Label htmlFor="name" className="text-[#2A4939] font-bold">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 bg-white border-[#BEE4CD] text-[#295641] focus-visible:ring-[#5ABF88] rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                <Label htmlFor="category" className="text-[#2A4939] font-bold">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2 bg-white border-[#BEE4CD] text-[#295641] focus-visible:ring-[#5ABF88] rounded-xl font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#BEE4CD]">
                    <SelectItem value="Wellness Kits">Wellness Kits</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Herbs & Supplements">Herbs & Supplements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                <Label htmlFor="status" className="text-[#2A4939] font-bold">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="mt-2 bg-white border-[#BEE4CD] text-[#295641] focus-visible:ring-[#5ABF88] rounded-xl font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#BEE4CD]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                <Label htmlFor="price" className="text-[#2A4939] font-bold">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="mt-2 bg-white border-[#BEE4CD] text-[#295641] focus-visible:ring-[#5ABF88] rounded-xl font-medium"
                />
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
                <Label htmlFor="stock" className="text-[#2A4939] font-bold">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="mt-2 bg-white border-[#BEE4CD] text-[#295641] focus-visible:ring-[#5ABF88] rounded-xl font-medium disabled:bg-[#F6FDF8] disabled:text-[#86CDA6]"
                  disabled={!formData.inventoryEnabled}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-[#EAFBF0] rounded-2xl border border-[#BDE8CE]">
              <div>
                <Label htmlFor="inventory" className="text-[#1F4131] font-bold">Inventory Management</Label>
                <p className="text-sm text-[#329D66] font-medium mt-1">
                  Track stock levels for this product
                </p>
              </div>
              <Switch
                id="inventory"
                checked={formData.inventoryEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, inventoryEnabled: checked })
                }
              />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
              <Label htmlFor="description" className="text-[#2A4939] font-bold">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 bg-white border-[#BEE4CD] text-[#295641] focus-visible:ring-[#5ABF88] rounded-xl font-medium"
                rows={4}
              />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D5EEDD] shadow-sm">
              <Label className="text-[#2A4939] font-bold">Product Image</Label>
              <p className="text-xs text-[#64C08E] font-medium mt-1 mb-3">Recommended: 500x500px (JPG, PNG)</p>
              <div>
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageName(e.target.files?.[0]?.name || "")}
                  />
                  <div className="w-full flex items-center justify-center border-2 border-dashed border-[#BEE4CD] hover:border-[#5ABF88] hover:bg-[#F6FDF8] bg-[#FAFDFA] transition-colors rounded-xl p-4 text-[#34A46B] font-bold">
                    <Upload className="mr-2 w-5 h-5" />
                    {imageName || "Upload Image"}
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-t border-[#D5EEDD] p-5">
            <DialogFooter className="flex w-full justify-between sm:justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="bg-white border-[#BEE4CD] text-[#295641] hover:bg-[#F6FDF8] font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#4EAA77] hover:bg-[#3C9162] text-white font-bold rounded-xl shadow-sm px-8"
                onClick={handleSave}
              >
                {selectedProduct ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}


