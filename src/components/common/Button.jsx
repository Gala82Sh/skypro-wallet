import React from 'react'; 
 
function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) { 
  const baseStyle = { 
    padding: '10px 16px', 
    fontSize: '14px', 
    fontWeight: '500', 
    borderRadius: '6px', 
    border: 'none', 
    cursor: disabled ? 'not-allowed' : 'pointer', 
    opacity: disabled ? 0.6 : 1, 
  }; 
 
  const variants = { 
    primary: { backgroundColor: '#007bff', color: 'white' }, 
    secondary: { backgroundColor: '#6c757d', color: 'white' }, 
    danger: { backgroundColor: '#dc3545', color: 'white' }, 
  }; 
 
  const style = { ...baseStyle, ...variants[variant] }; 
 
  return ( 
    <button type={type} onClick={onClick} disabled={disabled} style={style}> 
      {children} 
    </button> 
  ); 
} 
 
export default Button; 
