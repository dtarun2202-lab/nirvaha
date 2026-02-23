import React from 'react';

interface DecorativeShapesProps {
    variant?: 1 | 2 | 3 | 4 | 5;
    color?: string;
}

/**
 * Subtle decorative background shapes placed at irregular positions
 * along edges and sweet spots. Use different variants for visual variety.
 */
const DecorativeShapes: React.FC<DecorativeShapesProps> = ({ variant = 1, color = '#1a5d47' }) => {
    const shapes: Record<number, React.ReactNode> = {
        1: (
            <>
                <svg className="absolute -top-6 -left-8 w-36 h-36 opacity-[0.04]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="45" />
                </svg>
                <svg className="absolute top-10 right-6 w-20 h-20 opacity-[0.06] rotate-45" viewBox="0 0 100 100" fill={color}>
                    <rect x="15" y="15" width="70" height="70" rx="8" />
                </svg>
                <svg className="absolute top-1/3 -left-4 w-28 h-28 opacity-[0.03]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,3 93,25 93,75 50,97 7,75 7,25" />
                </svg>
                <svg className="absolute top-[45%] -right-3 w-24 h-24 opacity-[0.05] rotate-12" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,10 90,85 10,85" />
                </svg>
                <svg className="absolute bottom-16 left-[8%] w-14 h-14 opacity-[0.07]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="40" />
                </svg>
                <svg className="absolute bottom-20 right-[10%] w-18 h-18 opacity-[0.05] -rotate-12" viewBox="0 0 100 100" fill={color}>
                    <rect x="10" y="10" width="80" height="80" rx="20" />
                </svg>
                <svg className="absolute -bottom-4 -left-6 w-32 h-32 opacity-[0.03]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="20" cy="20" r="8" />
                    <circle cx="50" cy="30" r="6" />
                    <circle cx="35" cy="55" r="10" />
                    <circle cx="70" cy="50" r="5" />
                </svg>
                <svg className="absolute -bottom-6 -right-8 w-40 h-40 opacity-[0.04]" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={3}>
                    <circle cx="50" cy="50" r="42" />
                    <circle cx="50" cy="50" r="28" />
                </svg>
            </>
        ),
        2: (
            <>
                <svg className="absolute -top-4 right-[12%] w-28 h-28 opacity-[0.04] rotate-[15deg]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,3 93,25 93,75 50,97 7,75 7,25" />
                </svg>
                <svg className="absolute top-8 -left-5 w-24 h-24 opacity-[0.05]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="38" />
                </svg>
                <svg className="absolute top-[40%] right-4 w-16 h-16 opacity-[0.06] rotate-[60deg]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,10 90,85 10,85" />
                </svg>
                <svg className="absolute top-[55%] -left-6 w-20 h-20 opacity-[0.04] rotate-45" viewBox="0 0 100 100" fill={color}>
                    <rect x="15" y="15" width="70" height="70" rx="6" />
                </svg>
                <svg className="absolute bottom-12 right-[20%] w-12 h-12 opacity-[0.07]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="35" />
                </svg>
                <svg className="absolute bottom-6 left-[30%] w-20 h-20 opacity-[0.03]" viewBox="0 0 100 100" fill={color}>
                    <ellipse cx="50" cy="50" rx="20" ry="45" />
                </svg>
                <svg className="absolute -bottom-5 -right-4 w-36 h-36 opacity-[0.03]" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={2}>
                    <circle cx="50" cy="50" r="44" />
                    <circle cx="50" cy="50" r="30" />
                    <circle cx="50" cy="50" r="16" />
                </svg>
            </>
        ),
        3: (
            <>
                <svg className="absolute -top-3 -right-6 w-32 h-32 opacity-[0.03]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="42" />
                </svg>
                <svg className="absolute top-[30%] right-[8%] w-14 h-14 opacity-[0.06] rotate-45" viewBox="0 0 100 100" fill={color}>
                    <rect x="10" y="10" width="80" height="80" rx="10" />
                </svg>
                <svg className="absolute top-[50%] -left-5 w-26 h-26 opacity-[0.04]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,10 90,85 10,85" />
                </svg>
                <svg className="absolute bottom-10 right-[5%] w-24 h-24 opacity-[0.04] -rotate-12" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,3 93,25 93,75 50,97 7,75 7,25" />
                </svg>
                <svg className="absolute -bottom-3 left-[25%] w-16 h-16 opacity-[0.05]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="36" />
                </svg>
                <svg className="absolute bottom-16 -left-4 w-28 h-28 opacity-[0.03]" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={3}>
                    <circle cx="50" cy="50" r="40" />
                </svg>
                <svg className="absolute top-[20%] left-[50%] w-10 h-10 opacity-[0.05] rotate-[55deg]" viewBox="0 0 100 100" fill={color}>
                    <ellipse cx="50" cy="50" rx="18" ry="42" />
                </svg>
            </>
        ),
        4: (
            <>
                <svg className="absolute -top-5 left-[20%] w-24 h-24 opacity-[0.04] rotate-[40deg]" viewBox="0 0 100 100" fill={color}>
                    <rect x="10" y="10" width="80" height="80" rx="16" />
                </svg>
                <svg className="absolute top-4 -right-4 w-30 h-30 opacity-[0.03]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="30" cy="30" r="12" />
                    <circle cx="70" cy="25" r="8" />
                    <circle cx="50" cy="60" r="15" />
                    <circle cx="80" cy="70" r="6" />
                </svg>
                <svg className="absolute top-[35%] left-3 w-18 h-18 opacity-[0.06]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,5 90,80 10,80" />
                </svg>
                <svg className="absolute top-[60%] -right-6 w-32 h-32 opacity-[0.03]" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={2.5}>
                    <polygon points="50,3 93,25 93,75 50,97 7,75 7,25" />
                </svg>
                <svg className="absolute -bottom-6 right-[15%] w-20 h-20 opacity-[0.05] rotate-[70deg]" viewBox="0 0 100 100" fill={color}>
                    <ellipse cx="50" cy="50" rx="22" ry="40" />
                </svg>
                <svg className="absolute bottom-20 -left-6 w-28 h-28 opacity-[0.04]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="40" />
                </svg>
                <svg className="absolute top-[15%] right-[40%] w-8 h-8 opacity-[0.07] rotate-45" viewBox="0 0 100 100" fill={color}>
                    <rect x="20" y="20" width="60" height="60" rx="4" />
                </svg>
            </>
        ),
        5: (
            <>
                <svg className="absolute top-8 right-[8%] w-18 h-18 opacity-[0.05]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="50" cy="50" r="36" />
                </svg>
                <svg className="absolute -top-4 -left-4 w-28 h-28 opacity-[0.04] rotate-[10deg]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,3 93,25 93,75 50,97 7,75 7,25" />
                </svg>
                <svg className="absolute top-[25%] right-4 w-22 h-22 opacity-[0.05] rotate-45" viewBox="0 0 100 100" fill={color}>
                    <rect x="15" y="15" width="70" height="70" rx="12" />
                </svg>
                <svg className="absolute bottom-14 right-[25%] w-14 h-14 opacity-[0.04]" viewBox="0 0 100 100" fill={color}>
                    <polygon points="50,10 90,85 10,85" />
                </svg>
                <svg className="absolute -bottom-5 left-[12%] w-24 h-24 opacity-[0.03]" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={3}>
                    <circle cx="50" cy="50" r="38" />
                    <circle cx="50" cy="50" r="22" />
                </svg>
                <svg className="absolute bottom-10 -right-5 w-32 h-32 opacity-[0.03]" viewBox="0 0 100 100" fill={color}>
                    <circle cx="25" cy="25" r="10" />
                    <circle cx="60" cy="20" r="7" />
                    <circle cx="40" cy="55" r="12" />
                    <circle cx="75" cy="60" r="5" />
                </svg>
                <svg className="absolute top-[65%] left-[55%] w-10 h-10 opacity-[0.05] rotate-[50deg]" viewBox="0 0 100 100" fill={color}>
                    <ellipse cx="50" cy="50" rx="20" ry="40" />
                </svg>
            </>
        ),
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {shapes[variant]}
        </div>
    );
};

export default DecorativeShapes;
