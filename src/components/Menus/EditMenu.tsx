import {
  ECSContext,
  Entity,
  useEntities,
  useEntity,
  useEntityComponents,
} from '@leanscope/ecs-engine';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import {
  FurtherFacet,
  IdFacet,
  IsEditingFacet,
  ParentFacet,
  TextFacet,
  TypeFacet,
} from '../../app/BlockFacets';
import {
  IoArrowForwardCircle,
  IoArrowForwardCircleOutline,
  IoColorPalette,
  IoColorPaletteOutline,
  IoFlash,
  IoLayers,
  IoLayersOutline,
  IoShare,
  IoShareOutline,
  IoSparkles,
  IoSparklesOutline,
  IoTrash,
  IoTrashOutline,
} from 'react-icons/io5';
import StyleOptions from './EditMenu/StyleOptions';
import { BlockTypes, Tags } from '../../base/Constants';
import DestructiveActionSheet from '../StyleLibary/DestructiveActionSheet';
import LayoutOptions from './EditMenu/LayoutOptions';
import { v4 as uuid } from 'uuid';
import CardOptions from './EditMenu/CardOptions';
import KIChatBox from './InputBar/KIChatBox';
import BlockAIMenu from './BlockAIMenu';

type option = {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  content?: React.ReactNode;
  customFunc?: () => void;
  isLarge?: boolean;
};

