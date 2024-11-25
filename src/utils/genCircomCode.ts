// 定義基本條件的介面
interface Condition {
  name: string;
  logic: string;
  value: string | number;
}

// 定義邏輯組的介面
interface LogicGroup {
  operator: 'and' | 'or';
  conditions: (Condition | LogicGroup)[];
}

// 定義電路的介面
interface Circuit {
  id: number;
  name: string;
  description: string;
  logic: LogicGroup;
}

// 定義計數器介面
interface VarCounter {
  comp: number;
  intermediate: number;
}

// 定義處理邏輯組返回值的介面
interface LogicProcessResult {
  code: string;
  finalVar: string;
}

// 定義比較運算返回值的介面
interface ComparisonResult {
  code: string;
  outVar: string;
}

const circuits: Circuit = {
  id: 1,
  name: "circuit 1",
  description: "Complex three-layer logic circuit example",
  logic: {
    operator: "or",
    conditions: [
      {
        operator: "or",
        conditions: [
          { name: "credit_score", logic: ">", value: 700 },
          { name: "", logic: "", value: "" },
        ],
      },
      {
        operator: "or",
        conditions: [
          { name: "age", logic: ">", value: 18 },
        ],
      },
    ],
  },
};

function generateCircomCode(circuit: Circuit): string {
  let code = `pragma circom 2.0.0;\ninclude "/Users/eric/programming/typescript/zk_backend/node_modules/circomlib/circuits/comparators.circom";\n\n`;
  
  code += `template ${circuit.name.replace(/\s+/g, '')} () {\n`;
  
  const inputs = new Set<string>();
  collectInputs(circuit.logic, inputs);
  
  code += '    // 宣告輸入信號\n';
  inputs.forEach(input => {
    if (input) code += `    signal input ${input};\n`;
  });
  
  const varCounter: VarCounter = {
    comp: 0,
    intermediate: 0
  };
  
  code += '\n    // 宣告中間變數和比較結果\n';
  const { code: logicCode, finalVar } = processLogicGroup(circuit.logic, varCounter);
  code += logicCode;
  
  code += '\n    // 宣告輸出信號\n';
  code += '    signal output result;\n';
  code += `    result <== ${finalVar};\n`;
  
  code += '}\n\n';
  code += `component main = ${circuit.name.replace(/\s+/g, '')}();`;
  
  return code;
}

function processLogicGroup(logic: LogicGroup, varCounter: VarCounter): LogicProcessResult {
  let code = '';
  
  if (!logic.conditions || logic.conditions.length === 0) {
    return { code: '', finalVar: '0' };
  }
  
  if (logic.conditions.every(c => 'name' in c)) {
    const results = logic.conditions.map(condition => {
      const { code: compCode, outVar } = generateComparison(condition as Condition, varCounter);
      code += compCode;
      return outVar;
    });
    
    const groupResult = `intermediate${varCounter.intermediate++}`;
    code += generateCombination(results, groupResult, logic.operator);
    return { code, finalVar: groupResult };
  }
  
  const subResults: string[] = [];
  for (const condition of logic.conditions) {
    if ('name' in condition) {
      const { code: compCode, outVar } = generateComparison(condition as Condition, varCounter);
      code += compCode;
      subResults.push(outVar);
    } else {
      const { code: subCode, finalVar } = processLogicGroup(condition as LogicGroup, varCounter);
      code += subCode;
      subResults.push(finalVar);
    }
  }
  
  const finalVar = `intermediate${varCounter.intermediate++}`;
  code += generateCombination(subResults, finalVar, logic.operator);
  
  return { code, finalVar };
}

function generateComparison(condition: Condition, varCounter: VarCounter): ComparisonResult {
  const compName = `comp${varCounter.comp++}`;
  const outVar = `${compName}_out`;
  
  let code = `    // 比較 ${condition.name} ${condition.logic} ${condition.value}\n`;
  code += `    signal ${outVar};\n`;
  
  if (condition.logic === "=(number)" || condition.logic === "===") {
    code += `    component ${compName} = IsEqual();\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "!=(number)" || condition.logic === "!==") {
    code += `    component ${compName} = IsNotEqual();\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === ">(number)") {
    code += `    component ${compName} = GreaterThan(32);\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === ">=(number)") {
    code += `    component ${compName} = GreaterEqThan(32);\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "<(number)") {
    code += `    component ${compName} = LessThan(32);\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "<=(number)") {
    code += `    component ${compName} = LessEqThan(32);\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "==(string)") {
    code += `    component ${compName} = IsEqualString();\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "==(bool)") {
    code += `    component ${compName} = IsEqual();\n`;
    code += `    ${compName}.in[0] <== ${condition.name};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  }

  code += `    ${outVar} <== ${compName}.out;\n\n`;
  
  return { code, outVar };
}

function generateCombination(vars: string[], resultVar: string, operator: 'and' | 'or'): string {
  let code = `    // 計算 ${operator} 運算結果\n`;
  code += `    signal ${resultVar};\n`;
  
  if (vars.length === 1) {
    code += `    ${resultVar} <== ${vars[0]};\n\n`;
    return code;
  }
  
  if (operator === "and") {
    code += `    ${resultVar} <== ${vars.join(" * ")};\n\n`;
  } else if (operator === "or") {
    if (vars.length === 2) {
      code += `    ${resultVar} <== ${vars[0]} + ${vars[1]} - (${vars[0]} * ${vars[1]});\n\n`;
    } else {
      // 處理多個OR條件
      let result = vars[0];
      for (let i = 1; i < vars.length; i++) {
        result = `(${result} + ${vars[i]} - (${result} * ${vars[i]}))`;
      }
      code += `    ${resultVar} <== ${result};\n\n`;
    }
  }
  
  return code;
}

function collectInputs(logic: LogicGroup, inputs: Set<string>): void {
  if (logic.conditions) {
    logic.conditions.forEach(condition => {
      if ('name' in condition) {
        inputs.add(condition.name);
      } else {
        collectInputs(condition as LogicGroup, inputs);
      }
    });
  }
}

const generatedCircom = generateCircomCode(circuits);
console.log(generatedCircom);

export default generateCircomCode;