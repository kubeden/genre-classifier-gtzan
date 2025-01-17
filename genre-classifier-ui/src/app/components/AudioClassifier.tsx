'use client';

import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono'
});

const GridBackground = () => (
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

const ProcessingAnimation = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
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

const TypewriterText = ({ texts }) => {
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

const AudioClassifier = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const processingTexts = [
    "Analyzing audio patterns_",
    "Processing frequency spectrum_",
    "Detecting musical signatures_",
    "Applying neural networks_",
    "Computing genre correlations_"
  ];

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
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        processAudio(acceptedFiles[0]);
      }
    },
    noClick: true,
    preventDropOnDocument: true,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    },
    multiple: false
  });

  // Prevent default drag behavior
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('dragenter', preventDefault, false);
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('dragleave', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);

    return () => {
      document.removeEventListener('dragenter', preventDefault);
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('dragleave', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
    >
      <GridBackground />
      {isProcessing && <ProcessingAnimation />}
      
      <div
        {...getRootProps()}
        className="fixed inset-0 flex items-center justify-center"
        onClick={(e) => e.preventDefault()}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center z-10"
            >
              <TypewriterText texts={processingTexts} />
            </motion.div>
          ) : results ? (
            <AnimatePresence mode="wait">
              {isDragActive ? (
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
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 max-w-2xl w-full p-12 z-10"
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
              )}
            </AnimatePresence>
          ) : (
            <motion.div 
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center z-10"
            >
              <motion.p
                animate={isDragActive ? { 
                  scale: 1.05,
                  textShadow: '0 0 30px rgba(255,255,255,0.3)'
                } : { 
                  scale: 1,
                  textShadow: '0 0 20px rgba(255,255,255,0.2)'
                }}
                className={`text-6xl text-white/90 tracking-widest select-none ${geistMono.className}`}
              >
                DROP MP3_
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AudioClassifier;