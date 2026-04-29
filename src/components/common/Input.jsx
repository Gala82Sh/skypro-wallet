import React from 'react'; 
 
function Input({ label, type = 'text', value, onChange, placeholder, error, required = false }) { 
  const inputStyle = { 
    width: '100%%', 
    padding: '10px 12px', 
    fontSize: '16px', 
    border: '1px solid ' + (error ? '#dc3545' : '#ccc'), 
    borderRadius: '6px', 
    outline: 'none', 
    boxSizing: 'border-box', 
  }; 
 
  const labelStyle = { 
    display: 'block', 
    marginBottom: '6px', 
    fontSize: '14px', 
    fontWeight: '500', 
    color: error ? '#dc3545' : '#333', 
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
