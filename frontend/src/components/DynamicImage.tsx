import React from 'react';
import { useSocket } from '../contexts/SocketContext';

interface DynamicImageProps {
  contentKey: string;
  defaultSrc?: string;
  alt?: string;
  className?: string;
}

const DynamicImage: React.FC<DynamicImageProps> = ({ 
  contentKey, 
  defaultSrc = '', 
  alt = '', 
  className = '' 
}) => {
  const { getContent } = useSocket();
  const imageSrc = getContent(contentKey, defaultSrc);
  
  const fullSrc = imageSrc.startsWith('/uploads') 
    ? `http://localhost:5000${imageSrc}`
    : imageSrc;
  
  return <img src={fullSrc} alt={alt} className={className} />;
};

export default DynamicImage;
