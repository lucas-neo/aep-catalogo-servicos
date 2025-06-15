"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // em MB
  preview?: string;
  loading?: boolean;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  preview,
  loading = false,
  onRemove,
  className,
  disabled = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClick = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return;
    }

    // Validar tipo
    if (accept === "image/*" && !file.type.startsWith('image/')) {
      alert('Apenas imagens são permitidas');
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || loading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || loading}
      />

      {/* Preview da imagem */}
      {preview && (
        <div className="mb-4 relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
          />
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemove}
              disabled={loading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Área de upload */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          {
            "border-blue-400 bg-blue-50": dragActive && !disabled,
            "border-gray-300 hover:border-gray-400": !dragActive && !disabled && !loading,
            "border-gray-200 bg-gray-50 cursor-not-allowed": disabled || loading,
          }
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Enviando...</p>
            </>
          ) : (
            <>
              {accept === "image/*" ? (
                <Image className="h-8 w-8 text-gray-400" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Clique para enviar
                </span>{" "}
                ou arraste e solte
              </div>
              <p className="text-xs text-gray-500">
                {accept === "image/*" ? "PNG, JPG, GIF" : "Todos os tipos"} até {maxSize}MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
