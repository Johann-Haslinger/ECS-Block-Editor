import React, { useEffect, useRef, useState } from 'react';
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
import PageBlock from './Blocks/PageBlock';
import PagesBlock from './Blocks/PagesBlock';
import CreateMenu from './Menus/CreateMenu';
import ImageBlock from './Blocks/ImageBlock';

const customSort = (entityArr: readonly Entity[]) => {
  let arr = [...entityArr];
  let sortedArray: Entity[] = [];

  // Find the item with neighbourId = "first" and add it as the first element
  const firstItem = arr.find((item) => item.get(NeighbourIdFacet)?.props.neighbourId === 'first');
  if (firstItem) {
    sortedArray.push(firstItem);

    // Remove the first item from the array to prevent duplicate inclusion
    arr = arr.filter((item) => item !== firstItem);
  }

  // Sort the remaining items based on neighbour relationships
  while (arr.length > 0) {
    let added = false;

    for (let i = 0; i < arr.length; i++) {
      const currentItem = arr[i];

      if (
        sortedArray.some(
          (item) =>
            item.get(IdFacet)?.props.id === currentItem.get(NeighbourIdFacet)?.props.neighbourId,
        )
      ) {
        sortedArray.splice(
          sortedArray.findIndex(
            (item) =>
              item.get(IdFacet)?.props.id === currentItem.get(NeighbourIdFacet)?.props.neighbourId,
          ) + 1,
          0,
          currentItem,
        );
        arr.splice(i, 1);
        added = true;
        break;
      }
    }

    if (!added) {
      // If no more items can be added, break to prevent infinite loop
      break;
    }
  }

  while (arr.length > 0) {
    const lastSortedItem = sortedArray[sortedArray.length - 1];
    const lastSortedItemId = lastSortedItem.get(IdFacet)?.props.id ;

    const remainingIndex = arr.findIndex(item => item.get(NeighbourIdFacet)?.props.neighbourId === lastSortedItemId);
    if (remainingIndex !== -1) {
      sortedArray.push(arr[remainingIndex]);
      arr.splice(remainingIndex, 1);
    } else {
      // If no more items can be added, break to prevent infinite loop
      break;
    }
  }


  return sortedArray;
};

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
  const [sortedBlockEntities, setSortedBlockEntities] = useState(customSort(blockEntities));

  useEffect(() => {
    setSortedBlockEntities(customSort(blockEntities));
  }, [blockEntities]);

  const handleClickOutside = (event: MouseEvent) => {
    if (editableAreaRef.current && !editableAreaRef.current.contains(event.target as Node)) {
      blockEditorEntity?.addComponent(new IsEditingFacet({ isEditing: false }));
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

  useEffect(() => {
    let blocksPressed = false;
    blockEntities.map((block) => {
      if (block.hasTag(Tags.PRESSED)) {
        blocksPressed = true;
      }
    });
    if (!blocksPressed) {
      blockEditorEntity?.addComponent(new IsEditingFacet({ isEditing: false }));
    }
  }, [
    blockEntities.map((block) => {
      block.hasTag(Tags.PRESSED);
    }),
  ]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
  };

  const blockTypeComponents: { [key: string]: React.FC<any> } = {
    [BlockTypes.TEXT]: TextBlock,
    [BlockTypes.MORE_INFORMATIONS]: MoreInformationsBlock,
    [BlockTypes.CARD]: CardBlock,
    [BlockTypes.SPACER]: SpacerBlock,
    [BlockTypes.PAGE]: PageBlock,
    [BlockTypes.PAGES]: PagesBlock,
    [BlockTypes.IMAGE]: ImageBlock,
  };

  console.log(blockEditorEntity)
  return (
    <div className="pb-40 md:pb-60" ref={editableAreaRef}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <div className="flex flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
              {blockEntities.map((blockEntity, idx) => {
                const blockType = blockEntity?.get(TypeFacet)?.props.type;
                const BlockComponent =
                  (blockType !== undefined && blockTypeComponents[blockType]) || ErrorBlock;

                return (
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
                            : 'w-full'
                        }
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BlockComponent
                          key={blockEntity?.get(IdFacet)?.props.id}
                          blockEntity={blockEntity}
                          blockEditorEntity={blockEditorEntity}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {blockEditorEntity && <EditMenu entity={blockEditorEntity} />}
      {blockEditorEntity && <CreateMenu entity={blockEditorEntity} />}
    </div>
  );
};

export default ComponentRenderer;
