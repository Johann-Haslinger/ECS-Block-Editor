import InitSystem from './systems/InitSystem';
import { useContext } from 'react';
import { ECSContext } from '@leanscope/ecs-engine';
import ExamplePage from './pages/ExamplePage';
import { useStateContext } from './contexts/ContextProvider';

function App() {
  const ecs = useContext(ECSContext);
  const { theme } = useStateContext();

  return (
    <div className=" bg-bg w-screen h-screen ">
      <meta name="theme-color" content={theme} />
      <ECSContext.Provider value={ecs}>
        <InitSystem />
        <ExamplePage />
      </ECSContext.Provider>
    </div>
  );
}

export default App;
