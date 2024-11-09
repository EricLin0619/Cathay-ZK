import SubCondition from "./subCondition";
import { useState, useEffect } from "react";
import { Condition, GroupConditions } from "../../interfaces/circuit";

export default function GroupCondition({
  index,
  removeGroupCondition,
  setGroupCondition,
}: {
  index: number;
  removeGroupCondition: (index: number) => void;
  setGroupCondition: (groupCondition: GroupConditions | undefined) => void;
}) {
  // store the conditions in the group
  const [condition_1, setCondition_1] = useState<Condition>({inputValue: "", comparator: "", value: ""});
  const [condition_2, setCondition_2] = useState<Condition>({inputValue: "", comparator: "", value: ""});
  const [logic, setLogic] = useState("");

  useEffect(() => {
    setGroupCondition({logic: logic, conditions: [condition_1, condition_2]});
  }, [condition_1, condition_2, logic]);

  // show the second contion in group or not
  const [showAdditional, setShowAdditional] = useState(false);

  return (
    <div className="relative rounded py-8 px-[10%] w-full h-[350px] grid grid-cols-3 gap-6 custom-shadow custom-border-radius bg-[#FFFAFA] bg-opacity-90">
      <SubCondition
        deletable={false}
        setShowAdditional={setShowAdditional}
        setCondition={setCondition_1}
      />
      {showAdditional ? (
        <>
          <LogicOperator setLogic={setLogic} />
        </>
      ) : (
        <AddSubCondition addSubCondition={setShowAdditional} />
      )}
      {showAdditional && (
        <SubCondition
          deletable={true}
          setShowAdditional={setShowAdditional}
          setCondition={setCondition_2}
        />
      )}
      {index > 0 && (
        <button
          onClick={() => {
            removeGroupCondition(index)
            setGroupCondition(undefined)
          }}
          className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
      )}
    </div>
  );
}

interface AddSubConditionProps {
  addSubCondition: (show: boolean) => void;
}

const AddSubCondition = ({ addSubCondition }: AddSubConditionProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <button
        onClick={() => {
          addSubCondition(true);
        }}
        className="w-20 h-20 btn mx-auto bg-white border-none text-3xl custom-shadow2 hover:bg-slate-400 text-gray-900"
      >
        +
      </button>
    </div>
  );
};

const LogicOperator = ({ setLogic }: { setLogic: (logic: string) => void }) => {
  return (
    <div className="flex items-center justify-center">
      <select
        className="select select-bordered bg-white text-center mx-auto custom-shadow2"
        onChange={(e) => setLogic(e.target.value)}
      >
        <option disabled selected>
          logic operator
        </option>
        <option>AND</option>
        <option>OR</option>
      </select>
    </div>
  );
};
