
import { motion } from 'framer-motion';

import { IoClose, IoImage, IoRemove } from 'react-icons/io5';
import { useContext, useEffect, useRef, useState } from 'react';
import { ECS, ECSContext, Entity, useEntityHasTags } from '@leanscope/ecs-engine';
import { BlockTypes, TypeFacet, ParentFacet, Base64Facet, FitTypes, SizeFacet, SizeTypes, ImageFitFacet, ImageSizeFacet,  } from '@leanscope/ecs-models';
import { Tags } from '../../base/Constants';


type option = {
  blockType: BlockTypes;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

interface CreateOptionProps {
  isVisible: boolean;
  option: option;
  parentId: string;
  blockEditorEntity: Entity | undefined;
}

const CreateOption: React.FC<CreateOptionProps> = ({ option, parentId, blockEditorEntity }) => {
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { blockType, icon, color, bgColor } = option;
  const ecs = useContext(ECSContext);

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }, [isSelectingImageSrc]);

  const handleImageSelect = (event: any) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data == 'string') {
        createImageBlock(base64data);
      }
    };

    reader.readAsDataURL(selectedFile);
    setIsSelectingImageSrc(false);
    return '';
  };

  const openFilePicker = () => {
    setIsSelectingImageSrc(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const createImageBlock = (url: string) => {
    const newBlockEntity = new Entity();
    ecs.engine.addEntity(newBlockEntity);
    newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.IMAGE }));
    newBlockEntity.addComponent(new ParentFacet({ parentId: parentId }));
    newBlockEntity.addComponent(new Base64Facet({ data: url }));
    newBlockEntity.addComponent(new ImageFitFacet({ fit: FitTypes.AUTO_FIT }));
    newBlockEntity.addComponent(new ImageSizeFacet({ size: SizeTypes.AUTO_SIZE }));
    if (blockEditorEntity) {
      blockEditorEntity.removeTag(Tags.IS_CREATEMENU_VISIBLE);
    }
  };
  const addBlockByType = async (blockType: BlockTypes) => {
    const newBlockEntity = new Entity();
    ecs.engine.addEntity(newBlockEntity);

  console.log("parentId", parentId)

    switch (blockType) {
      case BlockTypes.IMAGE:
        openFilePicker();
        break;
      case BlockTypes.SPACER:
        const newBlockEntity = new Entity();
        ecs.engine.addEntity(newBlockEntity);
        newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.SPACER }));
        newBlockEntity.addComponent(new ParentFacet({ parentId: parentId }));
        if (blockEditorEntity) {
          blockEditorEntity.removeTag(Tags.IS_CREATEMENU_VISIBLE);
        }
    }
  };

  return (
    <>
      <div
        className={`w-full hover:opacity-80 transition-all  min-w-[4rem] p-2 bg-opacity-10 h-18 text-whitee rounded-lg mr-0 m-1 `}
        style={{ color: color, backgroundColor: bgColor, maxWidth: '10rem' }} // Max width set to 10rem
        onClick={() => {
          addBlockByType(blockType);
        }}
      >
        <div className="text-2xl flex justify-center mt-2"> {icon}</div>
        <p className="text-xs mt-1 opacity-60 w-full text-center font-light">{blockType}</p>
      </div>
      {isSelectingImageSrc && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
      )}
    </>
  );
};

interface CreateMenuProps {
  entity: Entity,
  parentId: string
}
const CreateMenu: React.FC<CreateMenuProps> = ({entity, parentId}) => {
  const [isVisible] = useEntityHasTags(entity, Tags.IS_CREATEMENU_VISIBLE);
  const [editOptions, setEditOptions] = useState([
    {
      blockType: BlockTypes.IMAGE,
      icon: <IoImage />,
      color: '#8547F0',
      bgColor: 'rgba(133, 71, 240, 0.1)',
    },
    {
      blockType: BlockTypes.SPACER,
      icon: <IoRemove />,
      color: '#EC76CB',
      bgColor: 'rgba(236, 118, 203, 0.1)',
    },
  ]);

  const menuRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
     entity?.removeTag(Tags.IS_CREATEMENU_VISIBLE);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <motion.div
        ref={menuRef}
        transition={{ type: 'Tween' }}
        animate={{ y: !isVisible ? 200 : 0 }}
        initial={{ y: 200 }}
        className="bg-white h-20 overflow-y-clip  rounded-lg pr-1 flex over md:overflow-hidden  w-11/12 md:w-[30rem] fixed bottom-6 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
      >
        <div className="flex overflow-x-scroll w flex-auto">
          {editOptions.map((option) => (
            <CreateOption
              blockEditorEntity={entity}
              parentId={parentId}
              isVisible={isVisible}
              option={option}
              key={option.blockType}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateMenu;
