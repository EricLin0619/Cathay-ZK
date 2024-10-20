import React, { useState } from 'react';
import LogicSelector from './logicSelector';

export default function ConditionBlock() {
  const [showAdditional, setShowAdditional] = useState(false);

  const InputBlock = () => (
    <div className="grid grid-rows-3 gap-4">
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full h-full bg-white text-center custom-shadow2"
      />
      <LogicSelector />
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full h-full bg-white text-center custom-shadow2"
      />
    </div>
  );

  return (
    <div className="rounded py-8 px-[10%] w-full h-[350px] grid grid-cols-3 gap-6 custom-shadow custom-border-radius">
      <InputBlock />
      <div className="grid grid-rows-3 gap-4">
        <div></div>
        {!showAdditional ? (
          <button 
            className="btn w-[30%] mx-auto h-full bg-white border-none text-3xl custom-shadow2"
            onClick={() => setShowAdditional(true)}
          >
            +
          </button>
        ) : (
          <LogicSelector />
        )}
        <div></div>
      </div>
      {showAdditional && <InputBlock />}
    </div>
  );
}
