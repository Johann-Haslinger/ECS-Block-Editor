import { Entity, useEntities } from '@leanscope/ecs-engine';
import ComponentRenderer from '../components/ComponentRenderer';
import { IsEditingFacet, TextFacet } from '../app/BlockFacets';
import Toolbar from '../components/Toolbar';

interface BlockEditorProps {
  blockEntities: readonly Entity[];
  header: string;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ blockEntities }) => {
  const [blockEditorEntities] = useEntities((e) => e.has(IsEditingFacet));

  return (
    <div className="md:pt-14 md:p-4  w-full h-full">
      {blockEditorEntities[0] && <Toolbar entity={blockEditorEntities[0]} />}
      <div className=" bg-white  overflow-y-scroll  overflow-x-hidden flex justify-center w-full h-full rounded-xl">
        <div className="md:w-8/12 w-full   px-4  h-full ">
          <p className="text-2xl w-full select-none pb-2 mb-4 font-bold mt-24 border-b-[rgb(245,245,245)]  border-b ">
            ECS Block Editor
          </p>

          <ComponentRenderer blockEditorEntities={blockEditorEntities} blockEntities={blockEntities} />
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;
