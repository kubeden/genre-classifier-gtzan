// components/AudioClassifier.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { GridBackground } from './GridBackground';
import { ProcessingAnimation } from './ProcessingAnimation';
import { TypewriterText } from './TypewriterText';
import { InitialView } from './InitialView';
import { ResultsView } from './ResultsView';
import { ErrorOverlay } from './ErrorOverlay';
import { DragOverlay } from './DragOverlay';

const AudioClassifier = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef(null);
  const [error, setError] = useState<string | null>(null);

  const processingTexts = [
    "Analyzing audio patterns_",
    "Processing frequency spectrum_",
    "Detecting musical signatures_",
    "Applying neural networks_",
    "Computing genre correlations_"
  ];

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setResults(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        processAudio(file);
        setIsRecording(false);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      processAudio(files[0]);
    }
    event.target.value = '';
  };

  // Update the processAudio function:
  const processAudio = async (file) => {
    setIsProcessing(true);
    setResults(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error('An error occurred while processing your audio.');
        }
      }

      const data = await response.json();
      setResults({
        predictions: data.predictions,
        filename: file.name
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      setError(error.message);
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

  const resetState = () => {
    setResults(null);
    setIsProcessing(false);
    setIsRecording(false);
    setMediaRecorder(null);
    setRecordingTime(0);
  };

  return (
    <motion.div
      className={`fixed inset-0 overflow-hidden transition-colors duration-500 ${isRecording ? 'bg-white' : 'bg-black'
        }`}
      onDragOver={(e) => e.preventDefault()}
    >
      {!isRecording && <GridBackground />}
      {isProcessing && <ProcessingAnimation isRecording={isRecording} />}

      <div
        {...getRootProps()}
        className="fixed inset-0 flex flex-col items-center justify-center"
      >
        <input {...getInputProps()} />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".mp3,.wav"
          className="hidden"
          onClick={e => e.stopPropagation()}
        />

        <AnimatePresence mode="wait">
          {
            error ? (
              <ErrorOverlay
                message={error}
                onClose={() => setError(null)}
              />
            ) : isProcessing ? (
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
              isDragActive ? (
                <DragOverlay />
              ) : (
                <ResultsView
                  results={results}
                  onReset={resetState}
                />
              )
            ) : (
              <InitialView
                isRecording={isRecording}
                recordingTime={recordingTime}
                isDragActive={isDragActive}
                handleFileClick={handleFileClick}
                startRecording={startRecording}
                stopRecording={stopRecording}
              />
            )}
        </AnimatePresence>
      </div>
    </motion.div >
  );
};

export default AudioClassifier;