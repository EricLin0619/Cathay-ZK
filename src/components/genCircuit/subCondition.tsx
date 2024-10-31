import { useRef } from "react";

interface SubConditionProps {
  deletable: boolean;
  setShowAdditional: (show: boolean) => void;
}

const ComparatorSelector = () => {
  return (
    <select className="select select-bordered w-[30%] h-full bg-white text-center mx-auto custom-shadow2">
      <option disabled selected>
        comparator
      </option>
      <option>{`>`}</option>
      <option>{`>=`}</option>
      <option>{`<`}</option>
      <option>{`<=`}</option>
      <option>{`==`}</option>
    </select>
  );
};

export default function SubCondition({
  deletable,
  setShowAdditional,
}: SubConditionProps) {

  
  const inputRef = useRef(null)
  console.log(inputRef.current);
  
  return (
    <div className="grid grid-rows-3 gap-4 relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full h-full bg-white text-center custom-shadow2"
      />
      <ComparatorSelector />
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full h-full bg-white text-center custom-shadow2"
      />
      {deletable && (
        <button
          className="absolute top-[-10px] right-[-10px] btn btn-circle btn-xs"
          onClick={() => {
            setShowAdditional(false);
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
