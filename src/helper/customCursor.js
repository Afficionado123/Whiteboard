// CustomCursor.js

import React from 'react';

const CustomCursor = ({ color, text }) => {
  const cursorStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    transform: `translate(-50%, -50%)`,
  };

  const textStyles = {
    fontSize: '14px',
    color: color,
    userSelect: 'none',
  };

  return (
    <div style={cursorStyle}>
      <div style={textStyles}>{text}</div>
      <svg
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="5" fill={color} />
      </svg>
    </div>
  );
};

export default CustomCursor;
