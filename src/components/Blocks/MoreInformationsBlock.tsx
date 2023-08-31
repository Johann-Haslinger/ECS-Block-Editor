import { Entity, useEntities, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useRef, useState } from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility, IoChevronForward, IoCode } from 'react-icons/io5';
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
import { StyleTypes, Tags } from '../../base/Constants';
import FurtherView from '../FurtherView';

interface MoreInformationsBlockProps {
  blockEntity: Entity;
  blockEditorEntity: Entity;
}
const MoreInformationsBlock: React.FC<MoreInformationsBlockProps> = ({
  blockEntity,
  blockEditorEntity,
}) => {
  const [descriptionFacet, textFacet] = useEntityComponents(
    blockEntity,
    DescriptionFacet,
    TextFacet,
  );
  const [iconFacet, colorFacet] = useEntityComponents(blockEntity, IconFacet, ColorFacet);
  const [srcFacet] = useEntityComponents(blockEntity, SrcFacet, IconFacet);
  const description = descriptionFacet.props.description;
  const text = textFacet.props.text;
  const icon = iconFacet.props.icon;
  const color = colorFacet.props.color;
  const src = srcFacet.props.src;
  const isEditing = blockEditorEntity?.get(IsEditingFacet)?.props.isEditing;
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const contentEditableHeaderRef = useRef<HTMLDivElement>(null);

  const handleDescriptionBlur = () => {
    if (contentEditableRef.current) {
      const htmlText = contentEditableRef.current.innerHTML;
      // Save the final content here or perform any other operations you need
      blockEntity.addComponent(new DescriptionFacet({ description: htmlText }));
    }
  };

  const handleHeaderBlur = () => {
    if (contentEditableHeaderRef.current) {
      const htmlText = contentEditableHeaderRef.current.innerHTML;
      // Save the final content here or perform any other operations you need
      blockEntity.addComponent(new TextFacet({ text: htmlText }));
    }
  };

  return (
    <BlockOutline
      blockEntity={blockEntity}
      content={
        <div
          className={` h-[20rem] md:h-[24rem]  w-full  ${
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
            className="p-4  opacity-80 text-white text-4xl h-40 rounded-lg"
          />
          <div
            className={`flex text-white justify-center  text-6xl relative bottom-28 mt-0.5 ${
              src ? ' opacity-90' : 'opacity-60'
            }`}
          >
            {icon}
          </div>
          <div className=" relative bottom-10 pb-6 ">
            {isEditing ? (
              <p
                ref={contentEditableHeaderRef}
                onBlur={handleHeaderBlur}
                dangerouslySetInnerHTML={{ __html: text }}
                className="lg:text-xl outline-none font-semibold"
              />
            ) : (
              <p
                contentEditable
                ref={contentEditableHeaderRef}
                onBlur={handleHeaderBlur}
                dangerouslySetInnerHTML={{ __html: text }}
                className="lg:text-xl outline-none font-semibold"
              />
            )}
            {isEditing ? (
              <p
                className="text-sm outline-none md:text-base"
                ref={contentEditableRef}
                onBlur={handleDescriptionBlur}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p
                contentEditable
                className="text-sm outline-none md:text-base"
                ref={contentEditableRef}
                onBlur={handleDescriptionBlur}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            <div
              className={`mt-2   flex text-sm md:text-base ${
                blockEntity.has(StyleTypes.BLOCK) ? 'text-white' : ' text-blue'
              }`}
            >
              <p
                onClick={() => {
                  if (!isEditing) {
                    blockEntity.addComponent(new FurtherFacet({ isGoingFurther: true }));
                    blockEditorEntity.addComponent(
                      new ParentFacet({ parentId: blockEntity.get(IdFacet)?.props.id || '1' }),
                    );
                  }
                }}
                className="border-b-2 border-opacity-0 hover:border-opacity-100 border-blue "
              >
                Mehr
              </p>
              <IoChevronForward className="mt-1 ml-1" />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default MoreInformationsBlock;
