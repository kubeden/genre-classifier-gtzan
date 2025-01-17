// components/TypewriterText.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono'
});

interface TypewriterTextProps {
    texts: string[];
}

export const TypewriterText = ({ texts }: TypewriterTextProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [texts.length]);

    return (
        <motion.p
            key={currentTextIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-2xl text-white/80 tracking-wider ${geistMono.className}`}
            style={{
                textShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}
        >
            {texts[currentTextIndex]}
        </motion.p>
    );
};