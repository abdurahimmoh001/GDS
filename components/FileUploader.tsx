
import React, {
  useState,
  useCallback
} from 'react';
import type {
  UploadedFile
} from '../types';
import {
  UploadIcon
} from './icons/UploadIcon';
import {
  DocumentIcon
} from './icons/DocumentIcon';
import {
  XIcon
} from './icons/XIcon';

interface FileUploaderProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch < React.SetStateAction < UploadedFile[] >> ;
}

export const FileUploader: React.FC < FileUploaderProps > = ({
  uploadedFiles,
  setUploadedFiles
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          content: content
        }]);
      }
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", file.name, e);
      // Handle file read error, e.g., show a notification
    };
    reader.readAsText(file);
  };


  const onFileChange = (e: React.ChangeEvent < HTMLInputElement > ) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleFileRead);
    }
  };

  const onDragEnter = (e: React.DragEvent < HTMLLabelElement > ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent < HTMLLabelElement > ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent < HTMLLabelElement > ) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent < HTMLLabelElement > ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(handleFileRead);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };


  return (
    <div>
        <label
          htmlFor="file-upload"
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
            <div className="flex text-sm text-slate-600 dark:text-slate-400">
              <span className="relative bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus:ring-offset-slate-800">
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={onFileChange} />
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">PDF, DOCX, TXT up to 10MB</p>
          </div>
        </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
           <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploaded Documents</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                <div className="flex items-center space-x-2 overflow-hidden">
                    <DocumentIcon className="h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0"/>
                    <span className="text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                </div>
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
