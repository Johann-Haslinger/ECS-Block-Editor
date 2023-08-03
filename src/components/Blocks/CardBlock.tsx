import { Entity } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';

interface CardBlockProps {
  blockEntity: Entity;
}
const CardBlock: React.FC<CardBlockProps> = ({ blockEntity }) => {
  return <BlockOutline blockEntity={blockEntity} content={<div>
    Karte
  </div>} />;
};

export default CardBlock;
