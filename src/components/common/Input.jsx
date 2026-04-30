import React from 'react'; 
 
function Input({ label, type = 'text', value, onChange, placeholder, error, required = false }) { 
  const inputStyle = { 
    width: '100%',
  height: '39px',
  padding: '12px',
  fontSize: '14px',
  border: '0.5px solid ' + (error ? '#dc3545' : '#999999'),
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Montserrat, sans-serif',
  }; 
 
  const labelStyle = { 
    display: 'block',
  marginBottom: '6px',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '100%',
  letterSpacing: '0px',
  color: error ? '#dc3545' : '#000000',
  }; 
 
  const errorStyle = { 
    marginTop: '4px', 
    fontSize: '12px', 
    color: '#dc3545', 
  }; 
 
  return ( 
    <div style={{ marginBottom: '16px' }}> 
      {label && ( 
        <label style={labelStyle}> 
          {label} {required && <span style={{ color: '#dc3545' }}>*</span>} 
        </label> 
      )} 
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        style={inputStyle} 
      /> 
      {error && <div style={errorStyle}>{error}</div>} 
    </div> 
  ); 
} 
 
export default Input; 
