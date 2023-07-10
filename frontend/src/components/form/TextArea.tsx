type TextAreaProps = {
  name: string;
  title: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeHolder?: string;
  errorDiv: string;
  errorMsg: string;
  rows: number;
};

export const TextArea = (props: TextAreaProps) => {
  return (
    <div className="form-control">
      <label htmlFor={props.name} className="label">
        <span className="label-text">{props.title}</span>
      </label>
      <textarea
        className="textarea textarea-bordered h-24"
        placeholder={props.placeHolder}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        rows={props.rows}
      />
      <label className="label">
        <span className={"label-text-alt " + props.errorDiv}>
          {props.errorMsg}
        </span>
      </label>
    </div>
  );
};
