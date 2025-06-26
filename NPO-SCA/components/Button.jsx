function Button({ primary = false, children, ...props }) {
  return (
    <button 
      className={primary ? 'btn-primary' : 'btn-secondary'}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button; 