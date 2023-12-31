import {
  ECS,
  ECSContext,
  Entity,
  EntityProps,
  useEntities,
  useEntity,
  useEntityComponents,
  useEntityHasTags,
} from '@leanscope/ecs-engine';
import React, { SetStateAction, useContext, useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Theme, Themes } from '../../Theme';
import { IoReader } from 'react-icons/io5';
import { v4 as uuid } from 'uuid';
import { TextTypes, TypeFacet, BlockTypes, TextTypeFacet, CurrentTextTypeFacet, TodoFacet, CurrentBlockTypeFacet, ColorFacet, IconNameFacet } from '@leanscope/ecs-models';
import { StyleTypes, Tags } from '../../../base/Constants';

const getCurrentTextType = (pressedBlockEntities: readonly Entity[], editMenuEntity: Entity) => {
  let textType: TextTypes | undefined = undefined;
  pressedBlockEntities.map((entity) => {
    if (entity.get(TypeFacet)?.props.type == BlockTypes.TEXT && textType == undefined) {
      textType = entity.get(TextTypeFacet)?.props.type;
      console.log('type', entity.get(TextTypeFacet)?.props.type);
    }
  });
  if (textType) {
    editMenuEntity.addComponent(new CurrentTextTypeFacet({ textType: textType }));
  }
};

// const hasStyleType = (styleType: StyleTypes, pressedBlockEntities: readonly Entity[]) => {

// };

const addstyle = (
  styleType: StyleTypes,
  currentStyleType: StyleTypes | undefined,
  pressedBlockEntities: readonly Entity[],
  setCurrentStyleType: React.Dispatch<SetStateAction<StyleTypes | undefined>>,
) => {
  pressedBlockEntities.map((block) => {
    switch (styleType) {
      case StyleTypes.TODO:
        if (styleType === currentStyleType) {
          block.add(new TodoFacet({ state: 0 }));
          setCurrentStyleType(undefined);
        } else {
          block.addComponent(new TodoFacet({ state: 1 }));
          block.remove(StyleTypes.LIST);
          setCurrentStyleType(StyleTypes.TODO);
        }
        break;
      case StyleTypes.BLOCK:
        if (styleType === currentStyleType) {
          block.removeTag(StyleTypes.BLOCK);
          setCurrentStyleType(undefined);
        } else {
          block.add(StyleTypes.BLOCK);
          setCurrentStyleType(StyleTypes.BLOCK);
        }
        break;
      case StyleTypes.LIST:
        if (styleType === currentStyleType) {
          block.removeTag(StyleTypes.LIST);
          setCurrentStyleType(undefined);
        } else {
          block.add(StyleTypes.LIST);
          setCurrentStyleType(StyleTypes.LIST);
          block.add(new TodoFacet({ state: 0 }));
        }
        break;
    }
  });
};

const changeTextType = (
  type: TextTypes,
  pressedBlockEntities: readonly Entity[],
  editMenuEntity: Entity,
) => {
  pressedBlockEntities.map((entity) => {
    entity.addComponent(new TextTypeFacet({ type: type }));
    entity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
  });
  editMenuEntity.addComponent(new CurrentTextTypeFacet({ textType: type }));
  editMenuEntity.addComponent(new CurrentBlockTypeFacet({ blockType: BlockTypes.TEXT }));
};

const changeBlockType = (
  type: BlockTypes,
  pressedBlockEntities: readonly Entity[],
  editMenuEntity: Entity,
) => {
  pressedBlockEntities.map((entity) => {
    entity.addComponent(new TypeFacet({ type: type }));
    let randomNumber = Math.floor(Math.random() * 15) + 1;

    switch (type) {
      case BlockTypes.CARD:
        entity.addComponent(new ColorFacet({ colorName: Theme(Themes[randomNumber]) }));
        entity.addComponent(new IconNameFacet({ iconName: "<IoReader />" }));
        entity.addComponent(new TodoFacet({ state: 0 }));

        entity.remove(StyleTypes.LIST);

        break;
      case BlockTypes.MORE_INFORMATIONS:
        
        entity.addComponent(new ColorFacet({ colorName: Theme(Themes[randomNumber]) }));
        entity.addComponent(new IconNameFacet({ iconName: "<IoReader />" }));
        entity.addComponent(new TodoFacet({ state: 0 }));
        entity.remove(StyleTypes.LIST);
        break;
    }

    // if (
    //   type == BlockTypes.CARD ||
    //   type == BlockTypes.MORE_INFORMATIONS ||
    //   type == BlockTypes.PAGE
    // ) {
    //   const newBlockEntity = new Entity();
    //   ecs.engine.addEntity(newBlockEntity);
    //   newBlockEntity.addComponent(new TextFacet({ text: '' }));
    //   newBlockEntity.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
    //   newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    //   newBlockEntity.addComponent(new IdentifierFacet({ guid: uuid() }));
    //   newBlockEntity.addComponent(new OrderFacet({ index: 1 }));
    //   newBlockEntity.addComponent(
    //     new ParentFacet({ parentId: entity.get(IdentifierFacet)?.props.id || '1' }),
    //   );
    //   newBlockEntity.addTag(Tags.FOCUSED);
    // }
  });
  // editMenuEntity.addComponent(new CurrentTextTypeFacet({ textType: type }));
  editMenuEntity.addComponent(new CurrentBlockTypeFacet({ blockType: type }));

  return <></>;
};

