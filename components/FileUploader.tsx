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
          className={`group mt-1 flex justify-center px-6 pt-6 pb-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
            ${isDragging 
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500' 
                : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-amber-500/50 dark:hover:bg-slate-800/50'}`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <UploadIcon className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
              <span className="relative rounded-md font-semibold text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500 dark:text-amber-500 dark:hover:text-amber-400 dark:focus:ring-offset-slate-800">
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={onFileChange} />
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">PDF, DOCX, TXT up to 10MB</p>
            <p className="text-xs font-medium text-amber-600/80 dark:text-amber-500/80 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md inline-block">
                Auto-translation & web search enabled
            </p>
          </div>
        </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
           <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Attached Documents</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 p-3 rounded-xl transition-all hover:shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                        <DocumentIcon className="h-5 w-5 text-amber-500 flex-shrink-0"/>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</span>
                </div>
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-700 dark:hover:text-red-400 transition-colors"
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