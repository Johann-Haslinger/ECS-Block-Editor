import { Entity, useEntities, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import React from 'react';
import { IsEditingFacet } from '../app/BlockFacets';
import {
  IoAddOutline,
  IoEllipsisHorizontalCircleOutline,
  IoShapesOutline,
  IoShareOutline,
} from 'react-icons/io5';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { Tags } from '../base/Constants';


const Toolbar = (props: EntityProps) => {
  //const [isEditingFacet] = useEntityComponents(props.entity, IsEditingFacet);

  const isEditing = props.entity?.get(IsEditingFacet)?.props.isEditing

  return (
    <div className="py-6 md:py-4  z-50 md:bg-opacity-0 bg-white absolute top-0 w-full left-0 flex justify-end">
      <div className=" space-x-4 flex pr-4 md:pr-6 h-6 text-blue md:space-x-5 text-2xl">
        {isEditing ? (
          <p onClick={()=> {props.entity?.addComponent(new IsEditingFacet({ isEditing: false }))}} className="text-base font-bold  ">Fertig</p>
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
