import React, { useEffect, useRef } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import {
  // Andere Imports bleiben gleich...
  IdFacet,
  IsEditingFacet,
  IsSmallBlockFacet,
  NeighbourIdFacet,
  TypeFacet,
} from '../app/BlockFacets';
import { BlockTypes, Tags } from '../base/Constants';
import TextBlock from './Blocks/TextBlock';
import ErrorBlock from './Blocks/ErrorBlock';
import EditMenu from './Menus/EditMenu';
import MoreInformationsBlock from './Blocks/MoreInformationsBlock';
import SpacerBlock from './Blocks/SpacerBlock';
import { Entity } from '@leanscope/ecs-engine';

interface ComponentRendererProps {
  blockEntities: readonly Entity[];
  blockEditorEntities: readonly Entity[];
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  blockEntities,
  blockEditorEntities,
}) => {
  const editableAreaRef = useRef<HTMLDivElement>(null);
  const blockEditorEntity = blockEditorEntities[0];

  const handleClickOutside = (event: MouseEvent) => {
    if (editableAreaRef.current && !editableAreaRef.current.contains(event.target as Node)) {
      blockEditorEntity?.addComponent(new IsEditingFacet({ isEditing: false }));
      console.log('clicked outside');
    }
  };

  useEffect(() => {
    if (blockEditorEntity) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [blockEditorEntity]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
  };

  return (
    <div ref={editableAreaRef}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <div className="flex flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
              {blockEntities.map((blockEntity, idx) => (
                <Draggable
                  key={blockEntity?.get(IdFacet)?.props.id.toString()}
                  draggableId={`${blockEntity?.get(IdFacet)?.props.id.toString()}`}
                  index={idx}
                >
                  {(provided: any) => (
                    <div
                      className={
                        blockEntity?.get(IsSmallBlockFacet)?.props.isSmall === true
                          ? 'md:w-1/2 w-full md:pr-1 pr-0.5 lg:w-1/3'
                          : 'w-full '
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {blockEntity?.get(TypeFacet)?.props.type === BlockTypes.TEXT ? (
                        <TextBlock
                          key={blockEntity?.get(IdFacet)?.props.id}
                          blockEntity={blockEntity}
                        />
                      ) : blockEntity?.get(TypeFacet)?.props.type ===
                        BlockTypes.MORE_INFORMATIONS ? (
                        <MoreInformationsBlock
                          blockEditorEntity={blockEditorEntity}
                          key={blockEntity?.get(IdFacet)?.props.id}
                          blockEntity={blockEntity}
                        />
                      ) : blockEntity?.get(TypeFacet)?.props.type === BlockTypes.SPACER ? (
                        <SpacerBlock
                          key={blockEntity?.get(IdFacet)?.props.id}
                          blockEntity={blockEntity}
                        />
                      ) : (
                        <ErrorBlock key={blockEntity?.get(IdFacet)?.props.id} />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {blockEditorEntity && <EditMenu entity={blockEditorEntity} />}
    </div>
  );
};

export default ComponentRenderer;
