import React, { ReactNode } from 'react';

interface BlockOutlineProps {
  content: ReactNode;
}

const BlockOutline: React.FC<BlockOutlineProps> = ({ content }) => {
  return <div>{content}</div>;
};

export default BlockOutline;
