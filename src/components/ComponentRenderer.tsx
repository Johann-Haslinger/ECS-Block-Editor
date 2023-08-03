import React, { useEffect, useRef } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import {
  ChildFacet,
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
import CardBlock from './Blocks/CardBlock';

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

  // const sortBlocksByNeighbourId = (blocks: readonly Entity[]): Entity[] => {
  //   const blockMap: Record<string, Entity> = {};
  //   const sortedBlocks: Entity[] = [];

  //   for (const block of blocks) {
  //     const id = block?.get(IdFacet)?.props.id;
  //     const neighbourId = block?.get(NeighbourIdFacet)?.props.neighbourId;
  //     if (id && neighbourId) {
  //       blockMap[id] = block;
  //       if (neighbourId === 'first') {
  //         sortedBlocks.push(block); // Block mit Nachbar-ID "first" wird am Ende hinzugefügt
  //       }
  //     }
  //   }

  //   let currentBlock = sortedBlocks[0];
  //   while (currentBlock && currentBlock?.get(NeighbourIdFacet)?.props.neighbourId) {
  //     const id = currentBlock.get(NeighbourIdFacet)?.props.neighbourId;
  //     const nextBlock = blockMap[id || '']; // Nächster Block in der Verbindungskette
  //     if (nextBlock) {
  //       sortedBlocks.push(nextBlock);
  //     }
  //     currentBlock = nextBlock;
  //   }

  //   return sortedBlocks;
  // };

  // const sortedBlockEntities = sortBlocksByNeighbourId(blockEntities);

  return (
    <div className="pb-40 md:pb-60" ref={editableAreaRef}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <div className="flex  flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
              {blockEntities.map((blockEntity, idx) => (
                <Draggable
                  key={blockEntity?.get(IdFacet)?.props.id.toString()}
                  draggableId={`${blockEntity?.get(IdFacet)?.props.id.toString()}`} // multiple Select if pressed
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
                      ) : blockEntity?.get(TypeFacet)?.props.type ===
                        BlockTypes.CARD ? (
                        <CardBlock
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
