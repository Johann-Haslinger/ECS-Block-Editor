import { useContext, useEffect, useState } from 'react';
import {
  ChildFacet,
  DescriptionFacet,
  IdFacet,
  IsEditingFacet,
  IsFocusedFacet,
  IsPressedFacet,
  IsSmallBlockFacet,
  NeighbourIdFacet,
  TextFacet,
  TextTypeFacet,
  TypeFacet,
  CurrentTextTypeFacet,
  CurrentBlockTypeFacet,
  TodoFacet,
  IconFacet,
  ColorFacet,
  ParentFacet,
  FurtherFacet,
} from '../app/BlockFacets';
import { BlockTypes, Tags, TextTypes } from '../base/Constants';
import { ECSContext, Entity, System } from '@leanscope/ecs-engine';
import { v4 as uuid } from 'uuid';
import { IoAccessibility, IoAlarm, IoAlert, IoAnalytics, IoBeaker, IoPaperPlane } from 'react-icons/io5';

const InitSystem = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app init');
    ecs.engine.clear();

    const blockEntity3 = new Entity();
    ecs.engine.addEntity(blockEntity3);
    blockEntity3.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity3.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity3.addComponent(new IconFacet({ icon: <IoPaperPlane/> }));
    blockEntity3.addComponent(new ColorFacet({ color:  "#797AFF"}));
    blockEntity3.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity3.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity3.addComponent(new IdFacet({ id: '100' }));
    blockEntity3.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity3.addComponent(new NeighbourIdFacet({ neighbourId: 'first' }));


    const blockEntity4 = new Entity();
    ecs.engine.addEntity(blockEntity4);
    blockEntity4.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity4.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity4.addComponent(new ColorFacet({ color:  "#1C8493"}));
    blockEntity4.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity4.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity4.addComponent(new IdFacet({ id: '2' }));
    blockEntity4.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity4.addComponent(new IconFacet({ icon: <IoAccessibility/> }));
    blockEntity4.addComponent(new NeighbourIdFacet({ neighbourId: '1' }));

    const blockEntity5 = new Entity();
    ecs.engine.addEntity(blockEntity5);
    blockEntity5.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity5.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity5.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity5.addComponent(new ColorFacet({ color:  "#F6D143"}));
    blockEntity5.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity5.addComponent(new IconFacet({ icon: <IoAlarm/> }));
    blockEntity5.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity5.addComponent(new IdFacet({ id: '3' }));
    blockEntity5.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity5.addComponent(new NeighbourIdFacet({ neighbourId: '2' }));

    const blockEntity2 = new Entity();
    ecs.engine.addEntity(blockEntity2);
    blockEntity2.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity2.addComponent(new IdFacet({ id: '4' }));
    blockEntity2.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity2.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity6 = new Entity();
    ecs.engine.addEntity(blockEntity6);
    blockEntity6.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet' }));
    blockEntity6.addComponent(new TextTypeFacet({ type: TextTypes.HEADING }));
    blockEntity6.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity6.addComponent(new IdFacet({ id: '5' }));
    blockEntity6.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity6.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity7 = new Entity();
    ecs.engine.addEntity(blockEntity7);
    blockEntity7.addComponent(
      new TextFacet({
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      }),
    );
    blockEntity7.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
    blockEntity7.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity7.addComponent(new IdFacet({ id: '6' }));
    blockEntity7.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity7.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity100 = new Entity();
    ecs.engine.addEntity(blockEntity100);
    blockEntity100.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity100.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity100.addComponent(new ParentFacet({ parentId: '100' }));
    blockEntity100.addComponent(new ColorFacet({ color:  "#F6D143"}));
    blockEntity100.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity100.addComponent(new IconFacet({ icon: <IoBeaker/> }));
    blockEntity100.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity100.addComponent(new IdFacet({ id: '3' }));
    blockEntity100.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity100.addComponent(new NeighbourIdFacet({ neighbourId: '2' }));
 

    const blockEntity8 = new Entity();
    ecs.engine.addEntity(blockEntity8);
    blockEntity8.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet',}),);
    blockEntity8.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
    blockEntity8.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity8.addComponent(new TodoFacet({ state: 2 }));
    blockEntity8.addComponent(new IdFacet({ id: '7' }));
    blockEntity8.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity8.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity9 = new Entity();
    ecs.engine.addEntity(blockEntity9);
    blockEntity9.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet',}),);
    blockEntity9.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
    blockEntity9.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity9.addComponent(new TodoFacet({ state: 1 }));
    blockEntity9.addComponent(new IdFacet({ id: '8' }));
    blockEntity9.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity9.addComponent(new ParentFacet({ parentId: '1' }));


    const blockEntity11 = new Entity();
    ecs.engine.addEntity(blockEntity11);
    blockEntity11.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity11.addComponent(new IdFacet({ id: '10' }));
    blockEntity11.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity11.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));


    const blockEntity10 = new Entity();
    ecs.engine.addEntity(blockEntity10);
    blockEntity10.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet',}),);
    blockEntity10.addComponent(new TypeFacet({ type: BlockTypes.CARD }));
    blockEntity10.addComponent(new IdFacet({ id: '9' }));
    blockEntity10.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity10.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity10.addComponent(new ColorFacet({ color:  "#FF7F3B"}));
    blockEntity10.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity12 = new Entity();
    ecs.engine.addEntity(blockEntity12);
    blockEntity12.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet',}),);
    blockEntity12.addComponent(new TypeFacet({ type: BlockTypes.CARD }));
    blockEntity12.addComponent(new IdFacet({ id: '9' }));
    blockEntity12.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity12.addComponent(new IsSmallBlockFacet({ isSmall: true }));
    blockEntity12.addComponent(new ColorFacet({ color:  "#608AFF"}));
    blockEntity12.addComponent(new ParentFacet({ parentId: '1' }));


    const blockEntity13 = new Entity();
    ecs.engine.addEntity(blockEntity13);
    blockEntity13.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity13.addComponent(new IdFacet({ id: '13' }));
    blockEntity13.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity13.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));

    const blockEntity14 = new Entity();
    ecs.engine.addEntity(blockEntity14);
    blockEntity14.addComponent(new TypeFacet({ type: BlockTypes.PAGE }));
    blockEntity14.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit',}),);
    blockEntity14.addComponent(new IdFacet({ id: '14' }));
    blockEntity14.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity14.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));

    const blockEntity15 = new Entity();
    ecs.engine.addEntity(blockEntity15);
    blockEntity15.addComponent(new TypeFacet({ type: BlockTypes.PAGES }));
    blockEntity15.addComponent(new IdFacet({ id: '15' }));
    blockEntity15.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity15.addComponent(new NeighbourIdFacet({ neighbourId: '3' }));
    blockEntity15.addComponent(new TextFacet({ text: 'Lorem ipsum dolor ',}),);

    const blockEditor = new Entity();
    ecs.engine.addEntity(blockEditor);
    blockEditor.addComponent(new IsEditingFacet({ isEditing: false }));
    blockEditor.addComponent(new IdFacet({ id: "1" }));
    blockEditor.addTag(Tags.IS_EDITING);

    const editMenu = new Entity();
    ecs.engine.addEntity(editMenu);
    editMenu.addComponent(new CurrentTextTypeFacet({ textType: TextTypes.TEXT }));
    editMenu.addComponent(new CurrentBlockTypeFacet({ blockType: BlockTypes.TEXT }));
    editMenu.addComponent(new IdFacet({ id: uuid() }));

    return () => {
      ecs.engine.removeEntity(editMenu);
      ecs.engine.removeEntity(blockEntity2);
      ecs.engine.removeEntity(blockEntity3);
      ecs.engine.removeEntity(blockEntity4);
      ecs.engine.removeEntity(blockEntity5);
      ecs.engine.removeEntity(blockEntity6);
      ecs.engine.removeEntity(blockEntity7);
      ecs.engine.removeEntity(blockEntity8);
      ecs.engine.removeEntity(blockEntity9);
      ecs.engine.removeEntity(blockEntity10);
      ecs.engine.removeEntity(blockEntity11);
      ecs.engine.removeEntity(blockEntity12);
      ecs.engine.removeEntity(blockEntity13);
      ecs.engine.removeEntity(blockEntity14);
      ecs.engine.removeEntity(blockEntity15);
      ecs.engine.removeEntity(blockEditor);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
