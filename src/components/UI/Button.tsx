import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

/**
 * Einfacher Button als wiederverwendbare UI-Komponente.
 */
const Button: React.FC<ButtonProps> = ({ label, ...props }) => (
  <button {...props}>{label}</button>
);

export default Button;
