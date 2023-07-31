import { useContext, useEffect, useState } from 'react';
import { ChildFacet, DescriptionFacet, IdFacet, IsEditingFacet, IsFocusedFacet, IsPressedFacet, IsSmallBlockFacet, TextFacet, TypeFacet } from '../app/BlockFacets';
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
    blockEntity.addComponent(new IsFocusedFacet({ isFocused: false}));
    blockEntity.addComponent(new IdFacet({ id: uuid()}));
    blockEntity.addTag(Tags.PRESSED);

    const blockEntity2 = new Entity();
    ecs.engine.addEntity(blockEntity2);
    blockEntity2.addComponent(new TextFacet({ text: 'Toller Text' }));
    blockEntity2.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity2.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity2.addComponent(new IsFocusedFacet({ isFocused: false}));
    blockEntity2.addComponent(new IdFacet({ id: uuid()}));
    blockEntity2.addTag(Tags.PRESSED);
    
    const blockEntity3 = new Entity();
    ecs.engine.addEntity(blockEntity3);
    blockEntity3.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity3.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity3.addComponent(new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." }));
    blockEntity3.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity3.addComponent(new IdFacet({ id: uuid()}));
    blockEntity3.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity3.addTag(Tags.PRESSED);

    const blockEntity4 = new Entity();
    ecs.engine.addEntity(blockEntity4);
    blockEntity4.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity4.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity4.addComponent(new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." }));
    blockEntity4.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity4.addComponent(new IdFacet({ id: uuid()}));
    blockEntity4.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity4.addTag(Tags.PRESSED);


    const blockEntity5 = new Entity();
    ecs.engine.addEntity(blockEntity5);
    blockEntity5.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity5.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity5.addComponent(new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." }));
    blockEntity5.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity5.addComponent(new IdFacet({ id: uuid()}));
    blockEntity5.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity5.addTag(Tags.PRESSED);

    const blockEditor = new Entity();
    ecs.engine.addEntity(blockEditor);
    blockEditor.addComponent(new IsEditingFacet({ isEditing: false}));
    blockEditor.addComponent(new IdFacet({ id: uuid()}));



    return () => {
      ecs.engine.removeEntity(blockEntity);
      ecs.engine.removeEntity(blockEntity2);
      ecs.engine.removeEntity(blockEntity3);
      ecs.engine.removeEntity(blockEntity4);
      ecs.engine.removeEntity(blockEntity5);
      ecs.engine.removeEntity(blockEditor);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
