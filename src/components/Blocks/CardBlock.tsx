import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility } from 'react-icons/io5';
import {
  ColorFacet,
  DescriptionFacet,
  FurtherFacet,
  IconFacet,
  IdFacet,
  IsEditingFacet,
  ParentFacet,
  SrcFacet,
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
  const [srcFacet, iconFacet] = useEntityComponents(blockEntity, SrcFacet, IconFacet);

  const color = colorFacet.props.color;
  const text = textFacet.props.text;
  const isEditing = blockEditorEntity?.get(IsEditingFacet)?.props.isEditing;
  const src = srcFacet.props.src;
  const icon = iconFacet.props.icon;

  return (
    <BlockOutline
      blockEntity={blockEntity}
      content={
        <div
          onClick={() => {
            if (!isEditing) {
              blockEntity.addComponent(new FurtherFacet({ isGoingFurther: true }));
              blockEditorEntity.addComponent(
                new ParentFacet({ parentId: blockEntity.get(IdFacet)?.props.id || '1' }),
              );
            }
          }}
          className={`  h-40  w-full  ${
            !isEditing && !blockEntity.has(StyleTypes.BLOCK)
              ? ' md:hover:scale-105 transition-all '
              : 'md:hover:scale-95 transition-all'
          }`}
        >
          <div
            style={{
              backgroundColor: color,
              backgroundImage:
                src && `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${src})`,
              backgroundSize: 'cover',
            }}
            className="p-5  opacity-80  text-white text-4xl  h-40 rounded-lg"
          >
            {icon && <div className={`mb-2 ${src ? ' opacity-90' : 'opacity-60'}`}>{icon}</div>}
            <p className="text-xl   w-2/3 font-semibold ">{text}</p>
          </div>
        </div>
      }
    />
  );
};

export default CardBlock;
