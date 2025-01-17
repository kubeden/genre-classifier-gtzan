// components/DragOverlay.tsx
import { motion } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono'
});

export const DragOverlay = () => (
    <motion.div
        key="drag-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-20"
    >
        <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl text-white/80 tracking-wider ${geistMono.className}`}
        >
            Ready to analyze another track_
        </motion.p>
    </motion.div>
);