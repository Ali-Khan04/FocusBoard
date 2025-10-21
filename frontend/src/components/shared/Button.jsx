function Button({ children, onClick, type, className, style }) {
  return (
    <button type={type} onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}

export default Button;
