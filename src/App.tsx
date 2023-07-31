import InitSystem from './systems/InitSystem';
import { useContext } from 'react';
import { ECSContext } from '@leanscope/ecs-engine';
import ExamplePage from './pages/ExamplePage';

function App() {
  const ecs = useContext(ECSContext);

  return (
    <div className=" bg-bg w-screen h-screen ">
      <ECSContext.Provider value={ecs}>
        <InitSystem />
        <ExamplePage />
      </ECSContext.Provider>
    </div>
  );
}

export default App;
