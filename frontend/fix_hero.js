const fs = require('fs');
const file = 'c:/Users/chara/nirvaha/frontend/src/components/landing/CommunityHero.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('{/* 1. Breathing Image Background */}'));
const endIndex = lines.findIndex(l => l.includes('{/* 7. Hero Content */}'));

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      {/* Background Video */}
      <motion.video
        ref={videoRef}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.2 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/hero_cinematic.mp4" type="video/mp4" />
      </motion.video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

`;
  
  const newLines = [
    ...lines.slice(0, startIndex),
    replacement,
    ...lines.slice(endIndex)
  ];
  
  fs.writeFileSync(file, newLines.join('\n'));
  console.log('Successfully reverted background to video!');
} else {
  console.log('Could not find start or end markers.');
}
