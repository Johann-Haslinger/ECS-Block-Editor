import React, { useContext, useEffect, useRef, useState } from 'react';

import TextBlock from './Blocks/TextBlock';
import ErrorBlock from './Blocks/ErrorBlock';
import EditMenu from './Menus/EditMenu';
import MoreInformationsBlock from './Blocks/MoreInformationsBlock';
import SpacerBlock from './Blocks/SpacerBlock';
import {
  ECSContext,
  Entity,
  useEntities,
  useEntityComponents,
  useEntityHasTags,
} from '@leanscope/ecs-engine';
import CardBlock from './Blocks/CardBlock';
import PageBlock from './Blocks/PageBlock';
import PagesBlock from './Blocks/PagesBlock';
import CreateMenu from './Menus/CreateMenu';
import ImageBlock from './Blocks/ImageBlock';
import InputBar from './Menus/InputBar';
import { DropResult, DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PageOptionsMenu from './Menus/PageOptionsMenu';
import { v4 as uuid } from 'uuid';
import {
  findNumberBetween,
  getHighestOrder,
  getNextHigherOrder,
  getNextLowerOrder,
  getNextLowerOrderEntity,
} from './OrderHelper';
import {
  OrderFacet,
  ParentFacet,
  TypeFacet,
  TextFacet,
  TextTypeFacet,
  TextTypes,
  BlockTypes,
  IdentifierFacet,
} from '@leanscope/ecs-models';
import { Tags } from '../base/Constants';

interface CheckIsPressedProps {
  entity: Entity;
  addCount: () => void;
  increaseCount: () => void;
}
const CheckIsPressed: React.FC<CheckIsPressedProps> = ({
  entity,
  increaseCount,
  addCount,
}) => {
  const [isPressed] = useEntityHasTags(entity, Tags.PRESSED);
  useEffect(() => {
    if (!isPressed) {
      addCount();
    } else {
      increaseCount();
    }
  }, [isPressed]);
  return <></>;
};

const updateBlockOrder = (blocks: readonly Entity[]): Entity[] => {
  // Filter blocks without order and sort the rest
  const orderedBlocks = blocks
    .filter((block) => block.get(OrderFacet)?.props.index !== undefined)
    .sort((a, b) => a.get(OrderFacet)?.props.index! - b.get(OrderFacet)?.props.index!);

  // Assign orders to blocks without order
  let nextOrder =
    orderedBlocks.length > 0
      ? orderedBlocks[orderedBlocks.length - 1].get(OrderFacet)?.props.index! + 1
      : 1;
  const blocksWithNewOrder = blocks
    .filter((block) => block.get(OrderFacet)?.props.index === undefined)
    .map((block) => block.add(new OrderFacet({ index: nextOrder++ })));

  return orderedBlocks.concat(blocksWithNewOrder);
};

interface ComponentRendererProps {
  blockEntities: readonly Entity[];
  blockEditorEntities: readonly Entity[];
  parentId: string;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  blockEntities,
  blockEditorEntities,
  parentId,
}) => {
  const editableAreaRef = useRef<HTMLDivElement>(null);
  const blockEditorEntity = blockEditorEntities[0];
  const [currentParentIdentifierFacet] = useEntityComponents(
    blockEditorEntity,

    ParentFacet,
  );
  const isEditMenuVisible = useEntityHasTags(blockEditorEntity, Tags.IS_EDITING);
  const [isCreateMenuVisible] = useEntityHasTags(blockEditorEntity, Tags.IS_CREATEMENU_VISIBLE);
  const textareaRef = useRef<HTMLInputElement>(null);
  const [sortedBlocks, setSortedBlocks] = useState(updateBlockOrder(blockEntities));
  const ecs = useContext(ECSContext);
  const [allBlockEntities] = useEntities((e) => e.has(TypeFacet));
  const currentParentFacet = currentParentIdentifierFacet?.props.parentId;
  const [isWriting] = useEntityHasTags(blockEditorEntity, Tags.FOCUSED);
  const [pressedBlocksCount, setPrssedBlockCount] = useState(0);

  useEffect(() => {
    console.log(pressedBlocksCount)
    if (pressedBlocksCount === 0) {
      blockEditorEntity?.removeTag(Tags.IS_EDITING);
    }
  }, [pressedBlocksCount]);

  useEffect(() => {
    setSortedBlocks(updateBlockOrder(blockEntities));
  }, [blockEntities]);

  const handleClickOutside = (event: MouseEvent) => {
    if (editableAreaRef.current && !editableAreaRef.current.contains(event.target as Node)) {
      blockEditorEntity?.removeTag(Tags.IS_EDITING);
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
    console.log('rerendert');
    let blocksPressed = false;
    allBlockEntities.map((block) => {
      if (block.hasTag(Tags.PRESSED)) {
        blocksPressed = true;
      }
    });
    if (!blocksPressed) {
      blockEditorEntity?.removeTag(Tags.IS_EDITING);
    }
  }, [
    allBlockEntities.map((block) => {
      block.hasTag(Tags.PRESSED);
    }),
  ]);

  useEffect(() => {
    if (isCreateMenuVisible && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCreateMenuVisible]);

  const recalculateOrder = (startIndex: number, endIndex: number) => {
    const startOrder = sortedBlocks[startIndex].get(OrderFacet)?.props.index;
    const endOrder = sortedBlocks[endIndex].get(OrderFacet)?.props.index || 1;

    const nextHigherOrder = getNextHigherOrder(endOrder, blockEntities) || 1;
    const nextLowerOrder = getNextLowerOrder(endOrder, blockEntities) || 1;

    let newOrder = 1;

    if (endIndex > startIndex) {
      // Block wurde unterhalb platziert
      newOrder = findNumberBetween(nextHigherOrder, endOrder);
    } else {
      // Block wurde oberhalb platziert
      newOrder = findNumberBetween(nextLowerOrder, endOrder);
    }

    if (startOrder && endOrder) {
      return newOrder;
    } else {
      return 1;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    console.log('movedBlock', 'movedBlock');
    if (!result.destination) return;

    const { source, destination } = result;
    const blocksCopy = [...sortedBlocks];
    const [movedBlock] = blocksCopy.splice(source.index, 1);

    blocksCopy.splice(destination.index, 0, movedBlock);

    if (source.index !== destination.index) {
      console.log('movedBlock', 'order', movedBlock.get(OrderFacet)?.props.index);
      const newOrder = recalculateOrder(source.index, destination.index);
      movedBlock.add(new OrderFacet({ index: newOrder }));
      console.log('movedBlock', newOrder);
      setSortedBlocks(updateBlockOrder(blockEntities));

      // Perform any additional updates you need here
      // (e.g., saving the updated order to the backend)
    }

    // Update your state with the new sortedBlocks array
    // (
  };

  const handleCreateBlockAreaClick = () => {
    if (
      blockEntities.length == 0 ||
      getNextLowerOrderEntity(getHighestOrder(blockEntities)!, blockEntities)?.get(TextFacet)?.props
        .text !== ''
    ) {
      const newBlockEntity = new Entity();
      ecs.engine.addEntity(newBlockEntity);
      newBlockEntity.addComponent(new TextFacet({ text: '' }));
      newBlockEntity.addComponent(new TextTypeFacet({ type: TextTypes.NORMAL }));
      newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
      newBlockEntity.addComponent(new IdentifierFacet({ guid: uuid() }));
      newBlockEntity.addComponent(
        new OrderFacet({
          index:
            blockEntities.length !== 0 && getHighestOrder(blockEntities) !== null
              ? getHighestOrder(blockEntities)! + 1
              : 1,
        }),
      );
      newBlockEntity.addComponent(new ParentFacet({ parentId: parentId }));
      newBlockEntity.addTag(Tags.FOCUSED);

      console.log('parentId', parentId);
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

  return (
    <div className="" ref={editableAreaRef}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={'droppable'}>
          {(provided: any) => (
            <div className="flex flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
              {sortedBlocks.map((blockEntity, idx) => {
                const blockType = blockEntity?.get(TypeFacet)?.props.type;
                const BlockComponent =
                  (blockType !== undefined && blockTypeComponents[blockType]) || ErrorBlock;

                return (
                  <Draggable
                    key={blockEntity?.get(IdentifierFacet)?.props.guid.toString()}
                    draggableId={`${blockEntity?.get(IdentifierFacet)?.props.guid.toString()}`}
                    index={idx}
                  >
                    {(provided: any) => (
                      <div
                        className={
                          blockEntity?.get(TypeFacet)?.props.type == BlockTypes.CARD ||
                          blockEntity?.get(TypeFacet)?.props.type == BlockTypes.MORE_INFORMATIONS
                            ? 'md:w-1/2 w-full md:pr-1 pr-0.5 lg:w-1/3'
                            : 'w-full'
                        }
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BlockComponent
                          key={blockEntity?.get(IdentifierFacet)?.props.guid}
                          blockEntity={blockEntity}
                          blockEditorEntity={blockEditorEntity}
                          blockEntities={blockEntities}
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

      {isCreateMenuVisible && (
        <input ref={textareaRef} value={''} className=" outline-none w-full" />
      )}
      <div
        onClick={() => {
          handleCreateBlockAreaClick();
        }}
        className="w-full h-40 md:h-96 "
      />

      <InputBar
        blockEntities={blockEditorEntities}
        isVisible={isCreateMenuVisible || isEditMenuVisible || isWriting ? false : true}
        toggleIsVisible={() => {}}
      />
      {blockEditorEntity && currentParentFacet == parentId && (
        <EditMenu entity={blockEditorEntity} />
      )}
      {blockEditorEntity && currentParentFacet == parentId && (
        <CreateMenu entity={blockEditorEntity} parentId={parentId} />
      )}
      {blockEditorEntity && currentParentFacet == parentId && (
        <PageOptionsMenu entity={blockEditorEntity} />
      )}

      {allBlockEntities.map((entity) => (
        <CheckIsPressed entity={entity} addCount={()=> setPrssedBlockCount(pressedBlocksCount + 1)}  increaseCount={()=> setPrssedBlockCount(pressedBlocksCount - 1)}/>
      ))}
    </div>
  );
};

export default ComponentRenderer;
