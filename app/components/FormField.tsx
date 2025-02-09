interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  pattern?: string;
  title?: string;
  value?: string;
  onChange?: (event: Event) => void;
}

export default function FormField(props: FormFieldProps) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-300">
        {props.label}
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
      />
    </div>
  );
}
