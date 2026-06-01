import React from 'react';
import { useSocket } from '../contexts/SocketContext';

interface DynamicContentProps {
  contentKey: string;
  defaultValue?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ 
  contentKey, 
  defaultValue = '', 
  as: Component = 'span', 
  className = '' 
}) => {
  const { getContent } = useSocket();
  const content = getContent(contentKey, defaultValue);
  
  return <Component className={className}>{content}</Component>;
};

export default DynamicContent;
