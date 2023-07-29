import { Entity, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useRef } from 'react';
import BlockOutline from './BlockOutline';
import { IsFocusedFacet, TextFacet } from '../../app/BlockFacets';

interface TextBlockProps {
  blockEntity: Entity;
}

const TextBlock: React.FC<TextBlockProps> = ({ blockEntity }) => {
  const textBlockRef = useRef<HTMLDivElement>(null);
  const [textFacet] = useEntityComponents(blockEntity, TextFacet); // = undifiend
  const block = useEntity(blockEntity);
  const text = (block[0][0] as EntityPropsType)?.props?.text;
  const isFocused = (block[0][4] as EntityPropsType)?.props?.isFocused;


  const handleClickOutside = (event: MouseEvent) => {
    if (textBlockRef.current && isFocused && !textBlockRef.current.contains(event.target as Node)) {
      // blockEntity.addComponent(new IsFocusedFacet({ isFocused: false }));
    }
  };

  const onClick = () => {
    console.log("click")
    blockEntity.addComponent(new IsFocusedFacet({ isFocused: true }));
    console.log(isFocused)
  };

  useEffect(() => {
   if(textBlockRef.current) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
   }
  }, [ textBlockRef]);

  return (
    <div ref={textBlockRef}>
      <BlockOutline
        onClick={onClick}
        blockEntity={blockEntity}
        content={<div>
          {isFocused ? <div >focused: {text}</div> : <p>{text}</p>}
          </div>}
      />
    </div>
  );
};

export default TextBlock;
