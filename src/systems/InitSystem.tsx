import { useContext, useEffect, useState } from 'react';
import { Tags } from '../base/Constants';
import { ECSContext, Entity, System } from '@leanscope/ecs-engine';
import {
  TextFacet,
  ColorFacet,
  OrderFacet,
  IdentifierFacet,
  TextTypeFacet,
  BlockTypes,
  TypeFacet,
  ParentFacet,
  CurrentBlockTypeFacet,
  CurrentTextTypeFacet,
  DescriptionFacet,
  TextTypes,
  TodoFacet,
  IconNameFacet,
  getEntityData,
} from '@leanscope/ecs-models';
import { v4 as uuid } from 'uuid';
import {
  IoAccessibility,
  IoAlarm,
  IoAlert,
  IoAnalytics,
  IoApps,
  IoBeaker,
  IoPaperPlane,
} from 'react-icons/io5';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kqavwhzfqnzndxrqlrea.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxYXZ3aHpmcW56bmR4cnFscmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0ODMyODYsImV4cCI6MjAwOTA1OTI4Nn0.HoHVCtAfZNXQQkbuZ25aIvKNy1-zCuzNkEutbkEe4CM',
);

const InitSystem = () => {
  const ecs = useContext(ECSContext);

  // async function getId() {
  //   let { error } = await supabase.from('text_facets').insert({ text: 'hallo2' });
  //   if (error) {
  //     console.error('data, Error fetching user data:', error.message);
  //   }
  // }
  // getId();

  // const findRecordingTags = mapTagStringNamesToTagsEnumIds([
  //   Tags[Tags.RECORDING],

  //   Tags[Tags.CURRENT],
  // ]);

  // async function getEntities() {
  //   const { data, error } = await supabase.rpc('query_entities', {
  //     has_entity_guids: [],

  //     has_tags: [],

  //     has_facet_names: [TypeFacet.name],
  //   });
  //   return data;
  // }

  // const entities = getEntities();
  // console.log(entities);

  // async function saveEntity(entity: Entity) {
  //   const entityGuid = entity.get(IdentifierFacet)?.props.guid;
  //   console.log(entityGuid);
  //   const entityData = getEntityData(entity);
  //   entityData._entity_guid = entityGuid;
  //   console.log('entityData', entityData);
  //   await supabase
  //     .rpc('upsert_entity', {
  //       entity: entityData,
  //     })
  //     .then((result) => {
  //       if (result.error) {
  //         console.error('Cannot save Entity to DB: ', JSON.stringify(result.error));
  //         return;
  //       }
  //     });
  // }

  // Order Facet
  useEffect(() => {
    console.log('app init');
    ecs.engine.clear();

    const blockEntity3 = new Entity();
    ecs.engine.addEntity(blockEntity3);
    blockEntity3.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity3.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity3.addComponent(new IconNameFacet({ iconName: 'Bett' }));
    blockEntity3.addComponent(new ColorFacet({ colorName: '#797AFF' }));
    blockEntity3.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity3.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity3.addComponent(new IdentifierFacet({ guid: 'guid' }));
    blockEntity3.addComponent(new OrderFacet({ index: 1 }));

    // saveEntity(blockEntity3);

    const blockEntity4 = new Entity();
    ecs.engine.addEntity(blockEntity4);
    blockEntity4.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity4.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity4.addComponent(new ColorFacet({ colorName: '#1C8493' }));
    blockEntity4.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity4.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity4.addComponent(new IdentifierFacet({ guid: '2' }));
    blockEntity4.addComponent(new IconNameFacet({ iconName: 'Flugzeug' }));
    blockEntity4.addComponent(new OrderFacet({ index: 2 }));

    const blockEntity5 = new Entity();
    ecs.engine.addEntity(blockEntity5);
    blockEntity5.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity5.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity5.addComponent(new ColorFacet({ colorName: '#F6D143' }));
    blockEntity5.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity5.addComponent(new IconNameFacet({ iconName: 'Uhr' }));
    blockEntity5.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity5.addComponent(new IdentifierFacet({ guid: '3' }));
    blockEntity5.addComponent(new OrderFacet({ index: 3 }));

    const blockEntity2 = new Entity();
    ecs.engine.addEntity(blockEntity2);
    blockEntity2.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity2.addComponent(new IdentifierFacet({ guid: '4' }));
    blockEntity2.addComponent(new OrderFacet({ index: 4 }));
    blockEntity2.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity6 = new Entity();
    ecs.engine.addEntity(blockEntity6);
    blockEntity6.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet' }));
    blockEntity6.addComponent(new TextTypeFacet({ type: TextTypes.HEADING }));
    blockEntity6.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity6.addComponent(new IdentifierFacet({ guid: '5' }));
    blockEntity6.addComponent(new OrderFacet({ index: 5 }));
    blockEntity6.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity7 = new Entity();
    ecs.engine.addEntity(blockEntity7);
    blockEntity7.addComponent(
      new TextFacet({
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      }),
    );
    blockEntity7.addComponent(new TextTypeFacet({ type: TextTypes.NORMAL }));
    blockEntity7.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity7.addComponent(new IdentifierFacet({ guid: '6' }));
    blockEntity7.addComponent(new OrderFacet({ index: 6 }));
    blockEntity7.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity100 = new Entity();
    ecs.engine.addEntity(blockEntity100);
    blockEntity100.addComponent(new TextFacet({ text: 'Toller Header' }));
    blockEntity100.addComponent(new ParentFacet({ parentId: '100' }));
    blockEntity100.addComponent(new ColorFacet({ colorName: '#F6D143' }));
    blockEntity100.addComponent(
      new DescriptionFacet({
        description:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      }),
    );
    blockEntity100.addComponent(new IconNameFacet({ iconName: 'Bett' }));
    blockEntity100.addComponent(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
    blockEntity100.addComponent(new IdentifierFacet({ guid: '66' }));

    blockEntity100.addComponent(new OrderFacet({ index: 1 }));

    const blockEntity8 = new Entity();
    ecs.engine.addEntity(blockEntity8);
    blockEntity8.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet' }));
    blockEntity8.addComponent(new TextTypeFacet({ type: TextTypes.NORMAL }));
    blockEntity8.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity8.addComponent(new TodoFacet({ state: 2 }));
    blockEntity8.addComponent(new IdentifierFacet({ guid: '7' }));
    blockEntity8.addComponent(new OrderFacet({ index: 7 }));
    blockEntity8.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity9 = new Entity();
    ecs.engine.addEntity(blockEntity9);
    blockEntity9.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet' }));
    blockEntity9.addComponent(new TextTypeFacet({ type: TextTypes.NORMAL }));
    blockEntity9.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    blockEntity9.addComponent(new TodoFacet({ state: 1 }));
    blockEntity9.addComponent(new IdentifierFacet({ guid: '8' }));
    blockEntity9.addComponent(new OrderFacet({ index: 8 }));
    blockEntity9.addComponent(new ParentFacet({ parentId: '1' }));

    const blockEntity11 = new Entity();
    ecs.engine.addEntity(blockEntity11);
    blockEntity11.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity11.addComponent(new IdentifierFacet({ guid: '10' }));
    blockEntity11.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity11.addComponent(new OrderFacet({ index: 9 }));

    const blockEntity10 = new Entity();
    ecs.engine.addEntity(blockEntity10);
    blockEntity10.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet' }));
    blockEntity10.addComponent(new TypeFacet({ type: BlockTypes.CARD }));
    blockEntity10.addComponent(new IdentifierFacet({ guid: '9' }));
    blockEntity10.addComponent(new OrderFacet({ index: 10 }));
    blockEntity10.addComponent(new ColorFacet({ colorName: '#FF7F3B' }));
    blockEntity10.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity10.addComponent(new IconNameFacet({ iconName: 'Alarm' }));

    const blockEntity12 = new Entity();
    ecs.engine.addEntity(blockEntity12);
    blockEntity12.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit amet' }));
    blockEntity12.addComponent(new TypeFacet({ type: BlockTypes.CARD }));
    blockEntity12.addComponent(new IdentifierFacet({ guid: '91' }));
    blockEntity12.addComponent(new OrderFacet({ index: 11 }));
    blockEntity12.addComponent(new ColorFacet({ colorName: '#608AFF' }));
    blockEntity12.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity12.addComponent(new IconNameFacet({ iconName: 'Uhr' }));

    const blockEntity13 = new Entity();
    ecs.engine.addEntity(blockEntity13);
    blockEntity13.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity13.addComponent(new IdentifierFacet({ guid: '13' }));
    blockEntity13.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity13.addComponent(new OrderFacet({ index: 12 }));

    const blockEntity14 = new Entity();
    ecs.engine.addEntity(blockEntity14);
    blockEntity14.addComponent(new TypeFacet({ type: BlockTypes.PAGE }));
    blockEntity14.addComponent(new TextFacet({ text: 'Lorem ipsum dolor sit' }));
    blockEntity14.addComponent(new IdentifierFacet({ guid: '14' }));
    blockEntity14.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity14.addComponent(new OrderFacet({ index: 13 }));

    const blockEntity15 = new Entity();
    ecs.engine.addEntity(blockEntity15);
    blockEntity15.addComponent(new TypeFacet({ type: BlockTypes.PAGES }));
    blockEntity15.addComponent(new IdentifierFacet({ guid: '15' }));
    blockEntity15.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity15.addComponent(new OrderFacet({ index: 14 }));
    blockEntity15.addComponent(new TextFacet({ text: 'Lorem ipsum dolor ' }));

    const blockEntity16 = new Entity();
    ecs.engine.addEntity(blockEntity16);
    blockEntity16.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
    blockEntity16.addComponent(new IdentifierFacet({ guid: '16' }));
    blockEntity16.addComponent(new ParentFacet({ parentId: '1' }));
    blockEntity16.addComponent(new OrderFacet({ index: 15 }));

    const blockEditor = new Entity();
    ecs.engine.addEntity(blockEditor);
    blockEditor.addComponent(new IdentifierFacet({ guid: '1' }));
    blockEditor.addComponent(new ParentFacet({ parentId: '1' }));
    blockEditor.addTag(Tags.BLOCK_EDITOR)

    const editMenu = new Entity();
    ecs.engine.addEntity(editMenu);
    editMenu.addComponent(new CurrentTextTypeFacet({ textType: TextTypes.NORMAL }));
    editMenu.addComponent(new CurrentBlockTypeFacet({ blockType: BlockTypes.TEXT }));
    editMenu.addComponent(new IdentifierFacet({ guid: uuid() }));

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
      ecs.engine.removeEntity(blockEntity16);
      ecs.engine.removeEntity(blockEditor);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
