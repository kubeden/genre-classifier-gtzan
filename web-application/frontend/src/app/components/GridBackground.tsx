// components/GridBackground.tsx
import { motion } from 'framer-motion';

export const GridBackground = () => (
    <div className="fixed inset-0 opacity-10">
        <svg className="w-full h-full">
            <motion.pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <rect width="40" height="40" fill="none" stroke="white" strokeWidth="0.5" />
            </motion.pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    </div>
);