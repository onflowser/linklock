import "./step.scss";

export interface StepProp {
  active?: boolean;
  completed?: boolean;
  children: any;
}

export function Step({ active, children }: StepProp) {
  return (
    <div className={`circle-wrapper ${active && "active"}`}>
      <div className={`circle`}>{children}</div>
    </div>
  );
}
