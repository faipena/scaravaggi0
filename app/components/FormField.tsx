interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  pattern?: string;
  title?: string;
  value?: string;
  hidden?: boolean;
  onChange?: (event: Event) => void;
}

function requiredFieldLabel() {
  return <span class="text-red-500">*</span>;
}

export default function FormField(props: FormFieldProps) {
  const style = props.hidden ? "display: none" : undefined;
  return (
    <div style={style}>
      <label class="block text-sm font-medium text-gray-300">
        {props.label} {props.required && requiredFieldLabel()}
      </label>
      <input
        type={props.type}
        name={props.name}
        class="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        required={props.required}
        pattern={props.pattern}
        title={props.title}
        value={props.value}
        onChange={props.onChange}
        maxLength={100} // TODO: FIXME
      />
    </div>
  );
}
