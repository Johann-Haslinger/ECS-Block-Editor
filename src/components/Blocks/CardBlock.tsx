import { Entity, useEntityComponents, useEntityHasTags } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility } from 'react-icons/io5';

import FurtherView from '../FurtherView';
import { ColorFacet, TextFacet, Base64Facet, IconNameFacet, FurtherFacet, ParentFacet, IdentifierFacet } from '@leanscope/ecs-models';
import { StyleTypes, Tags } from '../../base/Constants';
import { StringToIcon } from '../Icons';


interface CardBlockProps {
  blockEntity: Entity;
  blockEditorEntity: Entity;
}
const CardBlock: React.FC<CardBlockProps> = ({ blockEntity, blockEditorEntity }) => {
  const [colorFacet, textFacet] = useEntityComponents(blockEntity, ColorFacet, TextFacet);
  const [base64Facet, iconNameFacet] = useEntityComponents(blockEntity, Base64Facet, IconNameFacet);

  const color = colorFacet?.props.colorName;
  const text = textFacet?.props.text;
  const [isEditing] = useEntityHasTags(blockEditorEntity, Tags.IS_EDITING);
  const src = base64Facet?.props.data;
  const icon = iconNameFacet?.props.iconName;

  return (
    <BlockOutline
    blockEditorEntity={blockEditorEntity}
      blockEntity={blockEntity}
      content={
        <div
          onClick={() => {
            if (!isEditing) {
              blockEntity.addComponent(new FurtherFacet({ isGoingFurther: true }));
              blockEditorEntity.addComponent(
                new ParentFacet({ parentId: blockEntity.get(IdentifierFacet)?.props.guid || '1' }),
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
            {icon && <div className={`mb-2 ${src ? ' opacity-90' : 'opacity-60'}`}>{StringToIcon(icon)}</div>}
            <p className="text-xl   w-2/3 font-semibold ">{text}</p>
          </div>
        </div>
      }
    />
  );
};

export default CardBlock;
