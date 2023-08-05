import { ECSContext, Entity, useEntities } from '@leanscope/ecs-engine';
import ComponentRenderer from '../components/ComponentRenderer';
import { ChildFacet, IdFacet, IsEditingFacet, TextFacet, TypeFacet } from '../app/BlockFacets';
import Toolbar from '../components/Toolbar';
import { useContext, useEffect } from 'react';
import { useWindowDimensions } from '../components/Size';
import { useStateContext } from '../contexts/ContextProvider';

interface BlockEditorProps {
  blockEntities: readonly Entity[];
  header: string;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ blockEntities, header }) => {
  const [blockEditorEntities] = useEntities((e) => e.has(IsEditingFacet));
  const { width } = useWindowDimensions();
  const { setTheme } = useStateContext();

  useEffect(() => {
    if (width < 550) {
      setTheme('#ffffff');
    }
  }, []);

  return (
    <div className="md:pt-14 md:p-4  w-full h-full">
       {blockEditorEntities[0] && <Toolbar entity={blockEditorEntities[0]} />}
      <div className="  bg-white mt-16 md:mt-0 overflow-y-scroll  overflow-x-hidden flex justify-center w-full h-full md:rounded-xl">
        <div className="md:w-9/12 w-full   px-2  h-full ">
          <p className="text-2xl px-2 md:mb-10 w-full select-none pb-2 mb-4 font-bold mt-16 md:mt-24 border-b-[rgb(245,245,247)]  border-b ">
            {header}
          </p>

          <ComponentRenderer
            blockEditorEntities={blockEditorEntities}
            blockEntities={blockEntities}
          />
        </div>
      </div>
     
    </div>
  );
};

export default BlockEditor;
