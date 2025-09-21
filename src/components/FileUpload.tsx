import { useState, useRef, useCallback } from 'react';
import { IconUpload, IconFile, IconX, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  acceptedTypes?: string[];
  acceptedTypeNames?: string[];
  maxSizeInMB?: number;
  className?: string;
  disabled?: boolean;
}

export const FileUpload = ({
  onFileSelect,
  selectedFile,
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  acceptedTypeNames = ['CSV', 'Excel'],
  maxSizeInMB = 10,
  className = '',
  disabled = false,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!acceptedTypes.includes(fileExtension) && !mimeTypes.includes(file.type)) {
      return `Please select a valid ${acceptedTypeNames.join(' or ')} file`;
    }

    return null;
  }, [acceptedTypes, acceptedTypeNames, maxSizeInMB]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver && !disabled
            ? 'border-blue-400 bg-blue-50'
            : selectedFile
            ? 'border-green-300 bg-green-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <IconCheck className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700 flex items-center justify-center gap-2">
                <IconFile className="w-4 h-4" />
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="mt-2"
              disabled={disabled}
            >
              <IconX className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <IconUpload className={`w-8 h-8 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {isDragOver && !disabled
                  ? 'Drop your file here'
                  : 'Click to upload or drag and drop'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {acceptedTypeNames.join(', ')} files up to {maxSizeInMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Instructions */}
      {!selectedFile && !error && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supported formats: {acceptedTypes.join(', ')}</p>
          <p>• Maximum file size: {maxSizeInMB}MB</p>
          <p>• File should contain email addresses in the first column</p>
        </div>
      )}
    </div>
  );
};