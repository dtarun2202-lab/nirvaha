import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import BACKEND_CONFIG from '../config/backend';

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
    ? `${BACKEND_CONFIG.API_BASE_URL}${imageSrc}`
    : imageSrc;
  
  return <img src={fullSrc} alt={alt} className={className} />;
};

export default DynamicImage;
