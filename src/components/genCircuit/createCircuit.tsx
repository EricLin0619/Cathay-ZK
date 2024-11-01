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
    { id: 1, number: 1 },
  ]);

  const addGroupCondition = () => {
    const newId = Date.now(); // 使用時間戳作為唯一id
    setGroupConditions([
      ...groupConditions,
      {
        id: newId,
        number: groupConditions.length + 1,
      },
    ]);
  };

  const removeGroupCondition = (index: number) => {
    setGroupConditions(groupConditions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-grow text-black pt-[140px] pb-6  mx-auto w-full">
      {/* 表單區塊 */}
      <div className="bg-[#FFFAFA] p-8 rounded-lg custom-shadow mb-10 custom-border-radius">
        <div className="space-y-6">
          {/* Circuit Name 區塊 */}
          <div>
            <p className="text-2xl font-bold mb-3 text-gray-800">Circuit Name</p>
            <input 
              type="text" 
              placeholder="Enter circuit name" 
              className="input input-bordered w-full bg-white custom-shadow2 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Circuit Description 區塊 */}
          <div>
            <p className="text-2xl font-bold mb-3 text-gray-800">Circuit Description</p>
            <input 
              type="text" 
              placeholder="Enter circuit description" 
              className="input input-bordered w-full bg-white custom-shadow2 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Condition 區塊 */}
      <div className="bg-[#FFFAFA] p-8 rounded-lg custom-shadow custom-border-radius">
        <p className="text-2xl font-bold mb-6 text-gray-800">Circuit Condition</p>
        <div className="flex flex-col gap-8">
          {groupConditions.map((condition, index) => (
            <GroupCondition
              key={condition.id}
              index={index}
              removeGroupCondition={removeGroupCondition}
            />
          ))}
          {groupConditions.length < 3 && (
            <AddGroupCondition addGroupCondition={addGroupCondition} />
          )}
        </div>
      </div>

      {/* Create Button */}
      <div className="mt-8 w-full">
        <CreateButton />
      </div>
    </div>
  );
}
