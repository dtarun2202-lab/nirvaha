import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check, X, Ban, Edit, Trash2 } from "lucide-react";

interface ActionMenuProps {
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSuspend?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  variant?: "companion" | "booking" | "content" | "user";
}

export function ActionMenu({
  onView,
  onApprove,
  onReject,
  onSuspend,
  onEdit,
  onDelete,
  onCancel,
  onComplete,
  variant = "default",
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-xl p-0 hover:bg-[#eef3f1] text-[#4a7c65] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-200">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/95 backdrop-blur-xl border border-[#dceae2] shadow-[0_12px_40px_-10px_rgba(10,46,31,0.08)] rounded-2xl w-48 p-2 font-['Plus_Jakarta_Sans']"
      >
        <DropdownMenuLabel className="text-[10px] font-black text-[#96b0a4] uppercase tracking-widest px-2 py-1.5">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#eaf1ed] my-1" />
        
        {onView && (
          <DropdownMenuItem onClick={onView} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-[#f4fbf6] focus:bg-[#f4fbf6] text-[#1a3d2f] font-semibold text-[13px] transition-colors">
            <Eye className="mr-2.5 h-4 w-4 text-[#4a7c65]" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-[#f4fbf6] focus:bg-[#f4fbf6] text-[#1a3d2f] font-semibold text-[13px] transition-colors">
            <Edit className="mr-2.5 h-4 w-4 text-[#4a7c65]" />
            Edit
          </DropdownMenuItem>
        )}
        {onApprove && (
          <DropdownMenuItem onClick={onApprove} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-[#f0f9f4] focus:bg-[#f0f9f4] text-[#0d5c36] font-bold text-[13px] transition-colors">
            <Check className="mr-2.5 h-4 w-4 text-[#2d9f68]" />
            Approve
          </DropdownMenuItem>
        )}
        {onComplete && (
          <DropdownMenuItem onClick={onComplete} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-[#f0f9f4] focus:bg-[#f0f9f4] text-[#0d5c36] font-bold text-[13px] transition-colors">
            <Check className="mr-2.5 h-4 w-4 text-[#2d9f68]" />
            Mark Completed
          </DropdownMenuItem>
        )}
        
        {(onReject || onSuspend || onDelete || onCancel) && <DropdownMenuSeparator className="bg-[#eaf1ed] my-1" />}

        {onReject && (
          <DropdownMenuItem onClick={onReject} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-rose-50 focus:bg-rose-50 text-rose-700 font-semibold text-[13px] transition-colors">
            <X className="mr-2.5 h-4 w-4 text-rose-400" />
            Reject
          </DropdownMenuItem>
        )}
        {onCancel && (
          <DropdownMenuItem onClick={onCancel} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-rose-50 focus:bg-rose-50 text-rose-700 font-semibold text-[13px] transition-colors">
            <X className="mr-2.5 h-4 w-4 text-rose-400" />
            Cancel Booking
          </DropdownMenuItem>
        )}
        {onSuspend && (
          <DropdownMenuItem onClick={onSuspend} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-orange-50 focus:bg-orange-50 text-orange-700 font-semibold text-[13px] transition-colors">
            <Ban className="mr-2.5 h-4 w-4 text-orange-400" />
            Suspend
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="cursor-pointer rounded-xl py-2 px-2.5 hover:bg-rose-50 focus:bg-rose-50 text-rose-700 font-semibold text-[13px] transition-colors">
            <Trash2 className="mr-2.5 h-4 w-4 text-rose-400" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
