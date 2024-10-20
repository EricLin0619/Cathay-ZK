import ConditionBlock from "./conditionBlock";
import React, { useState } from "react";

export default function CreateCircuit() {
  const [conditions, setConditions] = useState([{ id: 1 }]);

  const LogicSelector = () => (
    <select className="select select-bordered w-[10%] h-full bg-white text-center mx-auto custom-shadow2">
      <option disabled selected>
        logic operator
      </option>
      <option>AND</option>
      <option>OR</option>
    </select>
  );

  const addCondition = () => {
    setConditions([...conditions, { id: conditions.length + 1 }]);
  };

  return (
    <div className="flex-grow text-black pt-40 pb-6 flex flex-col gap-20">
      {conditions.map((condition, index) => (
        <React.Fragment key={condition.id}>
          <ConditionBlock />
          {index < conditions.length - 1 && (
            <div className="flex justify-center h-[100px]">
              <LogicSelector />
            </div>
          )}
        </React.Fragment>
      ))}
      {conditions.length < 3 && (
        <div className="flex justify-center h-[100px]">
          <button
            className="btn w-[10%] mx-auto h-full bg-white border-none text-3xl custom-shadow2"
            onClick={addCondition}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