interface TypeOptionProps {
  changeType: () => void;
  currentType: any;
  type: any;
  customTextStyle?: any;
}

const TypeOption: React.FC<TypeOptionProps> = ({
  changeType,
  currentType,
  type,
  customTextStyle,
}) => {
  return (
    <div
      onClick={changeType}
      style={{ ...customTextStyle }}
      className={` py-2 items-center rounded-lg px-4 w-full flex border justify-center ${
        currentType == type ? 'text-blue  bg-blue-light border-blue' : ' border-white'
      } ${customTextStyle ? '' : 'text-sm '} `}
    >
      {type}
    </div>
  );
};

interface StyleOptionsProps {
  styleType: StyleTypes;
  isCurrentStyleType: boolean;
}

const StyleOption: React.FC<StyleOptionsProps> = ({ styleType, isCurrentStyleType }) => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [currentStyleType, setCurrentStyleType] = useState<StyleTypes | undefined >(isCurrentStyleType && styleType || undefined );

  useEffect(() => {
    if (isCurrentStyleType) {
      setCurrentStyleType(styleType);
    }
  }, [isCurrentStyleType]);
 
  return (
    <TypeOption
      changeType={() => {
        addstyle(styleType, currentStyleType, pressedBlockEntities, setCurrentStyleType);
      }}
      type={styleType}
      currentType={currentStyleType}
    />
  );
};

interface TextTypeProps {
  textType: TextTypes;
}

const TextTypeOption: React.FC<TextTypeProps> = ({ textType }) => {
  const [editMenuEntities] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [editMenuOptions] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [currentTextTypeFacet] = useEntityComponents(editMenuOptions[0], CurrentTextTypeFacet);
  const currentTextType = currentTextTypeFacet?.props.textType;
  const [currentBlockTypeFacet] = useEntityComponents(editMenuOptions[0], CurrentBlockTypeFacet);
  const currentBlockType = currentBlockTypeFacet?.props.blockType;

  const textStyle = {
    // color: formatting.colorName,
    fontWeight:
      textType === TextTypes.TITLE
        ? 'bold'
        : textType === TextTypes.SUBTITLE
        ? 'bold'
        : textType === TextTypes.HEADING
        ? 'bold'
        : textType === TextTypes.BOLD
        ? 'bold'
        : textType === TextTypes.NORMAL
        ? 'normal'
        : textType === TextTypes.CAPTION
        ? 'normal'
        : 'normal',
    fontSize:
      textType === TextTypes.TITLE
        ? '1.1em'
        : textType === TextTypes.SUBTITLE
        ? '1em'
        : textType === TextTypes.HEADING
        ? '0.9em'
        : textType === TextTypes.BOLD
        ? '0.9em'
        : textType === TextTypes.NORMAL
        ? '0.9em'
        : textType === TextTypes.CAPTION
        ? '0.8em'
        : '1em',
  };

  return (
    <TypeOption
      customTextStyle={textStyle}
      changeType={() => {
        changeTextType(textType, pressedBlockEntities, editMenuEntities[0]);
      }}
      type={textType}
      currentType={currentBlockType === BlockTypes.TEXT && currentTextType}
    />
  );
};