interface EditOptionProps {
  option: option;
  isVisible: boolean;
  canShow: boolean ;
}
const EditOption: React.FC<EditOptionProps> = ({ option, isVisible, canShow }) => {
  const { name, icon, color, bgColor, content, customFunc, isLarge } = option;
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  useEffect(() => {
    setIsOptionsVisible(false);
  }, [isVisible]);

  return (
    <>
      {canShow && (
        <div
          className={`w-full hover:opacity-80 transition-all  min-w-[4rem] p-2 bg-opacity-10 h-18 text-whitee rounded-lg mr-0 m-1 `}
          style={{ color: color, backgroundColor: bgColor, maxWidth: '10rem' }} // Max width set to 10rem
          onClick={() => {
            setIsOptionsVisible(true);
            if (customFunc) {
              customFunc();
            }
          }}
        >
          <div className="text-2xl flex justify-center mt-2"> {icon}</div>
          <p className="text-xs mt-1 opacity-60 w-full text-center font-light">{name}</p>
        </div>
      )}

      {isVisible && (
        <div className="w-screen left-0 fixed flex justify-center z-40">
          <motion.div
            transition={{ type: 'Tween' }}
            animate={{ y: isOptionsVisible && isVisible && content ? 0 : 300 }}
            initial={{ y: 200 }}
            className={`bg-white z-40 rounded-lg  md:w-[31rem] px-4 w-11/12  fixed bottom-7 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)] ${
              isLarge ? ' h-60' : ' h-40'
            }`}
            drag="y"
            dragConstraints={{ top: 0, bottom: 200 }}
            onDragEnd={(event, info) => {
              console.log(event);
              if (info.offset.y >= 1) setIsOptionsVisible(false);
            }}
          >
            <div className="w-full flex justify-center">
              <div className="w-8 mt-1.5 h-1 rounded-full  bg-input-white-bg" />
            </div>
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
};

const EditMenu = (props: EntityProps) => {
  const ecs = useContext(ECSContext);
  const [isEditingFacet] = useEntityComponents(props.entity, IsEditingFacet);
  const isVisible = isEditingFacet.props.isEditing;
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [isDeleteSheetVisible, setIsDeleteSheetVisible] = useState(false);
  const [blockEntities] = useEntities((e) => e.has(TypeFacet));

  const handleDeleteClick = () => {
    pressedBlockEntities.map((entiy) => {
      ecs.engine.removeEntity(entiy);
    });
    pressedBlockEntities.map((entiy) => {
      ecs.engine.removeEntity(entiy);
    });
    pressedBlockEntities.map((entiy) => {
      ecs.engine.removeEntity(entiy);
    });
  };

  const handleAddContent = () => {
    blockEntities.map((block) => {
      if (block.hasTag(Tags.PRESSED)) {
        block.addComponent(new TypeFacet({ type: BlockTypes.PAGE }));
        block.addComponent(new FurtherFacet({ isGoingFurther: true }));
      }
    });
  };

  const handleGroupContent = () => {
    let newParentId: string | undefined = '';
    let currentParentId: string | undefined = '';
    let newText: string | undefined = '';

    blockEntities.map((block) => {
      if (block.hasTag(Tags.PRESSED)) {
        if (newParentId === '') {
          currentParentId = block.get(ParentFacet)?.props.parentId;
          newParentId = block.get(IdFacet)?.props.id;
        }
        if (newText === '') {
          newText = block.get(TextFacet)?.props.text;
        }
      }
    });

    blockEntities.map((block) => {
      if (block.hasTag(Tags.PRESSED) && newParentId) {
        block.addComponent(new ParentFacet({ parentId: newParentId }));
      }
    });

    const newBlockEntity = new Entity();
    ecs.engine.addEntity(newBlockEntity);
    newBlockEntity.addComponent(new ParentFacet({ parentId: currentParentId }));
    newBlockEntity.addComponent(new IdFacet({ id: newParentId }));
    newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.PAGE }));
    newBlockEntity.addComponent(
      new TextFacet({ text: newText == undefined ? 'Seitentitel' : newText }),
    );
  };

  const checkCanActivateLayout = () => {
    let canActivateLayout = true;
    pressedBlockEntities.map((block) => {
      const type = block.get(TypeFacet)?.props.type;
      if (type !== BlockTypes.IMAGE) {
        canActivateLayout = false;
      }
    });
    return canActivateLayout;
  };

  const checkCanActivateStyle = () => {
    let canActivateStyle = true;
    pressedBlockEntities.map((block) => {
      const type = block.get(TypeFacet)?.props.type;
      if (type !== BlockTypes.TEXT && type !== BlockTypes.PAGE) {
        canActivateStyle = false;
      }
    });
    return canActivateStyle;
  };

  const checkCanActivateCardStyle = () => {
    let canActivateCardStyle = true;
    pressedBlockEntities.map((block) => {
      const type = block.get(TypeFacet)?.props.type;
      if (type !== BlockTypes.CARD && type !== BlockTypes.MORE_INFORMATIONS) {
        canActivateCardStyle = false;
      }
    });
    return canActivateCardStyle;
  };

  const checkCanAddContent = () => {
    let canAddContent = true;
    if (pressedBlockEntities.length > 1) {
      canAddContent = false;
    }
    pressedBlockEntities.map((block) => {
      const type = block.get(TypeFacet)?.props.type;
      if (type !== BlockTypes.TEXT) {
        canAddContent = false;
      }
    });
    return canAddContent;
  };

  const checkCanGroupContent = () => {
    let canGroupContent = false;
    if (pressedBlockEntities.length > 1) {
      canGroupContent = true;
    }
    return canGroupContent;
  };

  const checkCanUseAI = () => {
    let canUseAI = true;
    pressedBlockEntities.map((block) => {
      const type = block.get(TypeFacet)?.props.type;
      if (type == BlockTypes.IMAGE) {
        canUseAI = false;
      }
    });
    return canUseAI;
  };

  const toggleIsDeleteSheetVisible = () => {
    setIsDeleteSheetVisible(!isDeleteSheetVisible);
  };
  const [editOptions, setEditOptions] = useState([
    {
      name: 'Stil',
      icon: <IoColorPalette />,
      color: '#8547F0',
      bgColor: 'rgba(133, 71, 240, 0.1)',
      content: <StyleOptions entity={props.entity} />,
      canShow: checkCanActivateStyle,
    },
    {
      name: 'Card Stil',
      icon: <IoColorPalette />,
      color: '#8547F0',
      bgColor: 'rgba(133, 71, 240, 0.1)',
      content: <CardOptions />,
      canShow: checkCanActivateCardStyle,
    },
    {
      name: 'Layout',
      icon: <IoLayers />,
      color: '#797AFF',
      bgColor: 'rgba(121, 122, 255, 0.1)',
      content: <LayoutOptions />,
      canShow: checkCanActivateLayout,
    },
    {
      name: '+ Inhalt',
      icon: <IoArrowForwardCircleOutline />,
      color: '#608AFF',
      bgColor: 'rgba(96, 138, 255, 0.1)',
      customFunc: handleAddContent,
      canShow: checkCanAddContent,
    },
    {
      name: 'Gruppe',
      icon: <IoArrowForwardCircleOutline />,
      color: '#FF7F3B',
      bgColor: 'rgba(255, 127, 59, 0.1)',
      customFunc: handleGroupContent,
      canShow: checkCanGroupContent,
    },
    {
      name: 'Aktionen',
      icon: <IoShareOutline />,
      color: '#1C8493',
      bgColor: 'rgba(28, 132, 147, 0.1)',
      canShow: ()=> {return true},
    },
    {
      name: 'Block AI',
      icon: <IoFlash />,
      color: '#EC76CB',
      bgColor: 'rgba(236, 118, 203, 0.1)',
      content: <BlockAIMenu isVisible={isVisible} />,
      isLarge: true,
      canShow: checkCanUseAI,
    },
    {
      name: 'Löschen',
      icon: <IoTrash />,
      color: '#FF5355',
      bgColor: 'rgba(255, 83, 85, 0.1)',
      customFunc: toggleIsDeleteSheetVisible,
      canShow: ()=> {return true},
    },
  
  ]);

  return (
    <>
      <div className="w-full flex justify-center">
        <motion.div
          transition={{ type: 'Tween' }}
          animate={{ y: !isVisible ? 200 : 0 }}
          initial={{ y: 200 }}
          className="bg-white h-20 overflow-y-clip  rounded-lg pr-1 flex over md:overflow-hidden  w-11/12 md:w-[30rem] fixed bottom-6 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
        >
          <div className="flex overflow-x-scroll w flex-auto">
            {editOptions.map((option) => (
              <EditOption canShow={option.canShow()} isVisible={isVisible} option={option} />
            ))}
          </div>
        </motion.div>
      </div>

      <DestructiveActionSheet
        isVisible={isDeleteSheetVisible && isVisible}
        setIsVisible={setIsDeleteSheetVisible}
        deleteFunc={handleDeleteClick}
        length={pressedBlockEntities.length}
      />
    </>
  );
};

export default EditMenu;
