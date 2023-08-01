import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import React, { useEffect, useRef } from 'react';
import {
  ChildFacet,
  IsEditingFacet,
  IsPressedFacet,
  IsSmallBlockFacet,
  TypeFacet,
} from '../app/BlockFacets';
import { BlockTypes } from '../base/Constants';
import TextBlock from './Blocks/TextBlock';
import ErrorBlock from './Blocks/ErrorBlock';
import EditMenu from './Menus/EditMenu';
import MoreInformationsBlock from './Blocks/MoreInformationsBlock';
import SpacerBlock from './Blocks/SpacerBlock';

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
    if (
      editableAreaRef.current &&
      blockEditorEntity &&
      !editableAreaRef.current.contains(event.target as Node)
    ) {
      blockEditorEntity.addComponent(new IsEditingFacet({ isEditing: false }));
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

  console.log(blockEntities)

  return (
    <div className="flex  w-full flex-wrap" ref={editableAreaRef}>
      {blockEntities.map((blockEntity, idx) => (
        <div
          className={
            blockEntity?.get(IsSmallBlockFacet)?.props.isSmall == true
              ? 'md:w-1/2 w-full  md:pr-1 pr-0.5 lg:w-1/3'
              : 'w-full '
          }
        >
          {blockEntity?.get(TypeFacet)?.props.type == BlockTypes.TEXT ? (
            <TextBlock key={idx} blockEntity={blockEntity} />
          ) : blockEntity?.get(TypeFacet)?.props.type == BlockTypes.MORE_INFORMATIONS ? (
            <MoreInformationsBlock key={idx} blockEntity={blockEntity} />
          ) : blockEntity?.get(TypeFacet)?.props.type == BlockTypes.SPACER ? (
            <SpacerBlock key={idx} blockEntity={blockEntity} />
          ) : (
            <ErrorBlock key={idx} />
          )}
        </div>
      ))}
      {blockEditorEntity && <EditMenu entity={blockEditorEntity} />}
    </div>
  );
};

export default ComponentRenderer;