interface BlockTypeOptionProps {
  blockType: BlockTypes;
}
const BlockTypeOption: React.FC<BlockTypeOptionProps> = ({ blockType }) => {
  const [editMenuEntities] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [editMenuOptions] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [currentBlockTypeFacet] = useEntityComponents(editMenuOptions[0], CurrentBlockTypeFacet);
  const currentBlockType = currentBlockTypeFacet?.props.blockType;
  const ecs = useContext(ECSContext);

  return (
    <TypeOption
      changeType={() => {
        changeBlockType(blockType, pressedBlockEntities, editMenuEntities[0]);
      }}
      type={blockType}
      currentType={currentBlockType}
    />
  );
};

const StyleOptions = (props: EntityProps) => {
  const isVisible = useEntityHasTags(props.entity, Tags.IS_EDITING)
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [editMenuEntities] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [isMoreTextOptionsVisible, setIsMoreTextOptionsVisible] = useState(false);
  const [isTodo, setIsTodo] = useState(false);
  const [isList, setIsList] = useState(false);
  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    getCurrentTextType(pressedBlockEntities, editMenuEntities[0]);
  }, [pressedBlockEntities.length]);

  useEffect(() => {
    setIsMoreTextOptionsVisible(false);
  }, [isVisible]);

  useEffect(() => {
    checkIsTodo();
    checkIsList()
    checkIsBlock( )
  }, [pressedBlockEntities[0]?.get(TodoFacet)?.props.state]);

  const checkIsTodo = () => {
    const todoState = pressedBlockEntities[0]?.get(TodoFacet)?.props.state || 0;
    if (todoState >= 1) setIsTodo(true);
  };

  const checkIsList = () => {
    // setIsList(pressedBlockEntities[0].hasTag(StyleTypes.LIST))
  };

  const checkIsBlock = () => {
  //  setIsBlock(pressedBlockEntities[0].hasTag(StyleTypes.BLOCK))
  };

  return (
    <>
      <div className="flex  w-full  overflow-x-scroll  h-16 my-1 items-center justify-between px-3  ">
        <TextTypeOption textType={TextTypes.HEADING} />
        <TextTypeOption textType={TextTypes.NORMAL} />
        <BlockTypeOption blockType={BlockTypes.CARD} />
        <div
          onClick={() => {
            setIsMoreTextOptionsVisible(true);
          }}
          className={` text-sm py-2 rounded-lg px-4 w-full flex border justify-center border-white `}
        >
          Mehr
        </div>
      </div>
      <div className="flex w-full   space-x-2 overflow-x-scroll  py-4 border-t  border-[rgb(245,245,245)]  justify-between   ">
        <StyleOption isCurrentStyleType={isTodo} styleType={StyleTypes.TODO} />
        <StyleOption isCurrentStyleType={isList} styleType={StyleTypes.LIST} />
        <StyleOption isCurrentStyleType={isBlock} styleType={StyleTypes.BLOCK} />
      </div>

      <div className="  flex w-screen fixed z-40 left-0 justify-center">
        <motion.div
          transition={{ type: 'Tween' }}
          animate={{ y: isMoreTextOptionsVisible ? 0 : 600 }}
          initial={{ y: 600 }}
          className="bg-white h-44 rounded-lg px-4 md:w-[32rem]  w-11/12  fixed bottom-8 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
          drag="y"
          dragConstraints={{ top: 0, bottom: 200 }}
          onDragEnd={(event, info) => {
            console.log(event);
            if (info.offset.y >= 1) setIsMoreTextOptionsVisible(false);
          }}
        >
          <div className="w-full flex justify-center">
            <div className="w-8 mt-1.5 h-1 rounded-full  bg-input-white-bg" />
          </div>

          <div className="flex w-full  overflow-x-scroll justify-between py-1.5 ">
            <TextTypeOption textType={TextTypes.TITLE} />
            <TextTypeOption textType={TextTypes.SUBTITLE} />
            <TextTypeOption textType={TextTypes.HEADING} />
          </div>
          <div className="flex w-full  overflow-x-scroll  py-1.5 border-t  border-[rgb(245,245,245)]  justify-between   ">
            <TextTypeOption textType={TextTypes.BOLD} />
            <TextTypeOption textType={TextTypes.NORMAL} />
            <TextTypeOption textType={TextTypes.CAPTION} />
          </div>
          <div className="flex w-full  overflow-x-scroll  py-1.5 border-t  border-[rgb(245,245,245)]  justify-between   ">
            <BlockTypeOption blockType={BlockTypes.PAGE} />
            <BlockTypeOption blockType={BlockTypes.CARD} />
            <BlockTypeOption blockType={BlockTypes.MORE_INFORMATIONS} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default StyleOptions;
