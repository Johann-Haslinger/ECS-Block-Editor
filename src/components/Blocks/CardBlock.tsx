import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility } from 'react-icons/io5';
import {
  ColorFacet,
  DescriptionFacet,
  FurtherFacet,
  IconFacet,
  IsEditingFacet,
  TextFacet,
} from '../../app/BlockFacets';
import FurtherView from '../FurtherView';
import { StyleTypes } from '../../base/Constants';

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
      content={
        <div
          onClick={() => {
            if (!isEditing) {
              blockEntity.addComponent(new FurtherFacet({ isGoingFurther: true }));
            }
          }}
          className={`  h-40  w-full  ${
            !isEditing && !blockEntity.has(StyleTypes.BLOCK)
              ? ' md:hover:scale-105 transition-all '
              : 'md:hover:scale-95 transition-all'
          }`}
        >
          <div
            style={{ backgroundColor: color }}
            className="p-5   text-white text-4xl  h-40 rounded-lg"
          >
            {blockEntity.get(IconFacet)?.props.icon && (
              <div className='mb-2 opacity-70'>{blockEntity.get(IconFacet)?.props.icon}</div>
            )}
            <p className="text-xl   w-2/3 font-semibold ">{text}</p>
          </div>
        </div>
      }
    />
  );
};

export default CardBlock;
