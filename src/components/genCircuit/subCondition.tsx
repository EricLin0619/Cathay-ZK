import { useEffect, useState } from "react";
import { Condition } from "../../interfaces/circuit";

// main component
export default function SubCondition({
  deletable,
  setShowAdditional,
  setCondition,
}: SubConditionProps) {

  const [inputValue, setInputValue] = useState("");
  const [comparator, setComparator] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    setCondition({inputValue: inputValue, comparator: comparator, value: value});
  }, [inputValue, comparator, value]);
  
  return (
    <div className="grid grid-rows-3 gap-4 relative">
      <input
        type="text"
        placeholder="condition name"
        className="input input-bordered w-full h-full bg-white text-center custom-shadow2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <ComparatorSelector setComparator={setComparator} />
      <input
        type="text"
        placeholder="value"
        className="input input-bordered w-full h-full bg-white text-center custom-shadow2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {deletable && (
        <button
          className="absolute top-[-10px] right-[-10px] btn btn-circle btn-xs"
          onClick={() => {
            setShowAdditional(false);
            setCondition({inputValue: "", comparator: "", value: ""});
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

interface SubConditionProps {
  deletable: boolean;
  setShowAdditional: (show: boolean) => void;
  setCondition: (conditions: Condition ) => void;
}

const ComparatorSelector = ({setComparator}: {setComparator: (comparator: string) => void}) => {
  return (
    <select className="select select-bordered w-[40%] h-full bg-white text-center mx-auto custom-shadow2"
      onChange={(e) => setComparator(e.target.value)}
    >
      <option disabled selected>
        comparator
      </option>
      <option>{`=(number)`}</option>
      <option>{`!=(number)`}</option>
      <option>{`>(number)`}</option>
      <option>{`>=(number)`}</option>
      <option>{`<(number)`}</option>
      <option>{`<=(number)`}</option>
      <option>{`==(string)`}</option>
      <option>{`==(bool)`}</option>
    </select>
  );
};