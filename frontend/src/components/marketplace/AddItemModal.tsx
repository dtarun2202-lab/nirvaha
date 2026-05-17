import React, { useRef, useEffect, useCallback, useState } from 'react';
import SessionForm from './forms/SessionForm';
import RetreatForm from './forms/RetreatForm';
import ProductForm from './forms/ProductForm';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, MapPin, BookOpen, ShoppingBag } from 'lucide-react';
import BACKEND_CONFIG from '../../config/backend';

type AddItemType = "session" | "retreat" | "product";

interface AddItemModalProps {
  onClose: () => void;
  selectedAddType: AddItemType;
  setSelectedAddType: (type: AddItemType) => void;
}

interface MarketplaceRequest {
  id: string;
  type: "session" | "retreat" | "product";
  status: "pending" | "approved";
  data: any;
  createdAt: number;
}

const MARKETPLACE_REQUESTS_KEY = "nirvaha_marketplace_requests";

const AddItemModal: React.FC<AddItemModalProps> = ({
  onClose,
  selectedAddType,
  setSelectedAddType,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleEscape, handleClickOutside]);

  const handleTypeSelect = (type: AddItemType) => {
    setSelectedAddType(type);
    setStep(2);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      // Create marketplace request object
      const request: MarketplaceRequest = {
        id: uuidv4(),
        type: selectedAddType,
        status: "pending",
        data: formData,
        createdAt: Date.now(),
      };

      // Send to backend API
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/marketplace/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedAddType,
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save marketplace request");
      }

      // Also save to localStorage for quick access
      const raw = localStorage.getItem(MARKETPLACE_REQUESTS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [...existing, request];
      localStorage.setItem(MARKETPLACE_REQUESTS_KEY, JSON.stringify(updated));
      
      // Notify other tabs/windows
      window.dispatchEvent(new CustomEvent('marketplace-updated'));
      
      // Notify BroadcastChannel if available
      try {
        const channel = new BroadcastChannel("nirvaha-marketplace");
        channel.postMessage({ type: 'new-request', request });
        channel.close();
      } catch {
        // BroadcastChannel not supported
      }
      
      console.log('✅ [FORM] Saved marketplace request:', request);
      
      // Reset modal state and close
      setStep(1);
      setSelectedAddType("session"); // Reset to default
      onClose();
    } catch (error) {
      console.error('❌ [FORM] Failed to save marketplace request:', error);
      alert("Failed to submit item. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1a14]/60 backdrop-blur-md">
      <div
        ref={modalRef}
        className={`bg-white rounded-[40px] shadow-2xl p-10 w-full ${step === 1 ? 'max-w-lg' : 'max-w-2xl'} mx-4 relative max-h-[90vh] overflow-y-auto border border-white/20`}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-[#1a5d47]/40 hover:text-[#1a5d47] transition-colors p-2 hover:bg-[#1a5d47]/5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div className="py-4">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1a5d47] to-[#2d8a6a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/20 text-white">
                <Plus className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0f131a]">Add to Marketplace</h2>
              <p className="text-[#1a5d47]/60 font-medium mt-2">What would you like to publish today?</p>
            </div>

            <div className="flex flex-col items-center space-y-4 px-6">
              {[
                { id: "retreat", label: "Retreat", icon: MapPin },
                { id: "session", label: "Session", icon: BookOpen },
                { id: "product", label: "Product", icon: ShoppingBag },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleTypeSelect(opt.id as AddItemType)}
                  className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 border-2 border-[#D1FAE5] bg-[#F0F9F4] text-[#1a5d47] hover:border-[#1a5d47] hover:bg-[#E6F5EB] hover:shadow-lg hover:shadow-emerald-900/5 group"
                >
                  <opt.icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="transition-colors">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-2">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#0f131a]">New {selectedAddType.charAt(0).toUpperCase() + selectedAddType.slice(1)}</h2>
              <div className="w-12 h-1 bg-[#1a5d47] rounded-full mx-auto mt-4 opacity-20"></div>
            </div>
            {selectedAddType === "session" && <SessionForm onSubmit={handleFormSubmit} />}
            {selectedAddType === "retreat" && <RetreatForm onSubmit={handleFormSubmit} />}
            {selectedAddType === "product" && <ProductForm onSubmit={handleFormSubmit} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItemModal;

