import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import DecorativeShapes from './DecorativeShapes';
import BACKEND_CONFIG from '../../config/backend';

const defaultPartners = [
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg", url: "https://www.google.com" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg", url: "https://www.microsoft.com" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg", url: "https://www.amazon.com" },
    { name: "Adobe", logo: "https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg", url: "https://www.adobe.com" }
];

const TrustedStats: React.FC = () => {
    const partners = [
        { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg", url: "https://www.google.com" },
        { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg", url: "https://www.microsoft.com" },
        { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg", url: "https://www.amazon.com" },
        { name: "Deloitte", logo: "/deloitte.png", url: "https://www.deloitte.com" }
    ];

    return (
        <section className="w-full bg-[#eaf5ef] pt-10 pb-16 relative z-20 overflow-hidden">
            <DecorativeShapes variant={2} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#2b4c3e] uppercase font-sans border-b border-[#1a5d47]/20 pb-2 drop-shadow-sm">
                        Trusted by professionals at
                    </span>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {partners.map((partner, idx) => (
                        <motion.a
                            key={idx}
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/50 backdrop-blur-md rounded-2xl aspect-[2/1] flex items-center justify-center p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] border border-emerald-100/60 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden cursor-pointer no-underline"
                        >
                            {/* Logo Wrapper */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-500">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className={`max-w-[70%] max-h-[70px] object-contain group-hover:scale-110 transition-transform duration-500 ${partner.name === 'Deloitte' ? 'mix-blend-multiply' : ''}`}
                                />
                            </div>

                            {/* Subtle Fill Hover Effect */}
                            <div className="absolute inset-x-0 bottom-0 h-0 bg-emerald-100/30 transition-all duration-500 group-hover:h-full" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedStats;
