import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { motion } from 'framer-motion';
import { BlockTypes, FitTypes, SizeTypes, Tags } from '../../base/Constants';
import { IoImage } from 'react-icons/io5';
import { useContext, useEffect, useRef, useState } from 'react';
import { ECS, ECSContext, Entity, useEntityHasTags } from '@leanscope/ecs-engine';
import { FitFacet, ParentFacet, SizeFacet, SrcFacet, TypeFacet } from '../../app/BlockFacets';
import { string } from 'prop-types';

type option = {
  blockType: BlockTypes;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

const handleGetImageSrc = () => {
  let url = '';

  return url;
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
    newBlockEntity.addComponent(new SrcFacet({ src: url }));
    newBlockEntity.addComponent(new FitFacet({ fit: FitTypes.COVER }));
    newBlockEntity.addComponent(new SizeFacet({ size: SizeTypes.AUTO }));
    if (blockEditorEntity) {
      blockEditorEntity.removeTag(Tags.IS_CREATEMENU_VISIBLE);
    }
  };
  const addBlockByType = async (blockType: BlockTypes, parentId: string) => {
    const newBlockEntity = new Entity();
    ecs.engine.addEntity(newBlockEntity);

    switch (blockType) {
      case BlockTypes.IMAGE:
        openFilePicker();
    }
  };

  return (
    <>
      <div
        className={`w-full hover:opacity-80 transition-all  min-w-[4rem] p-2 bg-opacity-10 h-18 text-whitee rounded-lg mr-0 m-1 `}
        style={{ color: color, backgroundColor: bgColor, maxWidth: '10rem' }} // Max width set to 10rem
        onClick={() => {
          addBlockByType(blockType, parentId);
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

const CreateMenu = (props: EntityProps) => {
  const [isVisible] = useEntityHasTags(props.entity, Tags.IS_CREATEMENU_VISIBLE);
  const [editOptions, setEditOptions] = useState([
    {
      blockType: BlockTypes.IMAGE,
      icon: <IoImage />,
      color: '#8547F0',
      bgColor: 'rgba(133, 71, 240, 0.1)',
    },
  ]);

  const menuRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      props.entity?.removeTag(Tags.IS_CREATEMENU_VISIBLE);
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
              blockEditorEntity={props.entity}
              parentId="1"
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
