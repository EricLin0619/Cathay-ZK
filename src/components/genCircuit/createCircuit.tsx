import GroupCondition from "./groupCondition";
import CreateButton from "@components/button/createButton";
import { useState } from "react";

// 定義介面
interface GroupConditionType {
  id: number;
  number: number;
}

const AddGroupCondition = ({
  addGroupCondition,
}: {
  addGroupCondition: () => void;
}) => {
  return (
    <button
      onClick={() => {
        addGroupCondition();
      }}
      className="btn h-[100px] w-[100px] mx-auto bg-white border-none text-3xl custom-shadow2 hover:bg-slate-400 text-gray-900"
    >
      +
    </button>
  );
};

export default function CreateCircuit() {
  const [groupConditions, setGroupConditions] = useState<GroupConditionType[]>([
    { id: 1, number: 1 }
  ]);
  
  const addGroupCondition = () => {
    const newId = Date.now(); // 使用時間戳作為唯一id
    setGroupConditions([...groupConditions, { 
      id: newId, 
      number: groupConditions.length + 1 
    }]);
  };

  const removeGroupCondition = (index: number) => {
    setGroupConditions(groupConditions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-grow text-black pt-40 pb-6 flex flex-col gap-20">
      {groupConditions.map((condition, index) => (
        <GroupCondition
          key={condition.id} // 使用唯一id作為key，而不是index
          index={index}
          removeGroupCondition={removeGroupCondition}
        />
      ))}
      {groupConditions.length < 3 && (
        <AddGroupCondition addGroupCondition={addGroupCondition} />
      )}
      <CreateButton />
    </div>
  );
}
