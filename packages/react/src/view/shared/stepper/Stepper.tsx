import { Step } from "./Step";
import "./stepper.scss";

export interface StepperProps {
  step: number;
  stepTitle: string;
}

export function Stepper({ step, stepTitle }: StepperProps) {
  return (
    <div className="stepper-container">
      <div className={`steps ${step === 3 ? "completed" : ''}`}>
        <Step active={step >= 1}>1</Step>
        <Step active={step >= 2}>2</Step>
        <Step active={step >= 3}>3</Step>
      </div>
      <span className={`steps-title step-${step}`}>{stepTitle}</span>
    </div>
  );
}
