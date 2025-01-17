// components/InitialView.tsx
import { motion } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono'
});

interface InitialViewProps {
    isRecording: boolean;
    recordingTime: number;
    isDragActive: boolean;
    handleFileClick: (e: React.MouseEvent) => void;
    startRecording: () => void;
    stopRecording: () => void;
}

export const InitialView = ({
    isRecording,
    recordingTime,
    isDragActive,
    handleFileClick,
    startRecording,
    stopRecording
}: InitialViewProps) => (
    <div className="flex flex-col items-center space-y-8 z-10">
        <motion.p
            animate={isDragActive ? {
                scale: 1.05,
                textShadow: '0 0 30px rgba(255,255,255,0.3)'
            } : {
                scale: 1,
                textShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}
            className={`text-6xl tracking-widest select-none ${geistMono.className} ${isRecording ? 'text-black/70' : 'text-white/70'
                }`}
        >
            drop or <span className="underline cursor-pointer" onClick={handleFileClick}>click</span> for mp3_
        </motion.p>

        <motion.div className="flex items-center gap-4">
            <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                className={`text-xl tracking-wider ${geistMono.className} ${isRecording ? 'text-black/50' : 'text-white/50'
                    }`}
            >
                {isRecording ? (
                    `recording... ${30 - recordingTime}s_`
                ) : (
                    <>or <span className="underline">click</span> to record audio_</>
                )}
            </motion.button>
        </motion.div>
    </div>
);