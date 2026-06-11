import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Award, Sparkles, Trophy } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateImage: string;
  courseTitle: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificateImage,
  courseTitle,
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificateImage;
    link.download = `${courseTitle.replace(/\s+/g, '_')}_Certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-[#09100d]/95 backdrop-blur-2xl rounded-[32px] border border-emerald-500/20 overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.15)] flex flex-col my-auto"
            >
              {/* Decorative Glows */}
              <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 hover:text-emerald-300 transition-colors z-[102]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body */}
              <div className="p-6 md:p-10 flex flex-col items-center text-center">
                {/* Header Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6"
                >
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  Program Completed
                </motion.div>

                {/* Congratulations Message */}
                <motion.h2
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight uppercase tracking-wide font-sans"
                >
                  Congratulations!
                </motion.h2>

                <motion.p
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-emerald-300/80 text-sm md:text-base max-w-2xl mb-8 font-medium leading-relaxed"
                >
                  You have successfully completed all modules and quizzes for <span className="text-white font-extrabold">{courseTitle}</span>. Your official certification of accomplishment is ready.
                </motion.p>

                {/* Certificate Image Preview */}
                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-emerald-950/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group mb-8 aspect-[1.414/1] max-h-[420px]"
                >
                  <img
                    src={certificateImage}
                    alt={`${courseTitle} Certificate`}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
                    <span className="text-xs text-white/90 bg-emerald-900/60 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Official Verification Document
                    </span>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#09100d] font-black text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                  >
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 hover:text-emerald-300 font-black text-sm uppercase tracking-wider transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    Close Preview
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
