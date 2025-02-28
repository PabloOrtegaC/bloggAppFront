import React, { useRef, useEffect } from 'react';

const SimpleWysiwyg = ({ value, onChange, style }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== value) {
      divRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e) => {
    onChange(e.target.innerHTML);
  };

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      style={{
        minHeight: '200px',
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: '#fff',
        ...style
      }}
    />
  );
};

export default SimpleWysiwyg;
