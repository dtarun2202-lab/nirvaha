import { getInitials } from '@/lib/getInitials';
import { cn } from '@/lib/utils';

const sizeClasses = {
  xs: 'w-7 h-7 text-[10px] rounded-xl',
  sm: 'w-9 h-9 text-xs rounded-xl',
  md: 'w-10 h-10 text-sm rounded-2xl',
  lg: 'w-12 h-12 text-base rounded-2xl',
  xl: 'w-16 h-16 text-xl rounded-full',
  '2xl': 'w-20 h-20 text-2xl rounded-2xl',
  profile: 'w-32 h-32 text-4xl rounded-[32px]',
} as const;

type InitialsAvatarSize = keyof typeof sizeClasses;

type InitialsAvatarProps = {
  name?: string | null;
  size?: InitialsAvatarSize;
  className?: string;
  backgroundColor?: string;
};

export function InitialsAvatar({
  name,
  size = 'md',
  className,
  backgroundColor,
}: InitialsAvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'flex items-center justify-center font-bold text-white shadow-sm shrink-0',
        'bg-gradient-to-br from-[#52B788] to-[#2D6A4F]',
        sizeClasses[size],
        className
      )}
      style={backgroundColor ? { background: backgroundColor } : undefined}
      aria-hidden
    >
      {initials}
    </div>
  );
}
