import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    completed: boolean;
  }>;
}

export default function Breadcrumb({ currentStep, steps }: BreadcrumbProps) {
  return (
    <nav className="mb-8" aria-label="Booking progress">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <a
            href="/"
            className="text-slate-400 hover:text-violet-400 transition-colors"
          >
            Home
          </a>
        </li>
        <ChevronRight className="w-4 h-4 text-slate-500" />
        <li>
          <span className="text-slate-400">Booking</span>
        </li>
        <ChevronRight className="w-4 h-4 text-slate-500" />
        <li>
          <span className="text-white font-medium">
            Step {currentStep}:{" "}
            {steps.find((s) => s.number === currentStep)?.title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
