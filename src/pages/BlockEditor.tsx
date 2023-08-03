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
      <div className="  bg-white  overflow-y-scroll  overflow-x-hidden flex justify-center w-full h-full rounded-xl">
        <div className="md:w-8/12 w-full   px-2  h-full ">
          <p className="text-2xl px-2 md:mb-10 w-full select-none pb-2 mb-4 font-bold mt-32 md:mt-24 border-b-[rgb(245,245,247)]  border-b ">
            {header}
          </p>

          <ComponentRenderer
            blockEditorEntities={blockEditorEntities}
            blockEntities={blockEntities}
          />
        </div>
      </div>
      {blockEditorEntities[0] && <Toolbar entity={blockEditorEntities[0]} />}
    </div>
  );
};

export default BlockEditor;
