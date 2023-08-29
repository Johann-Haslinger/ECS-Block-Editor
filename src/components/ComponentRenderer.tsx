import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  ChildFacet,
  // Andere Imports bleiben gleich...
  IdFacet,
  IsEditingFacet,
  IsSmallBlockFacet,
  OrderFacet,
  ParentFacet,
  TextFacet,
  TextTypeFacet,
  TypeFacet,
} from '../app/BlockFacets';
import { BlockTypes, Tags, TextTypes } from '../base/Constants';
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
import { getHighestOrder, getNextLowerOrderEntity } from './OrderHelper';

function updateBlockOrder(blocks: readonly Entity[]): Entity[] {
  // Filter blocks without order and sort the rest
  const orderedBlocks = blocks
    .filter((block) => block.get(OrderFacet)?.props.order !== undefined)
    .sort((a, b) => a.get(OrderFacet)?.props.order! - b.get(OrderFacet)?.props.order!);

  // Assign orders to blocks without order
  let nextOrder =
    orderedBlocks.length > 0
      ? orderedBlocks[orderedBlocks.length - 1].get(OrderFacet)?.props.order! + 1
      : 1;
  const blocksWithNewOrder = blocks
    .filter((block) => block.get(OrderFacet)?.props.order === undefined)
    .map((block) => block.add(new OrderFacet({ order: nextOrder++ })));

  return orderedBlocks.concat(blocksWithNewOrder);
}

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
  const [isEditingFacet, currentParentIdFacet] = useEntityComponents(
    blockEditorEntity,
    IsEditingFacet,
    ParentFacet,
  );
  const isEditMenuVisible = isEditingFacet.props.isEditing;
  const [isCreateMenuVisible] = useEntityHasTags(blockEditorEntity, Tags.IS_CREATEMENU_VISIBLE);
  const textareaRef = useRef<HTMLInputElement>(null);
  const [sortedBlocks, setSortedBlocks] = useState(updateBlockOrder(blockEntities));
  const ecs = useContext(ECSContext);
  const [allBlockEntities] = useEntities((e) => e.has(TypeFacet));
  const currentParentFacet = currentParentIdFacet.props.parentId;

  useEffect(() => {
    setSortedBlocks(updateBlockOrder(blockEntities));
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
    allBlockEntities.map((block) => {

      if (block.hasTag(Tags.PRESSED)) {
        blocksPressed = true;
      }
    });
    if (!blocksPressed) {
      blockEditorEntity?.addComponent(new IsEditingFacet({ isEditing: false }));
    }
  }, [
    allBlockEntities.map((block) => {
      block.hasTag(Tags.PRESSED);
    }), // Rerender !!
  ]);

  useEffect(() => {
    if (isCreateMenuVisible && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCreateMenuVisible]);

  // useEffect(() => {
  //   if (blockEntities.length == 0) {
  //     const newBlockEntity = new Entity();
  //     ecs.engine.addEntity(newBlockEntity);
  //     newBlockEntity.addComponent(new TextFacet({ text: '' }));
  //     newBlockEntity.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
  //     newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
  //     newBlockEntity.addComponent(new IdFacet({ id: uuid() }));
  //     newBlockEntity.addComponent(new OrderFacet({ order: 1 }));
  //     newBlockEntity.addComponent(new ParentFacet({ parentId: parentId }));
  //     newBlockEntity.addTag(Tags.FOCUSED);
  //   }
  // }, [blockEntities]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
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
      newBlockEntity.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
      newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
      newBlockEntity.addComponent(new IdFacet({ id: uuid() }));
      newBlockEntity.addComponent(
        new OrderFacet({
          order:
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
        <Droppable droppableId={'droppable'} isDropDisabled={!isEditMenuVisible}>
          {(provided: any) => (
            <div className="flex flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
              {sortedBlocks.map((blockEntity, idx) => {
                const blockType = blockEntity?.get(TypeFacet)?.props.type;
                const BlockComponent =
                  (blockType !== undefined && blockTypeComponents[blockType]) || ErrorBlock;

                return (
                  <Draggable
                    key={blockEntity?.get(IdFacet)?.props.id.toString()}
                    draggableId={`${blockEntity?.get(IdFacet)?.props.id.toString()}`}
                    index={idx}
                    isDragDisabled={!isEditMenuVisible}
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
        isVisible={isCreateMenuVisible || isEditMenuVisible ? false : true}
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
    </div>
  );
};

export default ComponentRenderer;
