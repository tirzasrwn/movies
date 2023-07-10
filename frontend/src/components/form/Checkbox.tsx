type CheckboxProps = {
  name: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
  title: string;
  id: string;
};

export const Checkbox = (props: CheckboxProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{props.title}</span>
        <input
          id={props.id}
          className="checkbox"
          type="checkbox"
          value={props.value}
          name={props.name}
          onChange={props.onChange}
          checked={props.checked}
        />
      </label>
    </div>
  );
};
