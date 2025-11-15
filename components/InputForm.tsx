import React from 'react';
import type {
  ResearchInputData,
  UploadedFile
} from '../types';
import {
  LoaderIcon
} from './icons/LoaderIcon';
import {
  FileUploader
} from './FileUploader';
import {
  SparklesIcon
} from './icons/SparklesIcon';

interface InputPanelProps {
  initialData: ResearchInputData;
  setResearchData: React.Dispatch < React.SetStateAction < ResearchInputData >> ;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch < React.SetStateAction < UploadedFile[] >> ;
  onGenerate: (data: ResearchInputData, files: UploadedFile[]) => void;
  isLoading: boolean;
  includePerspectives: boolean;
  setIncludePerspectives: React.Dispatch < React.SetStateAction < boolean >> ;
}

const InputPanel: React.FC < InputPanelProps > = ({
  initialData,
  setResearchData,
  uploadedFiles,
  setUploadedFiles,
  onGenerate,
  isLoading,
  includePerspectives,
  setIncludePerspectives
}) => {
  const handleChange = (e: React.ChangeEvent < HTMLInputElement | HTMLTextAreaElement > ) => {
    const {
      name,
      value
    } = e.target;
    setResearchData(prev => ({ ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(initialData, uploadedFiles);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 h-fit dark:bg-slate-800 dark:border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 dark:text-slate-200">Research Brief</h2>
            <p className="text-slate-500 dark:text-slate-400">Define your research scope and upload relevant documents.</p>
        </div>

        <div className="space-y-4">
          <InputField label="Startup Name" name="startupName" value={initialData.startupName} onChange={handleChange} />
          <InputField label="Target Sector" name="sector" value={initialData.sector} onChange={handleChange} />
          <TextareaField label="Research Objective" name="objective" value={initialData.objective} onChange={handleChange} />
        </div>

        <FileUploader uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

        <CheckboxField 
          label="Include Strategic Perspectives"
          description="Adds AI-driven strategic advice, opportunities, and risks."
          checked={includePerspectives}
          onChange={(e) => setIncludePerspectives(e.target.checked)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 dark:focus:ring-offset-slate-800"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating Report...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
              Generate Research Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Sub-components for form fields
interface FieldProps {
  label: string;
  name: keyof ResearchInputData;
  value: string;
  onChange: (e: React.ChangeEvent < HTMLInputElement | HTMLTextAreaElement > ) => void;
}

const InputField: React.FC < FieldProps > = ({
  label,
  name,
  value,
  onChange
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
      {label}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
);

const TextareaField: React.FC < FieldProps > = ({
  label,
  name,
  value,
  onChange
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={4}
      value={value}
      onChange={onChange}
      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
);

interface CheckboxProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent < HTMLInputElement > ) => void;
}

const CheckboxField: React.FC<CheckboxProps> = ({ label, description, checked, onChange }) => (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id="perspectives-checkbox"
          aria-describedby="perspectives-description"
          name="perspectives-checkbox"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800"
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor="perspectives-checkbox" className="font-medium text-slate-900 dark:text-slate-200">
          {label}
        </label>
        <p id="perspectives-description" className="text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
);


export default InputPanel;