// components/ProcessingAnimation.tsx
import { motion } from 'framer-motion';

interface ProcessingAnimationProps {
    isRecording: boolean;
}

export const ProcessingAnimation = ({ isRecording }: ProcessingAnimationProps) => (
    <div className="absolute inset-0 overflow-hidden">
        <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${isRecording
                ? 'from-transparent via-black/5 to-transparent'
                : 'from-transparent via-white/5 to-transparent'
                }`}
            animate={{
                x: ['100%', '-100%'],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    </div>
);