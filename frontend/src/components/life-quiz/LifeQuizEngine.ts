import { LIFE_QUIZ_QUESTIONS, SCORING_DIMENSIONS, Dimension } from './LifeQuizData';

export interface ScoreResult {
    totalScore: number;
    dimensions: Record<Dimension, number>;
    passed: boolean;
    weakestDimensions: Dimension[];
    strongestDimensions: Dimension[];
}

export const calculateLifeScore = (answers: number[]): ScoreResult => {
    // 1. Calculate max possible score per dimension
    const maxScores: Record<Dimension, number> = {
        judgment: 0, integrity: 0, emotionalBalance: 0, responsibility: 0, compassion: 0, foresight: 0
    };
    
    // 2. Calculate user score per dimension
    const userScores: Record<Dimension, number> = {
        judgment: 0, integrity: 0, emotionalBalance: 0, responsibility: 0, compassion: 0, foresight: 0
    };

    LIFE_QUIZ_QUESTIONS.forEach((q, index) => {
        // Max possible for this question
        SCORING_DIMENSIONS.forEach(dim => {
            let maxInQ = 0;
            q.options.forEach(opt => {
                const val = opt.scores[dim.id] || 0;
                if (val > maxInQ) maxInQ = val;
            });
            maxScores[dim.id] += maxInQ;
        });

        // User score for this question
        const selectedOptionIndex = answers[index];
        if (selectedOptionIndex !== undefined && selectedOptionIndex !== null) {
            const selectedOption = q.options[selectedOptionIndex];
            SCORING_DIMENSIONS.forEach(dim => {
                userScores[dim.id] += (selectedOption.scores[dim.id] || 0);
            });
        }
    });

    // 3. Normalize to 100
    const normalizedDimensions: Record<Dimension, number> = { ...userScores };
    let totalNormalized = 0;
    
    SCORING_DIMENSIONS.forEach(dim => {
        const normalized = Math.round((userScores[dim.id] / Math.max(maxScores[dim.id], 1)) * 100);
        normalizedDimensions[dim.id] = normalized;
        totalNormalized += normalized;
    });

    const totalScore = Math.round(totalNormalized / SCORING_DIMENSIONS.length);

    // 4. Pass / Fail Logic
    // PASS: Life Score >= 75 AND no dimension critically low (< 50)
    let passed = totalScore >= 75;

    SCORING_DIMENSIONS.forEach(dim => {
        const score = normalizedDimensions[dim.id];
        if (score < 50) {
            passed = false;
        }
    });

    // Sort dimensions by score (descending)
    const sortedDimensions = Object.entries(normalizedDimensions)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id as Dimension);

    const strongestDimensions = sortedDimensions.slice(0, 2);
    
    // Weakest are the bottom 2, excluding any that are already in strongest
    const weakestDimensions = sortedDimensions
        .filter(d => !strongestDimensions.includes(d))
        .reverse()
        .slice(0, 2);

    return {
        totalScore,
        dimensions: normalizedDimensions,
        passed,
        weakestDimensions,
        strongestDimensions
    };
};

export const generateCertificateSVG = (name: string, score: number, date: string, id: string): string => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <!-- Background -->
        <rect width="800" height="600" fill="#eaf5ef" />
        
        <!-- Watermark -->
        <image href="/logo-transparent.png" x="250" y="150" width="300" height="300" opacity="0.15" style="filter: invert(75%) sepia(35%) saturate(700%) hue-rotate(5deg) brightness(95%) contrast(90%);" />

        <!-- Border -->
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="#D4AF37" stroke-width="4" />
        <rect x="30" y="30" width="740" height="540" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
        
        <!-- Inner Glow / Decorative circles -->
        <circle cx="400" cy="300" r="250" fill="none" stroke="#166534" stroke-width="1" opacity="0.1" />
        <circle cx="400" cy="300" r="200" fill="none" stroke="#166534" stroke-width="1" opacity="0.05" />
        
        <!-- Headers -->
        <text x="400" y="100" font-family="serif" font-size="24" fill="#166534" text-anchor="middle" letter-spacing="4">UNDERSTAND LIFE VIA QUIZ</text>
        <text x="400" y="160" font-family="serif" font-size="42" fill="#D4AF37" text-anchor="middle" font-weight="bold">CERTIFICATE OF JUDGMENT</text>
        
        <!-- Body -->
        <text x="400" y="240" font-family="sans-serif" font-size="16" fill="#4b5563" text-anchor="middle">This certifies that</text>
        
        <!-- Name -->
        <text x="400" y="310" font-family="serif" font-size="48" fill="#0a1f0f" text-anchor="middle" font-style="italic">${name}</text>
        <line x1="200" y1="330" x2="600" y2="330" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
        
        <!-- Statement -->
        <text x="400" y="380" font-family="sans-serif" font-size="16" fill="#4b5563" text-anchor="middle">has successfully met the passing standard in the</text>
        <text x="400" y="410" font-family="sans-serif" font-size="16" fill="#4b5563" text-anchor="middle">scenario-based life assessment, demonstrating excellent</text>
        <text x="400" y="440" font-family="sans-serif" font-size="16" fill="#4b5563" text-anchor="middle">judgment, integrity, and emotional balance.</text>
        
        <!-- Score & Details -->
        <text x="200" y="520" font-family="sans-serif" font-size="14" fill="#166534" text-anchor="middle">LIFE SCORE: ${score}/100</text>
        <text x="400" y="520" font-family="sans-serif" font-size="14" fill="#4b5563" text-anchor="middle">DATE: ${date}</text>
        <text x="600" y="520" font-family="sans-serif" font-size="12" fill="#4b5563" text-anchor="middle">ID: ${id}</text>
    </svg>`;
};
