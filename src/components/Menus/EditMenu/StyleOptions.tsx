import { Entity, useEntities, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useState } from 'react';
import {
  CurrentTextTypeFacet,
  IsEditingFacet,
  TextTypeFacet,
  TypeFacet,
} from '../../../app/BlockFacets';
import { BlockTypes, Tags, TextTypes } from '../../../base/Constants';
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
  if (textType){
    editMenuEntity.addComponent(new CurrentTextTypeFacet({textType: textType}))
  }
console.log(textType)
};

const changeTextType = (type: TextTypes, pressedBlockEntities: readonly Entity[], editMenuEntity: Entity) => {
  pressedBlockEntities.map((entity) => {
    entity.addComponent(new TextTypeFacet({ type: type }));
  });
  editMenuEntity.addComponent(new CurrentTextTypeFacet({textType: type}))
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
      className={` py-2 items-center rounded-lg px-4 w-1/4 flex border justify-center ${
        currentType == type ? 'text-blue  bg-blue-light border-blue' : ' border-white'
      } ${customTextStyle ? '' : 'text-sm '} `}
    >
      {type}
    </div>
  );
};

interface TextTypeProps {
  textType: TextTypes;
}

const TextTypeOption: React.FC<TextTypeProps> = ({ textType }) => {
  const [editMenuEntities] = useEntities((e) => e.has(CurrentTextTypeFacet))
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [editMenuOptions] = useEntities((e) => e.has(CurrentTextTypeFacet));
  const [currentTextTypeFacet] = useEntityComponents(editMenuOptions[0], CurrentTextTypeFacet);
  const currentTextType = currentTextTypeFacet.props.textType;
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
        ? '1.2em'
        : textType === TextTypes.SUBTITLE
        ? '1.05em'
        : textType === TextTypes.HEADING
        ? '1em'
        : textType === TextTypes.BOLD
        ? '0.95em'
        : textType === TextTypes.TEXT
        ? '0.95em'
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
      currentType={currentTextType}
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
      <div className="flex w-full h-14 items-center justify-between px-3  ">
        <TextTypeOption textType={TextTypes.HEADING} />
        <TextTypeOption textType={TextTypes.TEXT} />
        <div
          onClick={() => {
            setIsMoreTextOptionsVisible(true);
          }}
          className={`font-semibold text-sm py-2 rounded-lg px-4 w-1/4 flex border justify-center border-white `}
        >
          Mehr
        </div>
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
            if (info.offset.y >= 1) setIsMoreTextOptionsVisible(false);
          }}
        >
          <div className="w-full flex justify-center">
            <div className="w-8 mt-1.5 h-1 rounded-full  bg-input-white-bg" />
          </div>

          <div className="flex  justify-between py-4 mt-1.5 ">
            <TextTypeOption textType={TextTypes.TITLE} />
            <TextTypeOption textType={TextTypes.SUBTITLE} />
            <TextTypeOption textType={TextTypes.HEADING} />
          </div>
          <div className="flex  py-4 border-t  border-[rgb(245,245,245)]  justify-between   ">
            <TextTypeOption textType={TextTypes.BOLD} />
            <TextTypeOption textType={TextTypes.TEXT} />
            <TextTypeOption textType={TextTypes.CAPTION} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default StyleOptions;
