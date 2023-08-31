import { Entity, useEntityComponents, useEntityHasTags } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import {  FurtherFacet, IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { Tags } from '../../base/Constants';

interface PageBlockProps {
  blockEntity: Entity;
  blockEditorEntity: Entity;
}

const PageBlock: React.FC<PageBlockProps> = ({ blockEntity, blockEditorEntity }) => {
  const [textFacet] = useEntityComponents(blockEntity, TextFacet);
  const text = textFacet?.props.text;
  
  const [isEditing] =useEntityHasTags(blockEditorEntity, Tags.IS_EDITING )

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
          className="flex h-full pl-0.5 items-center"
        >
          <div
            className={`h-10 w-8 ml-1.5 bg-white rounded-sm shadow mr-3   border-[rgb(245,245,245)] ${
              !isEditing ? ' md:hover:scale-110 transition-all ' : ''
            }`}
          >
            <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-2 ml-0.5" />
            <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-1.5 ml-0.5" />
            <div className="w-4 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
            <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
            <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
          </div>
          <div className='pl-0.5'>
            <p className="font-semibold">{text} </p>
            <p className="text-sm  relative bottom-0.5 text-text2">
              Seiteninhalt wird hier angezeigt
            </p>
          </div>
        </div>
      }
    />
  );
};

export default PageBlock;
