import { Entity, useEntities, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useState } from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility, IoChevronForward, IoCode } from 'react-icons/io5';
import {
  ColorFacet,
  DescriptionFacet,
  FurtherFacet,
  IconFacet,
  IsEditingFacet,
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
  const description = descriptionFacet.props.description;
  const text = textFacet.props.text;
  const icon = iconFacet.props.icon;
  const color = colorFacet.props.color;
  const isEditing = blockEditorEntity?.get(IsEditingFacet)?.props.isEditing;

  return (
    <BlockOutline
      blockEntity={blockEntity}
      content={
        <div
          className={` h-[20rem] md:h-[24rem]  w-full  ${
            !isEditing  &&  !blockEntity.has(StyleTypes.BLOCK) ? ' md:hover:scale-105 transition-all ' : 'md:hover:scale-95 transition-all'
          }`}
        >
          <div
            style={{ backgroundColor: color }}
            className="p-4  text-white text-4xl h-40 rounded-lg"
          />
          <div
           
            className="flex text-white justify-center opacity-60 text-6xl relative bottom-28 mt-0.5"
          >
            {icon}
          </div>
          <div className=" relative bottom-10 pb-6 ">
            <p  className="lg:text-xl outline-none font-semibold">
              {text}
            </p>
            <p  className="text-sm outline-none md:text-base ">
              {description}
            </p>
            <div className={`mt-2   flex text-sm md:text-base ${blockEntity.has(StyleTypes.BLOCK )? "text-white": " text-blue"}`}>
              <p
                onClick={() => {
                  if (!isEditing) {
                    blockEntity.addComponent(new FurtherFacet({ isGoingFurther: true }));
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
