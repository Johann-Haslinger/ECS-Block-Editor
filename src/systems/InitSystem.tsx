import { useContext, useEffect, useState } from 'react';
import { ChildFacet, DescriptionFacet, IdFacet, IsEditingFacet, IsFocusedFacet, IsPressedFacet, IsSmallBlockFacet, NeighbourIdFacet, TextFacet, TextTypeFacet, TypeFacet, CurrentTextTypeFacet } from '../app/BlockFacets';
import { BlockTypes, Tags, TextTypes } from '../base/Constants';
import { ECSContext, Entity, System } from '@leanscope/ecs-engine';
import { v4 as uuid } from "uuid";

const InitSystem = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app init');
    ecs.engine.clear();


    
    const blockEntity3 = new Entity();
    ecs.engine.addEntity(blockEntity3);
    blockEntity3.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity3.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity3.addComponent(new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." }));
    blockEntity3.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity3.addComponent(new IdFacet({ id: "1"}));
    blockEntity3.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity3.addComponent(new NeighbourIdFacet({ neighbourId: "first" }));

    const blockEntity4 = new Entity();
    ecs.engine.addEntity(blockEntity4);
    blockEntity4.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity4.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity4.addComponent(new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." }));
    blockEntity4.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity4.addComponent(new IdFacet({ id: "2"}));
    blockEntity4.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity4.addComponent(new NeighbourIdFacet({ neighbourId: "1" }));

    const blockEntity5 = new Entity();
    ecs.engine.addEntity(blockEntity5);
    blockEntity5.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity5.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity5.addComponent(new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." }));
    blockEntity5.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity5.addComponent(new IdFacet({ id:"3"}));
    blockEntity5.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity5.addComponent(new NeighbourIdFacet({ neighbourId: "2" }));

    const blockEntity2 = new Entity();
    ecs.engine.addEntity(blockEntity2);
    blockEntity2.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity2.addComponent(new IdFacet({ id: "4"}));
    blockEntity2.addComponent(new NeighbourIdFacet({ neighbourId: "3" }));
  



    const blockEntity6 = new Entity();
    ecs.engine.addEntity(blockEntity6);
    blockEntity6.addComponent(new TextFacet({ text:"Lorem ipsum dolor sit amet" }));
    blockEntity6.addComponent(new TextTypeFacet({ type: TextTypes.HEADING }));
    blockEntity6.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity6.addComponent(new IdFacet({ id: "4"}));
    blockEntity6.addComponent(new NeighbourIdFacet({ neighbourId: "3" }));
  
    const blockEntity7 = new Entity();
    ecs.engine.addEntity(blockEntity7);
    blockEntity7.addComponent(new TextFacet({ text:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." }));
    blockEntity7.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
    blockEntity7.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity7.addComponent(new IdFacet({ id: "4"}));
    blockEntity7.addComponent(new NeighbourIdFacet({ neighbourId: "3" }));
  

    const blockEditor = new Entity();
    ecs.engine.addEntity(blockEditor);
    blockEditor.addComponent(new IsEditingFacet({ isEditing: false}));
    blockEditor.addComponent(new IdFacet({ id: uuid()}));
    blockEditor.addTag(Tags.IS_EDITING)

    const editMenu = new Entity();
    ecs.engine.addEntity(editMenu);
    editMenu.addComponent(new CurrentTextTypeFacet({textType: TextTypes.TEXT}))
    editMenu.addComponent(new IdFacet({ id: uuid()}));






    return () => {

      ecs.engine.removeEntity(editMenu);
      ecs.engine.removeEntity(blockEntity2);
      ecs.engine.removeEntity(blockEntity3);
      ecs.engine.removeEntity(blockEntity4);
      ecs.engine.removeEntity(blockEntity5);
      ecs.engine.removeEntity(blockEntity6);
      ecs.engine.removeEntity(blockEntity7);
      ecs.engine.removeEntity(blockEditor);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
