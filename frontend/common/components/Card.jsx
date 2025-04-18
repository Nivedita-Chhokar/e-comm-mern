// common/components/Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({
  title,
  content,
  image,
  footer,
  onClick,
  linkTo,
  className,
  shadow = true,
  hoverable = true,
}) => {
  const cardClasses = `
    bg-white rounded-lg overflow-hidden
    ${shadow ? 'shadow-md' : ''}
    ${hoverable ? 'transition duration-300 hover:shadow-lg' : ''}
    ${className || ''}
  `;

  const CardContent = () => (
    <div className={cardClasses}>
      {/* Card Image */}
      {image && (
        <div className="h-48 w-full overflow-hidden">
          {typeof image === 'string' ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            image
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        )}
        {content && (
          <div className="text-gray-600">
            {content}
          </div>
        )}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );

  // If linkTo is provided, wrap with Link
  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <CardContent />
      </Link>
    );
  }

  // If onClick is provided, make it clickable
  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <CardContent />
      </div>
    );
  }

  // Otherwise, render as a static card
  return <CardContent />;
};

export default Card;