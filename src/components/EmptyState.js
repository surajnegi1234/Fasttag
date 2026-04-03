import React from 'react';
import Card from './Card';
import Button from './Button';
import './EmptyState.css';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  actionText, 
  onAction,
  actionVariant = 'primary' 
}) => {
  return (
    <Card className="empty-state">
      <div className="empty-content">
        <div className="empty-icon">
          <Icon />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        {actionText && onAction && (
          <Button variant={actionVariant} onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;