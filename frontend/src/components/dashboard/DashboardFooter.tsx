import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const iconClass = "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-100/60 hover:bg-[#1a5d47] hover:text-white transition-all duration-300 hover:-translate-y-1";

const platformLinks: { label: string; to: string }[] = [
    { label: 'Meditation',    to: '/dashboard/meditation' },
    { label: 'Sound Healing', to: '/dashboard/sound'      },
    { label: 'AI Companion',  to: '/dashboard/companion'  },
    { label: 'Community',     to: '/dashboard/community'  },
];

const companyLinks: { label: string; to: string }[] = [
    { label: 'Our Story',    to: '/'          },
    { label: 'Careers',      to: '/'          },
    { label: 'Case Studies', to: '/stories'   },
    { label: 'Contact',      to: '/'          },
];

export const DashboardFooter = () => {
    return (
        <footer className="bg-[#0B2E24] pt-8 pb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">

                    {/* Brand */}
                    <div>
                        <Link to="/dashboard/overview" className="flex items-center gap-4 mb-8 no-underline">
                            <img src="/logo.png" alt="Nirvaha" className="w-16 h-16 object-contain" />
                            <span className="text-2xl font-bold text-white tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                                NIRVAHA
                            </span>
                        </Link>
                        <p className="text-emerald-100/60 text-sm leading-relaxed mb-8 max-w-xs">
                            Bridging ancient wisdom and modern science to create a digital sanctuary for the modern mind.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="LinkedIn">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://wa.me/917780754541" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="WhatsApp">
                                <WhatsAppIcon />
                            </a>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-8 uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-4">
                            {platformLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-emerald-100/50 hover:text-white transition-colors flex items-center gap-2 group no-underline"
                                    >
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-8 uppercase tracking-widest">Company</h4>
                        <ul className="space-y-4">
                            {companyLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-emerald-100/50 hover:text-white transition-colors flex items-center gap-2 group no-underline"
                                    >
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-emerald-100/30 text-xs tracking-widest uppercase">
                        © 2026 Nirvaha Inc. Crafted with Peace.
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-emerald-100/30 uppercase">
                        <Link to="/privacy" className="hover:text-white transition-colors no-underline">Privacy Policy</Link>
                        <Link to="/terms"   className="hover:text-white transition-colors no-underline">Terms of Service</Link>
                        <span className="hover:text-white transition-colors cursor-pointer">Cookie Settings</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
