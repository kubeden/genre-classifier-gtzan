// types/index.ts
export interface Prediction {
    label: string;
    score: number;
  }
  
  export interface Results {
    predictions: Prediction[];
    filename: string;
  }
  
  export interface AudioClassifierState {
    isProcessing: boolean;
    results: Results | null;
    isRecording: boolean;
    recordingTime: number;
    error: string | null;
  }
  
  export interface ProcessingAnimationProps {
    isRecording: boolean;
  }
  
  export interface TypewriterTextProps {
    texts: string[];
  }
  
  export interface InitialViewProps {
    isRecording: boolean;
    recordingTime: number;
    isDragActive: boolean;
    handleFileClick: (e: React.MouseEvent) => void;
    startRecording: () => void;
    stopRecording: () => void;
  }
  
  export interface ResultsViewProps {
    results: Results;
    onReset: () => void;
  }
  
  export interface ErrorOverlayProps {
    message: string;
    onClose: () => void;
  }
  
  export interface DragOverlayProps {
    // Empty for now, but we might want to add customization options later
  }
  
  export type MediaRecorderState = MediaRecorder | null;