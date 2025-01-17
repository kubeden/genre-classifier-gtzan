// AudioDropZone.jsx
'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WaveAnimation = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-gray-300/30 opacity-40"
        initial={{ width: "100%", height: "100%" }}
        animate={{
          width: ["100%", "150%"],
          height: ["100%", "150%"],
          opacity: [0.4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

const AudioDropZone = ({ isProcessing, currentSong, onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    },
    multiple: false
  });

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div
        {...getRootProps()}
        className={`
          relative
          w-80 h-80
          flex flex-col items-center justify-center
          rounded-full
          backdrop-blur-xl
          bg-white/10
          shadow-2xl
          transition-all duration-500 ease-in-out
          cursor-pointer
          border border-white/20
          overflow-hidden
          ${isDragActive ? 'scale-105 bg-white/20' : ''}
          ${isProcessing ? 'bg-white/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing && <WaveAnimation />}
        
        {isProcessing ? (
          <>
            <LoaderCircle className="w-16 h-16 text-gray-300 animate-spin" />
            <p className="mt-4 text-sm text-gray-300 font-medium">Processing...</p>
            {currentSong && (
              <p className="text-xs text-gray-400 mt-2 max-w-[200px] truncate">
                {currentSong}
              </p>
            )}
          </>
        ) : (
          <>
            <Music className={`w-16 h-16 ${isDragActive ? 'text-gray-200' : 'text-gray-300'}`} />
            <p className="mt-4 text-sm text-gray-300">
              Drop your MP3 here
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Results.jsx
const Results = ({ results }) => {
  if (!results) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-8 right-8 w-96 backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20"
    >
      <p className="text-sm text-gray-200 mb-4 text-center truncate">
        {results.filename}
      </p>
      <div className="space-y-3">
        {results.predictions.map((result, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <span className="text-gray-200">{result.label}</span>
            <span className="text-gray-300">{(result.score * 100).toFixed(1)}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// AudioClassifier.jsx
const AudioClassifier = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);

  const processAudio = async (file) => {
    setIsProcessing(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResults({
        predictions: data.predictions,
        filename: file.name
      });
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
      setCurrentSong(null);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setCurrentSong(file.name);
      processAudio(file);
    }
  }, []);

  return (
    <>
      <AudioDropZone 
        isProcessing={isProcessing}
        currentSong={currentSong}
        onDrop={onDrop}
      />
      <AnimatePresence>
        {results && <Results results={results} />}
      </AnimatePresence>
    </>
  );
};

export default AudioClassifier;