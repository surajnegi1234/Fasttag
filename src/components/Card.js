import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  ...props 
}) => {
  const cardClass = `card ${hover ? 'card-hover' : ''} card-padding-${padding} ${className}`;

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;