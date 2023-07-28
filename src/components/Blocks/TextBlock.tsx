import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { TextFacet } from '../../app/BlockFacets';

interface TextBlockProps {
  blockEntity: Entity;
}

const TextBlock: React.FC<TextBlockProps> = ({ blockEntity }) => {
  const [textFacet] = useEntityComponents(blockEntity, TextFacet); // = undifiend
  const text = blockEntity?.get(TextFacet)?.props.text;

  return <BlockOutline content={<>{text}</>} />;
};

export default TextBlock;
