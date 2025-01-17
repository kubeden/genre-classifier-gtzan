// components/ErrorOverlay.tsx
import { motion } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';
import { useEffect, useState } from 'react';

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono'
});

interface ErrorOverlayProps {
    message: string;
    onClose: () => void;
}

export const ErrorOverlay = ({ message, onClose }: ErrorOverlayProps) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        const duration = 10000; // 10 seconds

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

            if (remaining > 0) {
                setProgress(remaining);
                requestAnimationFrame(updateProgress);
            } else {
                onClose();
            }
        };

        const animation = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(animation);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50"
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-8 text-center px-4"
            >
                <p className={`text-2xl text-white/80 tracking-wider ${geistMono.className}`}>
                    {message}_
                </p>

                <div className="w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                        initial={{ width: '100%' }}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};