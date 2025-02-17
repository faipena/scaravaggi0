interface FormTextAreaProps {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  value?: string;
  onChange?: (event: Event) => void;
}

function requiredFieldLabel() {
  return <span class="text-red-500">*</span>;
}

export default function FormTextArea(props: FormTextAreaProps) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-300">
        {props.label} {props.required && requiredFieldLabel()}
      </label>
      <textarea
        name={props.name}
        rows={props.rows || 4}
        class="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        required={props.required}
        value={props.value}
        onChange={props.onChange}
        minLength={100} // TODO: FIXME
        maxLength={1500}
      />
    </div>
  );
}
