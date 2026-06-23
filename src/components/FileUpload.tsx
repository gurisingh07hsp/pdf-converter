// "use client";

// import { useState, useCallback } from 'react';
// import { FileUp, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// interface FileUploadProps {
//   onUpload: (files: File[]) => void;
//   isProcessing: boolean;
//   acceptedTypes?: string[];
//   maxSizeMB?: number;
//   multiple?: boolean;
//   autoUpload?: boolean; // NEW: when true, skip the "Start Conversion" step
// }

// export default function FileUpload({ 
//   onUpload, 
//   isProcessing, 
//   acceptedTypes = ['.pdf'], 
//   maxSizeMB = 100,
//   multiple = false ,
//   autoUpload = false,
  
// }: FileUploadProps) {
//   const [files, setFiles] = useState<File[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const validateFiles = (newFiles: File[]) => {
//     const validFiles: File[] = [];
//     for (const file of newFiles) {
//       if (file.size > maxSizeMB * 1024 * 1024) {
//         setError(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
//         return;
//       }
//       validFiles.push(file);
//     }
//     setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
//     setError(null);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     if (isProcessing) return;
//     validateFiles(Array.from(e.dataTransfer.files));
//   };

//   const removeFile = (index: number) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleUploadClick = () => {
//     if (files.length > 0) {
//       onUpload(files);
//     }
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto">
//       {/* Dropzone */}
//       <div 
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={handleDrop}
//         className={cn(
//           "border-2 border-dashed rounded-4xl p-12 text-center transition-all group",
//           files.length > 0 ? "border-primary/20 bg-primary/2" : "border-gray-100 bg-white hover:border-primary/20",
//           isProcessing && "opacity-50 cursor-not-allowed"
//         )}
//       >
//         <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
//           <FileUp className="w-8 h-8 text-primary" />
//         </div>
        
//         <input 
//           type="file" 
//           id="file-input" 
//           className="hidden" 
//           multiple={multiple}
//           accept={acceptedTypes.join(',')}
//           onChange={(e) => e.target.files && validateFiles(Array.from(e.target.files))}
//           disabled={isProcessing}
//         />
        
//         <label 
//           htmlFor="file-input"
//           className="cursor-pointer block"
//         >
//           <p className="text-sm font-bold text-gray-500 mb-2">
//             {multiple ? "Choose PDF files" : "Choose a PDF file"} <br />
//             <span className="text-gray-300 font-medium text-xs font-jakarta">or drag and drop it here</span>
//           </p>
//         </label>

//         <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//           Max file size: {maxSizeMB}MB
//         </p>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mt-4 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
//           <AlertCircle className="w-4 h-4" /> {error}
//         </div>
//       )}

//       {/* File List */}
//       {files.length > 0 && (
//         <div className="mt-8 space-y-3">
//           {files.map((file, i) => (
//             <div key={i} className="bg-white border border-border-custom rounded-xl p-4 flex items-center justify-between group">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
//                   <FileUp className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold truncate max-w-50">{file.name}</p>
//                   <p className="text-[10px] text-gray-400 font-bold uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                 </div>
//               </div>
//               {!isProcessing && (
//                 <button onClick={() => removeFile(i)} className="p-2 text-gray-300 hover:text-red-500">
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           ))}

//           <button 
//             onClick={handleUploadClick}
//             disabled={isProcessing}
//             className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" /> Processing...
//               </>
//             ) : (
//               <>
//                 Start Conversion <ArrowRight className="w-5 h-5" />
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // Simple ArrowRight component for the button
// function ArrowRight({ className }: { className?: string }) {
//   return (
//     <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="5" y1="12" x2="19" y2="12"></line>
//       <polyline points="12 5 19 12 12 19"></polyline>
//     </svg>
//   );
// }

"use client";

import { useState, useCallback } from 'react';
import { FileUp, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  isProcessing: boolean;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  autoUpload?: boolean; // NEW: when true, skip the "Start Conversion" step
}

export default function FileUpload({ 
  onUpload, 
  isProcessing, 
  acceptedTypes = ['.pdf'], 
  maxSizeMB = 100,
  multiple = false,
  autoUpload = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
    }
    setError(null);

    if (autoUpload) {
      // Go straight to the preview/options screen, no extra click needed
      onUpload(validFiles);
      return;
    }

    setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    validateFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Dropzone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-4xl p-12 text-center transition-all group",
          files.length > 0 ? "border-primary/20 bg-primary/2" : "border-gray-100 bg-white hover:border-primary/20",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileUp className="w-8 h-8 text-primary" />
        </div>
        
        <input 
          type="file" 
          id="file-input" 
          className="hidden" 
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && validateFiles(Array.from(e.target.files))}
          disabled={isProcessing}
        />
        
        <label 
          htmlFor="file-input"
          className="cursor-pointer block"
        >
          <p className="text-sm font-bold text-gray-500 mb-2">
            {multiple ? "Choose PDF files" : "Choose a PDF file"} <br />
            <span className="text-gray-300 font-medium text-xs font-jakarta">or drag and drop it here</span>
          </p>
        </label>

        <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Max file size: {maxSizeMB}MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* File List — only shown when autoUpload is off */}
      {!autoUpload && files.length > 0 && (
        <div className="mt-8 space-y-3">
          {files.map((file, i) => (
            <div key={i} className="bg-white border border-border-custom rounded-xl p-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-50">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              {!isProcessing && (
                <button onClick={() => removeFile(i)} className="p-2 text-gray-300 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button 
            onClick={handleUploadClick}
            disabled={isProcessing}
            className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                Start Conversion <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Simple ArrowRight component for the button
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
