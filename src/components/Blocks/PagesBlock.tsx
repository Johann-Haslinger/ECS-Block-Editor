import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import { FurtherFacet, IsEditingFacet, TextFacet } from '../../app/BlockFacets';
import BlockOutline from './BlockOutline';

interface PagesBlockProps {
  blockEntity: Entity;
  blockEditorEntity: Entity;
}

const PagesBlock: React.FC<PagesBlockProps> = ({ blockEntity, blockEditorEntity }) => {
  const [textFacet] = useEntityComponents(blockEntity, TextFacet);
  const [isEditingFacet] = useEntityComponents(blockEditorEntity, IsEditingFacet);
  const text = textFacet.props.text;
  const isEditing = isEditingFacet.props.isEditing;

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
          className="flex h-full pl-0.5 items-center"
        >
          <div className={`flex ${!isEditing ? ' md:hover:scale-110 transition-all ' : ''}`}>
            <div className={`h-10 w-8 bg-white rounded-sm  shadow opacity-80  mr-3   border-[rgb(245,245,245)]`}>
              <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-2 ml-0.5" />
              <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-1.5 ml-0.5" />
              <div className="w-4 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
              <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
              <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
            </div>
            <div className={`h-10 w-8 absolute left-1.5 opacity-90 bg-white rounded-sm  shadow mr-3   border-[rgb(245,245,245)]`}>
              <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-2 ml-0.5" />
              <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-1.5 ml-0.5" />
              <div className="w-4 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
              <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
              <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
            </div>
            <div className={`h-10 w-8 absolute left-2.5 bg-white shadow  shadow-gray-200 rounded-sm  mr-3   border-[rgb(245,245,245)]`}>
              <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-2 ml-0.5" />
              <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-1.5 ml-0.5" />
              <div className="w-4 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
              <div className="w-6 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
              <div className="w-3 h-0.5  bg-secondery-bg rounded-full mt-0.5 ml-0.5" />
            </div>
          </div>
          <div className='pl-2'>
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

export default PagesBlock;
