import { forwardRef } from "react";

type InputProps = {
  placeholder?: string;
  value?: string | number;
  title: string;
  type: string;
  className: string;
  name: string;
  autoComplete?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorDiv?: string;
  errorMsg?: string;
};

export const Input = forwardRef(
  (props: InputProps, ref: React.LegacyRef<HTMLInputElement> | undefined) => {
    return (
      <div className="form-control w-full max-w-xs">
        <label htmlFor={props.name} className="label">
          <span className="label-text">{props.title}</span>
        </label>
        <input
          type={props.type}
          className={"input input-bordered w-full max-w-xs " + props.className}
          id={props.name}
          ref={ref}
          name={props.name}
          placeholder={props.placeholder}
          onChange={props.onChange}
          autoComplete={props.autoComplete}
          value={props.value}
        />
        <label className="label">
          <span className={"label-text-alt " + props.errorDiv}>
            {props.errorMsg}
          </span>
        </label>
      </div>
    );
  }
);
