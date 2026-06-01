import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, ChevronRight, Check } from 'lucide-react';
import { 
    STATEMENT_CARDS, 
    THEMES, 
    SIGNATURE_STYLES, 
    StatementCard, 
    CardTheme, 
    SignatureStyle 
} from './AutographData';

export const AutographApp = () => {
    const [name, setName] = useState('');
    const [selectedCard, setSelectedCard] = useState<StatementCard>(STATEMENT_CARDS[0]);
    const [selectedTheme, setSelectedTheme] = useState<CardTheme>(THEMES[0]);
    const [selectedStyle, setSelectedStyle] = useState<SignatureStyle>(SIGNATURE_STYLES[0]);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        
        try {
            setIsDownloading(true);
            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // High resolution
                backgroundColor: selectedTheme.bgColor,
                logging: false,
                useCORS: true
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `Autograph_${name || 'Card'}.png`;
            link.click();
        } catch (error) {
            console.error('Failed to download image:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full bg-[#080808] text-gray-200 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl font-sans flex flex-col min-h-[900px]">
            
            {/* Top Panel: Live Preview */}
            <div className="w-full bg-[#111] flex flex-col relative min-h-[600px] border-b border-gray-800">
                
                {/* Preview Header / Download button */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-serif text-white tracking-wide mb-1">Add Your Autograph</h1>
                        <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Live Preview</span>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#FDE047] transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {isDownloading ? 'Generating...' : 'Download Card'} <Download className="w-4 h-4" />
                    </button>
                </div>

                {/* Card Container */}
                <div className="flex-1 flex items-center justify-center p-8 pt-28 overflow-auto">
                    
                    {/* The Actual Rendered Card */}
                    <div 
                        ref={cardRef}
                        className="w-full max-w-4xl aspect-[4/3] rounded-sm p-14 sm:p-20 flex flex-col justify-between relative transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        style={{ 
                            backgroundColor: selectedTheme.bgColor,
                            color: selectedTheme.textColor,
                            fontFamily: selectedTheme.fontFamily,
                            border: `1px solid ${selectedTheme.accentColor}40` // 40 is hex opacity for 25%
                        }}
                    >
                        {/* Inner Border Accent */}
                        <div 
                            className="absolute inset-5 border opacity-30 pointer-events-none"
                            style={{ borderColor: selectedTheme.accentColor }}
                        />

                        {/* Top: Category Label */}
                        <div 
                            className="text-sm uppercase tracking-[0.4em] font-sans font-bold opacity-80"
                            style={{ color: selectedTheme.accentColor }}
                        >
                            {selectedCard.category}
                        </div>

                        {/* Center: Main Statement */}
                        <div className="text-4xl sm:text-5xl lg:text-6xl leading-[1.2] font-medium my-16 text-balance">
                            "{selectedCard.text}"
                        </div>

                        {/* Bottom: Autograph & Branding */}
                        <div className="flex justify-between items-end relative z-10">
                            {/* App Branding */}
                            <div className="font-sans text-xs tracking-[0.3em] uppercase opacity-40">
                                Nirvaha Heritage Collection
                            </div>
                            
                            {/* Autograph */}
                            <div 
                                className="text-4xl sm:text-5xl lg:text-6xl transition-all duration-300"
                                style={{ 
                                    color: selectedTheme.autographColor,
                                    ...selectedStyle.styleObj
                                }}
                            >
                                {name.trim() || 'Your Signature'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Panel: Controls */}
            <div className="w-full bg-[#0A0A0A] p-8 lg:p-12">
                <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-8 text-center">Customize Your Card</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    
                    {/* Column 1: Name & Theme */}
                    <div className="space-y-8">
                        <section>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                1. Your Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Type your name here..."
                                className="w-full bg-gray-900 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-lg shadow-inner"
                            />
                        </section>

                        <section>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                2. Card Theme
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={`
                                            px-4 py-4 rounded-xl border transition-all text-sm font-medium text-center
                                            ${selectedTheme.id === theme.id 
                                                ? 'border-white ring-2 ring-white/30 scale-[1.02] shadow-lg' 
                                                : 'border-transparent hover:border-gray-600 hover:scale-[1.01]'
                                            }
                                        `}
                                        style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Column 2: Signature Style */}
                    <section>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            3. Signature Style
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {SIGNATURE_STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`
                                        text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between
                                        ${selectedStyle.id === style.id 
                                            ? 'bg-gray-800 border-[#D4AF37] text-white shadow-md' 
                                            : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-900'
                                        }
                                    `}
                                >
                                    <span className="text-base" style={style.styleObj}>{style.name}</span>
                                    {selectedStyle.id === style.id && <Check className="w-5 h-5 text-[#D4AF37]" />}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Column 3: Select Statement */}
                    <section>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            4. Statement Content
                        </label>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {STATEMENT_CARDS.map(card => (
                                <button
                                    key={card.id}
                                    onClick={() => setSelectedCard(card)}
                                    className={`
                                        w-full text-left p-5 rounded-xl border transition-all
                                        ${selectedCard.id === card.id
                                            ? 'bg-gray-800 border-[#D4AF37] text-white shadow-md'
                                            : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-900'
                                        }
                                    `}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-2">
                                        {card.category}
                                    </span>
                                    <p className="text-sm leading-relaxed">{card.text}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
