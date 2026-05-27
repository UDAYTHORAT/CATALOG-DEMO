'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  defaultImage?: string | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ onUploadComplete, defaultImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setPreview(defaultImage || null);
  }, [defaultImage]);

  useEffect(() => {
    isMountedRef.current = true;
    setMounted(true);
    return () => {
      isMountedRef.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, []);

  const processFile = async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const msg = 'Only image files are accepted';
      setError(msg);
      alert(msg);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const msg = 'File must be under 5MB';
      setError(msg);
      alert(msg);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress (Supabase doesn't provide upload progress natively)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        return;
      }
      setUploadProgress((prev) => {
        if (prev >= 85) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          return 85;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      if (isMountedRef.current) {
        setUploadProgress(100);
      }

      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      completionTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setPreview(publicUrl);
        onUploadComplete(publicUrl);
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      console.error('Error uploading image:', err);
      if (isMountedRef.current) {
        const msg = 'Upload failed. Please try again.';
        setError(msg);
        alert(msg);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    onUploadComplete('');
    setError(null);
  };

  return (
    <div className="w-full">
      {error && mounted && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed top-6 left-1/2 z-[99999] w-[calc(100%-32px)] max-w-sm bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in fade-in"
          style={{
            transform: 'translateX(-50%)',
            animation: 'fadeInDown 0.3s ease-out forwards',
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fadeInDown {
              from { opacity: 0; transform: translate(-50%, -10px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}} />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-wider text-red-800">Upload Warning</p>
            <p className="text-[11px] font-semibold text-red-600/90 mt-0.5">{error}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setError(null)} 
            className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-700 bg-red-100/50 hover:bg-red-100 px-2 py-1 rounded-lg shrink-0"
          >
            Close
          </button>
        </div>,
        document.body
      )}

      {preview ? (
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
          <img 
            src={preview} 
            alt="Product preview" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[2px] flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`relative w-full aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group overflow-hidden ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
              : isUploading
              ? 'border-indigo-300 bg-indigo-50/50'
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {error && (
            <div className="absolute top-3 left-3 right-3 bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-100 text-center z-10">
              {error}
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-4 px-4 w-full">
              <Loader2 className="animate-spin text-indigo-500" size={28} />
              <div className="w-full max-w-[140px]">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-indigo-500 text-center mt-2">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-300 group-hover:text-indigo-500 transition-all duration-300">
              {isDragOver ? (
                <ImageIcon size={28} className="text-indigo-500" />
              ) : (
                <Upload size={24} />
              )}
              <div className="text-center px-4">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  {isDragOver ? 'Drop to upload' : 'Click or drag image'}
                </span>
                <span className="text-[10px] text-slate-400">
                  PNG, JPG up to 5MB
                </span>
              </div>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
