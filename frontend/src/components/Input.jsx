function Input({
  type,
  value,
  placeholder,
  id,
  onChange,
  maxLength,
  required,
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      id={id}
      maxLength={maxLength}
      onChange={onChange}
      required={required}
    />
  );
}

export default Input;
