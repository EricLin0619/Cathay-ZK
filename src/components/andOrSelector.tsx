export default function andOrSelector() {
    return (
      <select className="select select-bordered w-[30%] h-full bg-white text-center mx-auto custom-shadow2">
        <option disabled selected>
          logic operator
        </option>
        <option>AND</option>
        <option>OR</option>
      </select> 
    );
  }