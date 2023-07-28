import { Entity, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { IsFocusedFacet, TextFacet } from '../../app/BlockFacets';

interface TextBlockProps {
  blockEntity: Entity;
}

const TextBlock: React.FC<TextBlockProps> = ({ blockEntity }) => {
  const [textFacet] = useEntityComponents(blockEntity, TextFacet); // = undifiend
  const block = useEntity(blockEntity);
  const text = (block[0][0] as EntityPropsType)?.props?.text;
  const isFocused = (block[0][4] as EntityPropsType)?.props?.isFocused;

  const onClick = () => {
    console.log('click');
    blockEntity.addComponent(new IsFocusedFacet({ isFocused: true }));
  };
  return (
    <BlockOutline
      onClick={onClick}
      blockEntity={blockEntity}
      content={isFocused ? <div>focused: {text}</div> : <p>{text}</p>}
    />
  );
};

export default TextBlock;
