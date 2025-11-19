
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
import { CompassIcon } from './icons/CompassIcon';

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
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-fit dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2 dark:text-slate-100">New Research Project</h2>
            <p className="text-slate-500 dark:text-slate-400">Fill out the details below to generate a qualified market research report.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputField label="Startup Name" name="startupName" value={initialData.startupName} onChange={handleChange} placeholder="e.g. EcoCharge" />
            <InputField label="Target Sector" name="sector" value={initialData.sector} onChange={handleChange} placeholder="e.g. EV Infrastructure" />
        </div>

        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-8">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Strategic Context</h3>
            
            <TextareaField 
                label="Target Audience & Customer Segments" 
                name="targetAudience" 
                value={initialData.targetAudience} 
                onChange={handleChange} 
                placeholder="Who is this product for? (e.g., Urban apartment dwellers, B2B fleet managers, Gen Z consumers)"
                rows={2}
            />
            
            <TextareaField 
                label="Unique Value Proposition" 
                name="valueProposition" 
                value={initialData.valueProposition} 
                onChange={handleChange} 
                placeholder="What makes this startup unique? (e.g., Solar-powered, no-trenching installation, AI-driven optimization)"
                rows={2}
            />
        </div>

        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-8">
             <div className="flex items-center space-x-2 mb-2">
                <CompassIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Qualified Research Scope</h3>
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 -mt-4 mb-4">
                Define the specific parameters for the AI to investigate. These questions determine the depth of the "Scholar-grade" research.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaField 
                    label="1. Market Dynamics & Trends" 
                    name="marketDynamics" 
                    value={initialData.marketDynamics} 
                    onChange={handleChange} 
                    placeholder="What specific market trends, CAGRs, or growth drivers should we validate?"
                    rows={3}
                />
                 <TextareaField 
                    label="2. Competitive Intelligence" 
                    name="competitiveLandscape" 
                    value={initialData.competitiveLandscape} 
                    onChange={handleChange} 
                    placeholder="Who are the direct/indirect competitors? What pricing or features should be compared?"
                    rows={3}
                />
                 <TextareaField 
                    label="3. Consumer Behavior" 
                    name="consumerBehavior" 
                    value={initialData.consumerBehavior} 
                    onChange={handleChange} 
                    placeholder="What assumptions about customer pain points or willingness to pay need verification?"
                    rows={3}
                />
                 <TextareaField 
                    label="4. Regulatory & Supply Chain" 
                    name="regulatoryRisks" 
                    value={initialData.regulatoryRisks} 
                    onChange={handleChange} 
                    placeholder="Are there specific legal frameworks, compliance issues, or supply chain risks to analyze?"
                    rows={3}
                />
             </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
             <FileUploader uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
        </div>
        
        <CheckboxField 
          label="Include Strategic Perspectives"
          description="Adds AI-driven strategic advice, opportunities, and risks based on the provided context."
          checked={includePerspectives}
          onChange={(e) => setIncludePerspectives(e.target.checked)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform hover:-translate-y-0.5 dark:focus:ring-offset-slate-900"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
              Conducting Deep Research...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-1 mr-2 h-6 w-6" />
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
  placeholder?: string;
  rows?: number;
}

const InputField: React.FC < FieldProps > = ({
  label,
  name,
  value,
  onChange,
  placeholder
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
      {label}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white sm:text-sm transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-800 dark:focus:ring-amber-500/50 dark:focus:border-amber-500"
    />
  </div>
);

const TextareaField: React.FC < FieldProps > = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white sm:text-sm resize-y transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-800 dark:focus:ring-amber-500/50 dark:focus:border-amber-500"
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
    <div className="relative flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-800/30 dark:border-slate-700/50">
      <div className="flex h-6 items-center">
        <input
          id="perspectives-checkbox"
          aria-describedby="perspectives-description"
          name="perspectives-checkbox"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 cursor-pointer"
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor="perspectives-checkbox" className="font-semibold text-slate-900 dark:text-slate-200 cursor-pointer">
          {label}
        </label>
        <p id="perspectives-description" className="text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      </div>
    </div>
);


export default InputPanel;
