import SubCondition from "./subCondition";
import { useState } from "react";

interface AddSubConditionProps {
  addSubCondition: (show: boolean) => void;
}

const AddSubCondition = ({ addSubCondition }: AddSubConditionProps) => {
  return (
    <div className="grid grid-rows-3 gap-4">
      <div></div>
      <button
        onClick={() => {
          addSubCondition(true);
        }}
        className="btn w-[30%] mx-auto h-full bg-white border-none text-3xl custom-shadow2 hover:bg-slate-400 text-gray-900"
      >
        +
      </button>
      <div></div>
    </div>
  );
};

const LogicOperator = () => {
  return (
    <div className="grid grid-rows-3 gap-4">
      <div></div>
      <select className="select select-bordered w-[30%] h-full bg-white text-center mx-auto custom-shadow2">
        <option disabled selected>
          logic operator
        </option>
        <option>AND</option>
        <option>OR</option>
      </select>
      <div></div>
    </div>
  );
};

export default function GroupCondition({
  index,
  removeGroupCondition
}: {
  index: number;
  removeGroupCondition: (index: number) => void;
}) {
  const [showAdditional, setShowAdditional] = useState(false);
  return (
    <div className="relative rounded py-8 px-[10%] w-full h-[350px] grid grid-cols-3 gap-6 custom-shadow custom-border-radius bg-[#FFFAFA] bg-opacity-90">
      <SubCondition deletable={false} setShowAdditional={setShowAdditional} />
      {showAdditional ? (
        <>
          <LogicOperator />
        </>
      ) : (
        <AddSubCondition addSubCondition={setShowAdditional} />
      )}
      {showAdditional && (
        <SubCondition deletable={true} setShowAdditional={setShowAdditional} />
      )}
      {index > 0 && (
        <button
          onClick={() => removeGroupCondition(index)}
          className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
      )}
    </div>
  );
}
