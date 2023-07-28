import { Entity, useEntities } from '@leanscope/ecs-engine';
import ComponentRenderer from '../components/ComponentRenderer';
import { TextFacet } from '../app/BlockFacets';

interface BlockEditorProps {
  blockEntities: readonly Entity[];
  header: string;
}

const BlockEditor: React.FC<BlockEditorProps> = ({blockEntities, header}) => {
  return (
    <div className="md:p-4 md:pt-10  w-full h-full">
      <div className=" bg-white  overflow-y-scroll  overflow-x-hidden flex justify-center w-full h-full rounded-xl">
        <div className="md:w-8/12 w-full   h-full ">
          <p className="text-2xl w-full pb-2 mb-4 font-bold mt-12 border-b-[rgb(245,245,245)]  border-b ">
            ECS Block Editor
          </p>

          <ComponentRenderer blockEntities={blockEntities} />
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;
