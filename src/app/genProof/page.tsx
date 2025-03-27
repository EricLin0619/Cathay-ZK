"use client";
import React, { useState } from "react";
// import circuits from "@testData/data";
import { useEffect } from "react";
import axios from "axios";
import { Circuit } from "@/type/circuit";
import { parseCondition, extractFields } from "../../utils/parseCondition"
import toast from "react-hot-toast";

export default function Home() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(1);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    axios.get("http://localhost:3001/circuit")
    .then(response => {
      console.log(response.data)
      setCircuits(response.data)
      console.log(extractFields(parseCondition(response.data[0].circuit_logic)))
    })
  },[])

  // 找到選中的 circuit
  const selectedCircuitData = circuits.find(
    (circuit) => circuit.id === selectedCircuit
  );

  // 當選擇新的電路時，重置輸入值
  const handleCircuitSelect = (circuitId: number) => {
    setSelectedCircuit(circuitId);
    setInputValues({});
  };

  // 處理輸入值變更
  const handleInputChange = (fieldName: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [fieldName.trim()]: value  // 保持為字串
    }));
  };

  const handleGen = () => {
    const numberInputs = Object.entries(inputValues).reduce((acc, [key, value]) => {
      // 解析字段名和類型
      const [fieldName, type] = key.split(' (');
      const fieldType = type?.replace(')', '');  // 移除結尾括號

      // 根據類型轉換值
      let convertedValue = value as string | number;
      if (fieldType === 'number') {
        convertedValue = Number(value);
      } else if (fieldType === 'bool') {
        convertedValue = value === '1' || value === '1' ? 1 : 0;
      }
      // string 類型保持原樣

      acc[fieldName.trim()] = convertedValue;
      return acc;
    }, {} as { [key: string]: string | number | boolean });
    console.log(numberInputs)

    axios.post(`http://localhost:3001/circuit/get-proof/${selectedCircuit}`, {
      inputs: numberInputs
    })
    .then(response => {
      // 创建 Blob 对象
      const jsonString = JSON.stringify(response.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'proof.json'; // 设置下载文件名
      
      toast.success("Proof generated successfully")
      // 触发下载
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(response.data);
    })
    .catch(error => {
      console.log("Error message:", error);
      toast.error("Failed to generate proof")
    });
  }

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
                onClick={() => handleCircuitSelect(circuit.id)}
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
                <p>{parseCondition(selectedCircuitData.circuit_logic)}</p>
                {/* <ul className="list-disc pl-5">
                  {selectedCircuitData.conditions.map((condition, index) => (
                    <li key={index} className="mb-2">
                      {condition.name} {condition.logic} {condition.value}
                    </li>
                  ))}
                </ul> */}
              </div>
              <div className=" w-full mt-auto flex flex-col gap-4 mb-4">
                {selectedCircuitData && extractFields(parseCondition(selectedCircuitData.circuit_logic)).map((field, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={field}
                    value={inputValues[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="input input-bordered w-full bg-white"
                  />
                ))}
              </div>
            </>
          ) : (
            <p>請選擇一個電路</p>
          )}
          <button className="btn bg-slate-600 text-white border-none hover:bg-slate-700" onClick={handleGen}>Generate Proof</button>
        </div>
      </div>
    </div>
  );
}
