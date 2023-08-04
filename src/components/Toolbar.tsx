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
  const [isEditingFacet] = useEntityComponents(props.entity, IsEditingFacet);

  const isEditing = isEditingFacet.props.isEditing;

  return (
    <div className="py-6 md:py-4 h-16 bg-white  w-full md:bg-opacity-0  absolute top-0 right-0  flex justify-end">
      <div className=" space-x-4   flex pr-4 md:pr-6 h-6 text-blue md:space-x-5 text-2xl">
        {isEditing ? (
          <p
            onClick={() => {
              props.entity?.addComponent(new IsEditingFacet({ isEditing: false }));
            }}
            className="text-base font-bold  "
          >
            Fertig
          </p>
        ) : (
          <>
            <div
              onClick={() => {
                console.log(1);
                props.entity?.addTag(Tags.IS_CREATEMENU_VISIBLE);
              }}
              className={props.entity?.hasTag(Tags.IS_CREATEMENU_VISIBLE) ? " opacity-50" : "hover:opacity-50 transition-all"}
            >
              <IoAddOutline />
            </div>

            <IoShareOutline />

            <IoEllipsisHorizontalCircleOutline />
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
