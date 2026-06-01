import { CharacterId, ARCHETYPES, QuizOption, Archetype } from './AncientCharacterData';

export interface QuizResult {
    primaryMatch: Archetype;
    secondaryMatch: Archetype;
    matchPercentage: number;
}

export const calculateResult = (selectedOptions: QuizOption[]): QuizResult => {
    const scores: Record<CharacterId, number> = {
        rama: 0,
        krishna: 0,
        hanuman: 0,
        arjuna: 0,
        sita: 0,
        karna: 0
    };

    let totalPointsAwarded = 0;

    selectedOptions.forEach(option => {
        Object.entries(option.points).forEach(([character, points]) => {
            if (points) {
                scores[character as CharacterId] += points;
                totalPointsAwarded += points;
            }
        });
    });

    // Sort characters by score descending
    const sortedCharacters = Object.entries(scores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([id]) => id as CharacterId);

    const primaryId = sortedCharacters[0];
    const secondaryId = sortedCharacters[1];

    // Calculate match percentage (keeping it between 76% and 94% as requested)
    const primaryScore = scores[primaryId];
    // Baseline raw percentage based on max possible points for one character (approx 30)
    let rawPercentage = (primaryScore / 30) * 100;
    
    // Scale and clamp to [76, 94]
    const minPercentage = 76;
    const maxPercentage = 94;
    // Map rawPercentage (assume range 30% to 100%) to [76, 94]
    const clampedPercentage = Math.min(
        maxPercentage,
        Math.max(
            minPercentage,
            Math.floor(minPercentage + ((rawPercentage - 30) / 70) * (maxPercentage - minPercentage))
        )
    );

    return {
        primaryMatch: ARCHETYPES[primaryId],
        secondaryMatch: ARCHETYPES[secondaryId],
        matchPercentage: clampedPercentage
    };
};

export const generateDownloadCardSVG = (result: QuizResult): string => {
    const { primaryMatch, matchPercentage } = result;
    const { primary, secondary } = primaryMatch.colors;
    
    const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0A1A0A" />
                    <stop offset="100%" stop-color="#050805" />
                </linearGradient>
                <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${primary}" />
                    <stop offset="100%" stop-color="${secondary}" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="30" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <!-- Background -->
            <rect width="1080" height="1920" fill="url(#bgGradient)" />
            
            <!-- Subtle Border -->
            <rect x="40" y="40" width="1000" height="1840" rx="30" fill="none" stroke="${primary}" stroke-opacity="0.3" stroke-width="2" />

            <!-- Header -->
            <text x="540" y="200" font-family="Georgia, serif" font-size="42" fill="#E5E7EB" opacity="0.8" text-anchor="middle" letter-spacing="4">CHECK YOUR ANCIENT CHARACTER</text>
            
            <!-- Visual Emblem -->
            <g transform="translate(540, 600)">
                <!-- Outer glow ring -->
                <circle cx="0" cy="0" r="280" fill="none" stroke="${primary}" stroke-width="4" opacity="0.2" filter="url(#glow)" />
                <circle cx="0" cy="0" r="240" fill="none" stroke="${primary}" stroke-width="2" opacity="0.4" />
                
                <!-- Inner medallion -->
                <circle cx="0" cy="0" r="180" fill="url(#primaryGradient)" opacity="0.1" />
                <circle cx="0" cy="0" r="160" fill="none" stroke="${secondary}" stroke-width="1" />
                
                <!-- Abstract geometric sigil based on primary color -->
                <path d="M 0 -120 L 104 60 L -104 60 Z" fill="none" stroke="${primary}" stroke-width="3" opacity="0.7" />
                <path d="M 0 120 L -104 -60 L 104 -60 Z" fill="none" stroke="${secondary}" stroke-width="3" opacity="0.7" />
                
                <!-- Character Initial -->
                <text x="0" y="45" font-family="Georgia, serif" font-size="140" fill="${primary}" text-anchor="middle" font-weight="bold">${primaryMatch.name.charAt(0)}</text>
            </g>

            <!-- Results Data -->
            <text x="540" y="1050" font-family="Georgia, serif" font-size="48" fill="#9CA3AF" text-anchor="middle" letter-spacing="2">YOU RESONATE MOST WITH</text>
            
            <text x="540" y="1160" font-family="Georgia, serif" font-size="120" fill="${primary}" text-anchor="middle" font-weight="bold" letter-spacing="4">${primaryMatch.name.toUpperCase()}</text>
            
            <text x="540" y="1240" font-family="system-ui, sans-serif" font-size="40" fill="#E5E7EB" text-anchor="middle" letter-spacing="6" font-weight="300">${primaryMatch.label.toUpperCase()}</text>
            
            <!-- Match Percentage Badge -->
            <rect x="390" y="1300" width="300" height="80" rx="40" fill="url(#primaryGradient)" opacity="0.15" />
            <rect x="390" y="1300" width="300" height="80" rx="40" fill="none" stroke="${primary}" stroke-width="1" opacity="0.5" />
            <text x="540" y="1352" font-family="system-ui, sans-serif" font-size="36" fill="${primary}" text-anchor="middle" font-weight="bold" letter-spacing="2">${matchPercentage}% MATCH</text>

            <!-- Qualities -->
            <g transform="translate(540, 1500)">
                <text x="0" y="0" font-family="system-ui, sans-serif" font-size="30" fill="#9CA3AF" text-anchor="middle" letter-spacing="4">REFLECTED QUALITIES</text>
                <text x="0" y="60" font-family="Georgia, serif" font-size="38" fill="#E5E7EB" text-anchor="middle">${primaryMatch.qualities.slice(0, 3).join(' • ')}</text>
            </g>

            <!-- Growth -->
            <g transform="translate(540, 1650)">
                <text x="0" y="0" font-family="system-ui, sans-serif" font-size="30" fill="#9CA3AF" text-anchor="middle" letter-spacing="4">PATH OF REFINEMENT</text>
                <text x="0" y="60" font-family="Georgia, serif" font-size="34" fill="#E5E7EB" text-anchor="middle">${primaryMatch.growth[0]}</text>
            </g>

            <!-- Footer -->
            <text x="540" y="1820" font-family="system-ui, sans-serif" font-size="24" fill="#6B7280" text-anchor="middle" letter-spacing="4">A REFLECTIVE JOURNEY • NIRVAHA</text>
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
};
