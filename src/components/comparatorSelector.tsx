export default function ComparatorSelector() {
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
}
