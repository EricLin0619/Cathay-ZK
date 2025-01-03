"use client";
import React, { useState } from "react";
import circuits from "@testData/data";

export default function Home() {
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(1);

  // 找到選中的 circuit
  const selectedCircuitData = circuits.find(
    (circuit) => circuit.id === selectedCircuit
  );

  return (
    <div className="flex-grow text-black pt-40 pb-6 flex">
      <div className="w-full h-[70vh] custom-border-radius custom-shadow flex bg-[#FFFAFA] bg-opacity-90">
        <div className="w-[30%] flex flex-col gap-2 p-4 overflow-y-auto">
          <div className="flex-shrink-0">
            {circuits.map((circuit, index) => (
              <div
                key={circuit.id}
                className={`h-[60px] ${index === circuits.length - 1 ? "" : "mb-4"} flex items-center justify-center custom-border-radius cursor-pointer transition-colors duration-200
                    ${
                      selectedCircuit === circuit.id
                        ? "bg-slate-500 text-white"
                        : "bg-transparent hover:bg-slate-200"
                    }`}
                onClick={() => setSelectedCircuit(circuit.id)}
              >
                {circuit.name}
              </div>
            ))}
          </div>
        </div>
        <div className="w-[70%] border-l-4 border-slate-300 px-10 py-6 flex flex-col">
          {selectedCircuitData ? (
            <>
              <div className="w-full">
                <h2 className="text-4xl font-bold mb-6">
                  {selectedCircuitData.name}
                </h2>
                <span className="mb-4 text-xl font-bold">Description:</span>
                <p className="mt-2 mb-4">{selectedCircuitData.description}</p>
                <h3 className="text-xl font-semibold mb-2">Condition:</h3>
                <ul className="list-disc pl-5">
                  {selectedCircuitData.conditions.map((condition, index) => (
                    <li key={index} className="mb-2">
                      {condition.name} {condition.logic} {condition.value}
                    </li>
                  ))}
                </ul>
              </div>
              <div className=" w-full mt-auto flex flex-col gap-4 mb-4">
                {selectedCircuitData.conditions.map((condition, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`${condition.name}`}
                    className="input input-bordered w-full bg-white"
                  />
                ))}
              </div>
            </>
          ) : (
            <p>請選擇一個電路</p>
          )}
          <button className="btn bg-slate-600 text-white border-none hover:bg-slate-700">Generate Proof</button>
        </div>
      </div>
    </div>
  );
}
