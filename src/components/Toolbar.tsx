import { Entity, useEntities, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useState } from 'react';
import { IsEditingFacet } from '../app/BlockFacets';
import {
  IoAddOutline,
  IoEllipsisHorizontalCircleOutline,
  IoShapesOutline,
  IoShareOutline,
} from 'react-icons/io5';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { Tags } from '../base/Constants';

interface ToolbarProps {
  blockEditorEntity: Entity;
  blockEntities: readonly Entity[];
}
const Toolbar: React.FC<ToolbarProps> = ({ blockEditorEntity, blockEntities }) => {
  const [isEditingFacet] = useEntityComponents(blockEditorEntity, IsEditingFacet);
  const [isWriting, setIsWriting] = useState(false);
  const isEditing = isEditingFacet.props.isEditing;

  useEffect(() => {
    setIsWriting(checkIsWriting);
  }, [
    blockEntities.map((block) => {
      block.hasTag(Tags.FOCUSED);
    }),
  ]);

  const checkIsWriting = () => {
    let updatedIsWriting = false;

    blockEntities.map((block) => {
      if (block.hasTag(Tags.FOCUSED)) {
        updatedIsWriting = true;
      }
    });
    return updatedIsWriting;
  };

  return (
    <div className="py-6 md:py-4 h-16 bg-white  w-full md:bg-opacity-0  absolute top-0 right-0  flex justify-end">
      <div className=" space-x-4   flex pr-4 md:pr-6 h-6 text-blue md:space-x-5 text-2xl">
        {isEditing ? (
          <p
            onClick={() => {
              blockEditorEntity?.addComponent(new IsEditingFacet({ isEditing: false }));
            }}
            className="text-base font-bold  "
          >
            Fertig
          </p>
        ) : isWriting ? (
          <p
            onClick={() => {
              blockEntities.map((block) => {
                block.removeTag(Tags.FOCUSED);
              });
            }}
            className="text-base font-bold  "
          >
            Fertig
          </p>
        ) : (
          <>
            <div
              onClick={() => {
                blockEditorEntity?.addTag(Tags.IS_CREATEMENU_VISIBLE);
              }}
              className={
                blockEditorEntity?.hasTag(Tags.IS_CREATEMENU_VISIBLE)
                  ? ' opacity-50'
                  : 'hover:opacity-50 transition-all'
              }
            >
              <IoAddOutline />
            </div>

            <IoShareOutline />
            <div
              onClick={() => {
                blockEditorEntity?.addTag(Tags.IS_PageOptionsMenu_VISIBLE);
              }}
              className={
                blockEditorEntity?.hasTag(Tags.IS_PageOptionsMenu_VISIBLE)
                  ? ' opacity-50'
                  : 'hover:opacity-50 transition-all'
              }
            >
              <IoEllipsisHorizontalCircleOutline />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
