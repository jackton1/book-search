const FormInput = ({ id, name, type, placeholder, label, autoComplete }: {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  label: string;
    autoComplete?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-xs text-gray-600 uppercase">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required
      autoComplete={autoComplete ? "on" : "off"}
      className="mt-1 text-gray-500 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
    />
  </div>
);

export default FormInput;
