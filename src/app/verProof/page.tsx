"use client";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Circuit } from "@/type/circuit";
import { parseCondition } from "@/utils/parseCondition";
import toast from "react-hot-toast";

export default function Home() {
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(1);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [proofData, setProofData] = useState<{
    a: string[];
    b: [string[], string[]];
    c: string[];
  } | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/circuit`).then((response) => {
      console.log(response.data);
      setCircuits(response.data);
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setProofData(jsonData);
          console.log("Loaded proof data:", jsonData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleVer = () => {
    if (!proofData) {
      console.error("No proof data loaded");
      return;
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_PATH}/circuit/verify/${selectedCircuit}`,
        proofData
      )
      .then((response) => {
        console.log(response.data);
        if (response.data == true) {
          toast.success('Successfully verified')
        }
        else {
          toast.error('Verification failed')
        }
        
      })
      .catch((error) => {
        console.log("Error message:", error);
      });
  };

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
                className={`h-[60px] ${
                  index === circuits.length - 1 ? "" : "mb-4"
                } flex items-center justify-center custom-border-radius cursor-pointer transition-colors duration-200
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
        <div className="w-[70%] border-l-4 border-slate-300 px-10 py-6 overflow-y-auto flex flex-col">
          {selectedCircuitData ? (
            <>
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  {selectedCircuitData.name}
                </h2>
                <span className="mb-4 text-xl font-bold">Description:</span>
                <p className="mt-2 mb-4">{selectedCircuitData.description}</p>
                <h3 className="text-xl font-semibold mb-2">Condition:</h3>
                <p>{parseCondition(selectedCircuitData.circuit_logic)}</p>
                {/* <ul className="list-disc pl-5">
                  {selectedCircuitData.conditions.map((condition, index) => (
                    <li key={index} className="mb-2">
                      {condition.name} {condition.logic} {condition.value}
                    </li>
                  ))}
                </ul> */}
              </div>
            </>
          ) : (
            <p>請選擇一個電路</p>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            accept=".json"
            lang="en"
            className="file-input w-full bg-white mb-4 mt-auto input-bordered"
          />
          <button
            className="btn bg-slate-600 text-white border-none hover:bg-slate-700"
            onClick={handleVer}
          >
            Verify Proof
          </button>
        </div>
      </div>
    </div>
  );
}
