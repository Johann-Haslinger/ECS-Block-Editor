import {
  Entity,
  useEntities,
  useEntity,
  useEntityComponents,
  useEntityHasTags,
} from '@leanscope/ecs-engine';
import React, { useEffect, useState } from 'react';

import {
  IoAddOutline,
  IoEllipsisHorizontalCircleOutline,
  IoShapesOutline,
  IoShareOutline,
} from 'react-icons/io5';

import { Tags } from '../base/Constants';

interface ToolbarProps {
  blockEditorEntity: Entity;
  blockEntities: readonly Entity[];
}
const Toolbar: React.FC<ToolbarProps> = ({ blockEditorEntity, blockEntities }) => {
  const [isWriting, isEditing] = useEntityHasTags(blockEditorEntity, Tags.FOCUSED, Tags.IS_EDITING);
   

  return (
    <div className="py-6 md:py-4 h-16 bg-white  w-full md:bg-opacity-0  absolute top-0 right-0  flex justify-end">
      <div className=" space-x-4   flex pr-4 md:pr-6 h-6 text-blue md:space-x-5 text-2xl">
        {isEditing ? (
          <p
            onClick={() => {
              blockEditorEntity?.removeTag(Tags.IS_EDITING)
            }}
            className="text-base font-bold  "
          >
            Fertig
          </p>
        ) : isWriting ? (
          <p
            onClick={() => {
              blockEntities.map((block) => {
                block.removeTag(Tags.PRESSED);
              });
              blockEditorEntity.removeTag(Tags.FOCUSED)
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
