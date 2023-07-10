type SelectProps = {
  name: string;
  title: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  placeHolder: string;
  options: Option[];
  errorDiv: string;
  errorMsg: string;
};

type Option = {
  id: string;
  value: string;
};

export const Select = (props: SelectProps) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label htmlFor={props.name} className="label">
        <span className="label-text">{props.title}</span>
      </label>
      <select
        className="select select-bordered"
        name={props.name}
        id={props.name}
        value={props.value}
        onChange={props.onChange}
      >
        <option disabled selected value="">
          {props.placeHolder}
        </option>
        {props.options.map((op) => {
          return (
            <option key={op.id} value={op.id}>
              {op.value}
            </option>
          );
        })}
      </select>
      <label className="label">
        <span className={"label-text-alt " + props.errorDiv}>
          {props.errorMsg}
        </span>
      </label>
    </div>
  );
};
