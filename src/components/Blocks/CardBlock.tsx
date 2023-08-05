import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility } from 'react-icons/io5';
import {
  ColorFacet,
  DescriptionFacet,
  FurtherFacet,
  IsEditingFacet,
  TextFacet,
} from '../../app/BlockFacets';
import FurtherView from '../FurtherView';

interface CardBlockProps {
  blockEntity: Entity;
  blockEditorEntity: Entity;
}
const CardBlock: React.FC<CardBlockProps> = ({ blockEntity, blockEditorEntity }) => {
  const [colorFacet, textFacet] = useEntityComponents(blockEntity, ColorFacet, TextFacet);

  const color = colorFacet.props.color;
  const text = textFacet.props.text;
  const isEditing = blockEditorEntity?.get(IsEditingFacet)?.props.isEditing;
  
  return (
    <BlockOutline
      blockEntity={blockEntity}
      onClick={()=>   blockEntity.addComponent(new FurtherFacet({ isGoingFurther: true }))}
      content={
        <div
          className={` h-32  w-full  ${!isEditing ? ' md:hover:scale-105 transition-all ' : ''}`}
        >
          <div
            style={{ backgroundColor: color }}
            className="p-5  opacity-60 text-white text-4xl h-32 rounded-lg"
          >
            <p className="text-lg   w-2/3 font-semibold ">{text}</p>
          </div>
        </div>
      }
    />
  );
};

export default CardBlock;
