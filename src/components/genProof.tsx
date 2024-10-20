"use client"
import React, { useState } from 'react';

const circuits = [
  {
    id: 1,
    name: "circuit 1",
  },
  {
    id: 2,
    name: "circuit 2",
  },
  {
    id: 3,
    name: "circuit 3",
  },
  {
    id: 4,
    name: "circuit 4",
  },
  {
    id: 5,
    name: "circuit 5",
  },
]

export default function GenProof() {
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(null);

  return (
    <div className="flex-grow text-black pt-40 pb-6 flex">
      <div className="w-full h-[80vh] custom-border-radius custom-shadow flex">
        <div className="w-[30%]  flex flex-col gap-2 p-4 overflow-y-auto">
          <div className="flex-shrink-0">
            {circuits.map((circuit, index) => (
              <div 
                key={circuit.id}
                className={`h-[60px] mb-4 flex items-center justify-center custom-border-radius cursor-pointer transition-colors duration-200
                  ${selectedCircuit === circuit.id ? 'bg-slate-300' : 'bg-transparent hover:bg-slate-100'}`}
                onClick={() => setSelectedCircuit(circuit.id)}
              >
                {circuit.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-grow bg-red-200"></div>
      </div>
    </div>
  );
}
