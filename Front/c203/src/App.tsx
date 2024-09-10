import React from "react";
import useStore from "./store/useStore";
import "./App.css";

const App: React.FC = () => {
  const bears = useStore((state) => state.bears);
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);

  return (
    <div>
      <h1>이정준 꿀밤 맞을 횟수 : {bears}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  );
};

export default App;
