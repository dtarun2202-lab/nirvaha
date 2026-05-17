import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, HelpCircle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
}: ConfirmModalProps) {
  const isDestructive = variant === "destructive";
  const Icon = isDestructive ? AlertCircle : HelpCircle;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-2xl border border-[#dceae2] shadow-[0_30px_70px_-15px_rgba(0,40,20,0.18)] rounded-[28px] max-w-md p-8 font-['Plus_Jakarta_Sans']">
        
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Icon Header */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-sm ${
            isDestructive 
              ? "bg-rose-50 border-rose-100 text-rose-500" 
              : "bg-[#f0f9f4] border-[#dceae2] text-[#2d9f68]"
          }`}>
            <Icon className="w-7 h-7" strokeWidth={2.5} />
          </div>

          {/* Text Content */}
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-[22px] font-black text-[#0a2e1f] tracking-tight text-center">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] font-medium text-[#4a7c65] leading-relaxed text-center">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Action Buttons */}
        <AlertDialogFooter className="mt-8 grid grid-cols-2 gap-3 sm:space-x-0">
          <AlertDialogCancel className="mt-0 w-full rounded-2xl py-6 text-[14px] font-bold bg-[#f5f8f6] hover:bg-[#eef3f1] text-[#4a7c65] border-transparent hover:text-[#1a3d2f] transition-all">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`w-full rounded-2xl py-6 text-[14px] font-bold shadow-lg transition-all ${
              isDestructive
                ? "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-900/15 text-white border-transparent"
                : "bg-gradient-to-r from-[#0a2e1f] to-[#124530] hover:from-[#0d3b28] hover:to-[#165a3f] shadow-emerald-900/15 text-white border-transparent"
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


