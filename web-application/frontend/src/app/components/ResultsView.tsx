// components/ResultsView.tsx
import { motion } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono'
});

interface ResultsViewProps {
    results: {
        predictions: { label: string; score: number }[];
        filename: string;
    };
    onReset: () => void;
}

export const ResultsView = ({ results, onReset }: ResultsViewProps) => (
    <div className="flex flex-col items-center space-y-12">
        <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 w-full max-w-2xl p-12"
        >
            <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-xl text-white/60 tracking-wider text-center ${geistMono.className}`}
            >
                {results.filename}
            </motion.p>
            {results.predictions.map((result, index) => (
                <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center border-b border-white/10 pb-4"
                >
                    <span className={`text-2xl text-white tracking-wider ${geistMono.className}`}>
                        {result.label}
                    </span>
                    <span className={`text-2xl text-white/60 ${geistMono.className}`}>
                        {(result.score * 100).toFixed(1)}%
                    </span>
                </motion.div>
            ))}
        </motion.div>

        <motion.button
            onClick={onReset}
            className={`text-lg tracking-wider ${geistMono.className} text-white/50`}
        >
            <span className="underline">click</span> to start over_
        </motion.button>
    </div>
);