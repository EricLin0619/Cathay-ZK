import GroupCondition from "./groupCondition";
import { useState, useEffect, Fragment } from "react";
import { GroupConditions } from "@/interfaces/circuit";
import { genCircuitData } from "@/utils/genCircuitData";
import genCircomCode from "@/utils/genCircomCode";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateCircuit() {
  const [groupConditionDisplay, setGroupConditionDisplay] = useState<
    GroupConditionDisplay[]
  >([{ id: 1, number: 1 }]);

  const [circuitName, setCircuitName] = useState("");
  const [circuitDescription, setCircuitDescription] = useState("");
  const [groupCondition_1, setGroupCondition_1] = useState<GroupConditions | undefined>();
  const [groupCondition_2, setGroupCondition_2] = useState<GroupConditions | undefined>();
  const [groupCondition_3, setGroupCondition_3] = useState<GroupConditions | undefined>();
  const [logicOperator_1, setLogicOperator_1] = useState<string>("");
  const [logicOperator_2, setLogicOperator_2] = useState<string>("");

  useEffect(() => {
    console.log(groupCondition_1, groupCondition_2, groupCondition_3);
    console.log(logicOperator_1, logicOperator_2);
  }, [groupCondition_1, groupCondition_2, groupCondition_3]);

  useEffect(() => {
    console.log(logicOperator_1, logicOperator_2);
  }, [logicOperator_1, logicOperator_2]);

  const addGroupCondition = () => {
    const newId = Date.now(); // use timestamp as unique id
    setGroupConditionDisplay([
      ...groupConditionDisplay,
      {
        id: newId,
        number: groupConditionDisplay.length + 1,
      },
    ]);
  };

  const removeGroupCondition = (index: number) => {
    setGroupConditionDisplay(
      groupConditionDisplay.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex-grow text-black pt-[140px] pb-6  mx-auto w-full">
      {/* 表單區塊 */}
      <div className="bg-[#FFFAFA] p-8 rounded-lg custom-shadow mb-10 custom-border-radius">
        <div className="space-y-6">
          {/* Circuit Name 區塊 */}
          <div>
            <p className="text-2xl font-bold mb-3 text-gray-800">
              Circuit Name
            </p>
            <input
              type="text"
              placeholder="Enter circuit name"
              className="input input-bordered w-full bg-white custom-shadow2 focus:outline-none focus:border-blue-400"
              value={circuitName}
              onChange={(e) => setCircuitName(e.target.value)}
            />
          </div>

          {/* Circuit Description 區塊 */}
          <div>
            <p className="text-2xl font-bold mb-3 text-gray-800">
              Circuit Description
            </p>
            <input
              type="text"
              placeholder="Enter circuit description"
              className="input input-bordered w-full bg-white custom-shadow2 focus:outline-none focus:border-blue-400"
              value={circuitDescription}
              onChange={(e) => setCircuitDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Condition 區塊 */}
      <div className="bg-[#FFFAFA] p-8 rounded-lg custom-shadow custom-border-radius">
        <p className="text-2xl font-bold mb-6 text-gray-800">
          Circuit Condition
        </p>
        <div className="flex flex-col gap-8">
          {groupConditionDisplay.map((condition, index) => (
            <Fragment key={condition.id}>
              <GroupCondition
                index={index}
                removeGroupCondition={removeGroupCondition}
                setGroupCondition={
                  index === 0
                    ? setGroupCondition_1
                    : index === 1
                    ? setGroupCondition_2
                    : setGroupCondition_3
                }
              />
              {groupConditionDisplay.length > 1 &&
                index !== groupConditionDisplay.length - 1 && (
                  <LogicOperator
                    setLogicOperator={
                      index === 0
                        ? setLogicOperator_1
                        : index === 1
                        ? setLogicOperator_2
                        : () => {}
                    }
                  />
                )}
            </Fragment>
          ))}
          {groupConditionDisplay.length < 3 && (
            <AddGroupCondition addGroupCondition={addGroupCondition} />
          )}
        </div>
      </div>

      {/* Create Button */}
      <div className="mt-8 w-full">
        <button
          onClick={async () => {
            const result = genCircuitData(
              circuitName,
              circuitDescription,
              groupCondition_1,
              groupCondition_2,
              groupCondition_3,
              logicOperator_1,
              logicOperator_2
            )
            console.log(result.logic);

            
            // @ts-ignore
            const generatedCircom = await genCircomCode(result);
            console.log("---------------------------------------------");
            const hexString = Buffer.from(generatedCircom, "utf-8").toString("hex")
            console.log(Buffer.from(generatedCircom, "utf-8").toString("hex"));

            const payload = {
              name: circuitName,
              description: circuitDescription,
              circomHexString: hexString,
              circuitLogic: result.logic
            }
            console.log("Payload:", payload)
            axios.post("http://localhost:3001/circuit", payload)
            .then(response => {
              console.log("Response data:", response.data)
              toast.success("Circuit generated successfully")
            })
            .catch(error => {
              console.log('Error posting data:', error)
              toast.error("Failed to generate circuit")
            })
          }}
          className="btn w-full bg-white custom-shadow2 hover:bg-slate-500 hover:text-white text-gray-900 border-none"
        >
          Create
        </button>
      </div>
    </div>
  );
}

// 定義介面
interface GroupConditionDisplay {
  id: number;
  number: number;
}

const LogicOperator = ({
  setLogicOperator,
}: {
  setLogicOperator: (logicOperator: string) => void;
}) => {
  return (
    <select
      className="select select-bordered bg-white text-center mx-auto custom-shadow2"
      onChange={(e) => setLogicOperator(e.target.value)}
    >
      <option disabled selected>
        Logic Operator
      </option>
      <option>AND</option>
      <option>OR</option>
    </select>
  );
};

// add new group condition button
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
      className="btn h-20 w-20 mx-auto bg-white border-none text-3xl custom-shadow2 hover:bg-slate-500 hover:text-white text-gray-900"
    >
      +
    </button>
  );
};


