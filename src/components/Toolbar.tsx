import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import React from 'react';
import { IsEditingFacet } from '../app/BlockFacets';
import {
  IoAddOutline,
  IoEllipsisHorizontalCircleOutline,
  IoShapesOutline,
  IoShareOutline,
} from 'react-icons/io5';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';

interface IsEditingEntityType {
  props: {
    isEditing: boolean;
  };
}

const Toolbar = (props: EntityProps) => {
  const blockEditorEntity = useEntity(props.entity);

  const isEditing = (blockEditorEntity[0][1] as IsEditingEntityType)?.props.isEditing;

  return (
    <div className="py-4 absolute top-0 w-full left-0 flex justify-end">
      <div className=" space-x-4 flex pr-2 md:pr-6 h-6 text-blue md:space-x-5 text-2xl">
        {isEditing ? (
          <p onClick={()=> {props.entity.addComponent(new IsEditingFacet({ isEditing: false }))}} className="text-base font-bold  ">Fertig</p>
        ) : (
          <>
            <IoAddOutline />
            <IoShareOutline />
            <IoEllipsisHorizontalCircleOutline />
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
