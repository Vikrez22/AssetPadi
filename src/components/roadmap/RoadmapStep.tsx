import { useState } from 'react';
import { RoadmapStep as StepType } from '../../types';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface RoadmapStepProps {
  step: StepType;
  index: number;
}

export default function RoadmapStep({ step, index }: RoadmapStepProps) {
  const [completed, setCompleted] = useState(false);

  return (
    <div
      className={`glass-panel rounded-3xl p-6 mb-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg dark:hover:shadow-brand-purple/5 ${
        completed ? 'border-brand-success/30 dark:border-brand-success/30 bg-brand-success/5 dark:bg-brand-success/5' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Step Indicator */}
        <div
          onClick={() => setCompleted(!completed)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 ${
            completed 
              ? 'bg-brand-success text-white' 
              : 'bg-gradient-to-br from-brand-teal to-cyan-600 dark:from-brand-purple dark:to-indigo-600 text-white shadow-sm'
          } hover:scale-105 active:scale-95`}
        >
          {completed ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <span className="font-bold text-[16px]">{index + 1}</span>
          )}
        </div>

        {/* Step Details */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3
              onClick={() => setCompleted(!completed)}
              className={`text-lg font-bold cursor-pointer transition-colors duration-200 ${
                completed 
                  ? 'line-through text-brand-muted dark:text-brand-darkMuted' 
                  : 'text-brand-dark dark:text-brand-darkText'
              }`}
            >
              {step.title}
            </h3>
            
            {/* Institution Badge */}
            <span className="text-[11px] font-semibold tracking-wide uppercase text-brand-teal dark:text-brand-purple bg-brand-tealLight dark:bg-brand-purple/10 px-3 py-1 rounded-xl self-start sm:self-center border border-brand-teal/10 dark:border-brand-purple/10">
              {step.institution}
            </span>
          </div>

          <p className={`text-[15px] leading-relaxed mb-5 ${completed ? 'text-brand-muted dark:text-brand-darkMuted' : 'text-gray-600 dark:text-gray-300'}`}>
            {step.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200/50 dark:border-white/5">
            {/* Cost and Time Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-brand-yellow/10 dark:bg-brand-gold/10 text-brand-yellow text-xs font-bold px-3 py-1.5 rounded-xl border border-brand-yellow/20">
                Cost: {step.estimatedCost}
              </span>
              <span className="bg-gray-100 dark:bg-white/5 text-brand-dark dark:text-brand-darkText text-xs font-bold px-3 py-1.5 rounded-xl">
                Time: {step.estimatedTime}
              </span>
            </div>

            {/* Link to Institution */}
            {step.institutionUrl && (
              <a
                href={step.institutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-teal dark:text-brand-purple hover:underline text-sm font-bold cursor-pointer"
              >
                Go to Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
