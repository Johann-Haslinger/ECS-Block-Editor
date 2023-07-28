import { useContext, useEffect, useState } from 'react';
import { ChildFacet, IdFacet, IsEditingFacet, IsFocusedFacet, IsPressedFacet, TextFacet, TypeFacet } from '../app/BlockFacets';
import { BlockTypes, Tags } from '../base/Constants';
import { ECSContext, Entity, System } from '@leanscope/ecs-engine';
import { v4 as uuid } from "uuid";

const InitSystem = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app init');
    ecs.engine.clear();

    const blockEntity = new Entity();
    ecs.engine.addEntity(blockEntity);
    blockEntity.addComponent(new TextFacet({ text: 'Toller Text' }));
    blockEntity.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity.addComponent(new IsPressedFacet({ isPressed: false}));
    blockEntity.addComponent(new IsFocusedFacet({ isFocused: true}));
    blockEntity.addComponent(new IdFacet({ id: uuid()}));

    const blockEntity2 = new Entity();
    ecs.engine.addEntity(blockEntity2);
    blockEntity2.addComponent(new TextFacet({ text: 'Toller Text' }));
    blockEntity2.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity2.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity2.addComponent(new IsPressedFacet({ isPressed: false}));
    blockEntity2.addComponent(new IdFacet({ id: uuid()}));

    const blockEditor = new Entity();
    ecs.engine.addEntity(blockEditor);
    blockEditor.addComponent(new IsEditingFacet({ isEditing: false}));
    blockEditor.addComponent(new IdFacet({ id: uuid()}));



    return () => {
      ecs.engine.removeEntity(blockEntity);
      ecs.engine.removeEntity(blockEntity2);
      ecs.engine.removeEntity(blockEditor);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
