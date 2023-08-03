import { Entity, useEntities, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import React, { SetStateAction, useEffect, useState } from 'react';
import {
  CurrentBlockTypeFacet,
  CurrentTextTypeFacet,
  IsEditingFacet,
  IsSmallBlockFacet,
  TextTypeFacet,
  TodoFacet,
  TypeFacet,
} from '../../../app/BlockFacets';
import { BlockTypes, StyleTypes, Tags, TextTypes } from '../../../base/Constants';
import { motion } from 'framer-motion';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';

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
  console.log(textType);
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
          setCurrentStyleType(StyleTypes.TODO);
        }
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
    entity.addComponent(new IsSmallBlockFacet({ isSmall: false }));
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
    entity.addComponent(new IsSmallBlockFacet({ isSmall: true }));
  });
  // editMenuEntity.addComponent(new CurrentTextTypeFacet({ textType: type }));
  editMenuEntity.addComponent(new CurrentBlockTypeFacet({ blockType: type }));
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
  getCurrentStyleType: () => StyleTypes | undefined;
}

const StyleOption: React.FC<StyleOptionsProps> = ({ styleType, getCurrentStyleType }) => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [currentStyleType, setCurrentStyleType] = useState(getCurrentStyleType());

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
  const currentTextType = currentTextTypeFacet.props.textType;
  const [currentBlockTypeFacet] = useEntityComponents(editMenuOptions[0], CurrentBlockTypeFacet);
  const currentBlockType = currentBlockTypeFacet.props.blockType;

  const textStyle = {
    // color: formatting.color,
    fontWeight:
      textType === TextTypes.TITLE
        ? 'bold'
        : textType === TextTypes.SUBTITLE
        ? 'bold'
        : textType === TextTypes.HEADING
        ? 'bold'
        : textType === TextTypes.BOLD
        ? 'bold'
        : textType === TextTypes.TEXT
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
        : textType === TextTypes.TEXT
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
  const currentBlockType = currentBlockTypeFacet.props.blockType;

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
  const [isEditingFacet] = useEntityComponents(props.entity, IsEditingFacet);
  const isVisible = isEditingFacet.props.isEditing;
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [editMenuEntities] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [isMoreTextOptionsVisible, setIsMoreTextOptionsVisible] = useState(false);

  useEffect(() => {
    getCurrentTextType(pressedBlockEntities, editMenuEntities[0]);
  }, [pressedBlockEntities.length]);

  useEffect(() => {
    setIsMoreTextOptionsVisible(false);
  }, [isVisible]);

  return (
    <>
      <div className="flex  w-full  overflow-x-scroll  h-14 items-center justify-between px-3  ">
        <TextTypeOption textType={TextTypes.HEADING} />
        <TextTypeOption textType={TextTypes.TEXT} />
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
      <div className="flex w-full  overflow-x-scroll  py-1.5 border-t  border-[rgb(245,245,245)]  justify-between   ">
        <StyleOption
          getCurrentStyleType={() => {
            console.log('check');
            let styleType: StyleTypes | undefined = undefined;

            pressedBlockEntities.map((entity) => {
              if (
                entity.get(TodoFacet)?.props.state !== 0 &&
                entity.get(TodoFacet)?.props.state !== undefined
              ) {
                styleType = StyleTypes.TODO;
              }
            });
            return styleType;
          }}
          styleType={StyleTypes.TODO}
        />
      </div>

      <div className="  md:relative fixed z-40 md:right-[0.5rem]">
        <motion.div
          transition={{ type: 'Tween' }}
          animate={{ y: isMoreTextOptionsVisible ? 0 : 350 }}
          initial={{ y: 200 }}
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
            <TextTypeOption textType={TextTypes.TEXT} />
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
