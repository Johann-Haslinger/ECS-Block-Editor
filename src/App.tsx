import InitSystem from './systems/InitSystem';
import { useEffect, useState } from 'react';
import { ECS, ECSContext } from '@leanscope/ecs-engine';
import ExamplePage from './pages/ExamplePage';

function App() {
  const [ecs] = useState(new ECS());

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
