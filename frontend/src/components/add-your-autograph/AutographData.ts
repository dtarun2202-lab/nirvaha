export interface StatementCard {
    id: string;
    category: string;
    text: string;
}

export interface CardTheme {
    id: string;
    name: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    autographColor: string;
    fontFamily: string;
}

export interface SignatureStyle {
    id: string;
    name: string;
    styleObj: React.CSSProperties;
}

export const STATEMENT_CARDS: StatementCard[] = [
    { id: '1', category: 'Knowledge', text: 'Ancient India treated knowledge as a discipline of life.' },
    { id: '2', category: 'Inquiry', text: 'Its legacy survives not only in monuments, but in methods of inquiry.' },
    { id: '3', category: 'Learning', text: 'Mathematics, language, and philosophy were shaped through long traditions of study.' },
    { id: '4', category: 'Mathematics', text: 'The decimal system emerged from a culture that valued precision in thought.' },
    { id: '5', category: 'Architecture', text: 'Architecture was not merely construction — it was applied geometry.' },
    { id: '6', category: 'Language', text: 'Sanskrit preserved knowledge across millennia through disciplined transmission.' },
    { id: '7', category: 'Medicine', text: 'Ancient physicians classified disease, diet, and healing with systematic care.' },
    { id: '8', category: 'Astronomy', text: 'Astronomy was studied not for mysticism, but for agricultural and navigational precision.' },
    { id: '9', category: 'Philosophy', text: 'Logic and debate were formalized disciplines long before modern philosophy.' },
    { id: '10', category: 'Mathematics', text: 'The concept of zero was not an accident — it was a philosophical position.' },
    { id: '11', category: 'Discipline', text: 'Yoga was engineered as a science of the mind long before it became a physical practice.' },
    { id: '12', category: 'Astronomy', text: 'Ancient observatories stood as testaments to humanity\'s drive to map the cosmos.' },
    { id: '13', category: 'Philosophy', text: 'The pursuit of truth required questioning the very nature of existence.' },
    { id: '14', category: 'Medicine', text: 'Ayurveda treated the human body not as a machine, but as an ecosystem.' },
    { id: '15', category: 'Architecture', text: 'Temples were designed as microcosms of the universe, rooted in deep mathematics.' }
];

export const THEMES: CardTheme[] = [
    {
        id: 'dark-temple',
        name: 'Dark Temple Bronze',
        bgColor: '#1A0F00',
        textColor: '#D4A857',
        accentColor: '#8B6914',
        autographColor: '#C4902A',
        fontFamily: 'Georgia, serif'
    },
    {
        id: 'parchment',
        name: 'Parchment Manuscript',
        bgColor: '#F5E6C8',
        textColor: '#2C1810',
        accentColor: '#8B6914',
        autographColor: '#5C3317',
        fontFamily: 'Georgia, serif'
    },
    {
        id: 'emerald',
        name: 'Deep Emerald Heritage',
        bgColor: '#0A1F0A',
        textColor: '#7ABA78',
        accentColor: '#2D5A2D',
        autographColor: '#00FF9C',
        fontFamily: 'Georgia, serif'
    },
    {
        id: 'midnight',
        name: 'Midnight Stone Minimal',
        bgColor: '#0D0D0D',
        textColor: '#E8E8E8',
        accentColor: '#444444',
        autographColor: '#AAAAAA',
        fontFamily: 'Georgia, serif'
    }
];

export const SIGNATURE_STYLES: SignatureStyle[] = [
    {
        id: 'dancing',
        name: 'Dancing Script',
        styleObj: {
            fontFamily: '"Dancing Script", cursive',
            fontSize: '1.2em',
            display: 'inline-block'
        }
    },
    {
        id: 'pacifico',
        name: 'Pacifico',
        styleObj: {
            fontFamily: '"Pacifico", cursive',
            fontSize: '1.1em',
            display: 'inline-block'
        }
    },
    {
        id: 'great-vibes',
        name: 'Great Vibes',
        styleObj: {
            fontFamily: '"Great Vibes", cursive',
            fontSize: '1.4em',
            display: 'inline-block'
        }
    },
    {
        id: 'pinyon',
        name: 'Pinyon Script',
        styleObj: {
            fontFamily: '"Pinyon Script", cursive',
            fontSize: '1.4em',
            display: 'inline-block'
        }
    },
    {
        id: 'ruthie',
        name: 'Ruthie',
        styleObj: {
            fontFamily: '"Ruthie", cursive',
            fontSize: '1.5em',
            display: 'inline-block'
        }
    },
    {
        id: 'meie',
        name: 'Meie Script',
        styleObj: {
            fontFamily: '"Meie Script", cursive',
            fontSize: '1.3em',
            display: 'inline-block'
        }
    },
    {
        id: 'elegant',
        name: 'Elegant Script',
        styleObj: {
            fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
            fontStyle: 'italic',
            textDecoration: 'underline',
            textDecorationStyle: 'solid',
            textDecorationThickness: '2px',
            textUnderlineOffset: '6px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            transform: 'rotate(-2deg)',
            display: 'inline-block'
        }
    },
    {
        id: 'bold',
        name: 'Bold Calligraphy',
        styleObj: {
            fontFamily: 'Impact, "Times New Roman", serif',
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderBottom: '3px solid',
            paddingBottom: '4px',
            transform: 'scaleY(1.1)',
            display: 'inline-block'
        }
    },
    {
        id: 'refined',
        name: 'Refined Italic',
        styleObj: {
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic',
            letterSpacing: '0.5px',
            transform: 'rotate(-2deg)',
            display: 'inline-block'
        }
    },
    {
        id: 'aristocratic',
        name: 'Aristocratic',
        styleObj: {
            fontFamily: '"Garamond", "Baskerville", "Caslon", serif',
            fontStyle: 'italic',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textShadow: '1px 1px 0px rgba(0,0,0,0.2)',
            display: 'inline-block'
        }
    },
    {
        id: 'typewriter',
        name: 'Vintage Typewriter',
        styleObj: {
            fontFamily: '"Courier New", Courier, monospace',
            letterSpacing: '-0.5px',
            fontWeight: 'bold',
            borderBottom: '1px dashed',
            paddingBottom: '2px',
            display: 'inline-block'
        }
    },
    {
        id: 'classic-serif',
        name: 'Classic Palatino',
        styleObj: {
            fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
            fontStyle: 'italic',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            paddingTop: '2px',
            paddingBottom: '2px',
            display: 'inline-block'
        }
    },
    {
        id: 'casual-marker',
        name: 'Casual Ink',
        styleObj: {
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            transform: 'rotate(-4deg)',
            fontWeight: 'bold',
            display: 'inline-block'
        }
    },
    {
        id: 'modern-sans',
        name: 'Modern Minimalist',
        styleObj: {
            fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", sans-serif',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontSize: '0.7em',
            display: 'inline-block'
        }
    }
];
