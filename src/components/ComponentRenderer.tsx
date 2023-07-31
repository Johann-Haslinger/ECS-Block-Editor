import { Entity, useEntities, useEntity } from '@leanscope/ecs-engine';
import React, { useEffect, useRef } from 'react';
import { ChildFacet, IsEditingFacet, IsPressedFacet, TypeFacet } from '../app/BlockFacets';
import { BlockTypes } from '../base/Constants';
import TextBlock from './Blocks/TextBlock';
import ErrorBlock from './Blocks/ErrorBlock';
import EditMenu from './Menus/EditMenu';

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

  return (
    <div ref={editableAreaRef}>
      {blockEntities.map((blockEntity, idx) =>
        blockEntity?.get(TypeFacet)?.props.type == BlockTypes.TEXT ? (
          <TextBlock key={idx} blockEntity={blockEntity} />
        ) : (
          <ErrorBlock key={idx} />
        ),
      )}
    {blockEditorEntity &&(  <EditMenu  entity={blockEditorEntity} />)}
    </div>
  );
};

export default ComponentRenderer;
