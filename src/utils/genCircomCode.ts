import { createHash } from 'crypto';
const { buildPoseidon } = require('circomlibjs')
import * as dotenv from 'dotenv';
dotenv.config();


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

function generateHashName(chineseStr: string): string {
  // 使用 MD5 hash（也可以用其他算法如 SHA-1, SHA-256 等）
  const hash = createHash('md5')
    .update(chineseStr)
    .digest('hex')
    .substring(0, 8); // 取前8位即可
    
  // 加上前綴 'v' 確保變數名以字母開頭
  const varName = `v${hash}`;
  // console.log(`中文: ${chineseStr} -> 變數名: ${varName}`);
  return varName;
}

function stringToHex(str: string) {
  const strBytes = new TextEncoder().encode(str);
  const strHex = Array.from(strBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `0x${strHex}`
}

async function generateCircomCode(circuit: Circuit): Promise<string> {
  let code = `pragma circom 2.0.0;\ninclude "${process.env.NEXT_PUBLIC_CIRCOMLIB_PATH}";\n\n`;
  
  code += `template ${circuit.name.replace(/\s+/g, '')} () {\n`;
  
  const inputs = new Set<string>();
  collectInputs(circuit.logic, inputs);
  
  code += '    // 宣告輸入信號\n';
  inputs.forEach(input => {
    if (input) code += `    signal input ${generateHashName(input)};\n`;
  });
  
  const varCounter: VarCounter = {
    comp: 0,
    intermediate: 0
  };
  
  code += '\n    // 宣告中間變數和比較結果\n';
  const { code: logicCode, finalVar } = await processLogicGroup(circuit.logic, varCounter);
  code += logicCode;
  
  code += '\n    // 宣告輸出信號\n';
  code += '    signal output result;\n';
  code += `    result <== ${finalVar};\n`;
  
  code += '}\n\n';
  code += `component main = ${circuit.name.replace(/\s+/g, '')}();`;
  
  return code;
}

async function processLogicGroup(logic: LogicGroup, varCounter: VarCounter): Promise<LogicProcessResult> {
  let code = '';
  
  if (!logic.conditions || logic.conditions.length === 0) {
    return { code: '', finalVar: '0' };
  }
  
  // 過濾掉空白的條件
  const validConditions = logic.conditions.filter(c => 
    !('name' in c) || (c as Condition).name !== ''
  );
  
  if (validConditions.length === 0) {
    return { code: '', finalVar: '0' };
  }
  
  if (validConditions.every(c => 'name' in c)) {
    // 使用 Promise.all 處理多個異步操作
    const results = await Promise.all(validConditions.map(async condition => {
      const { code: compCode, outVar } = await generateComparison(condition as Condition, varCounter);
      code += compCode;
      return outVar;
    }));
    
    const groupResult = `intermediate${varCounter.intermediate++}`;
    code += generateCombination(results, groupResult, logic.operator);
    return { code, finalVar: groupResult };
  }
  
  // 處理子結果的異步操作
  const subResults: string[] = [];
  for (const condition of validConditions) {
    if ('name' in condition) {
      const { code: compCode, outVar } = await generateComparison(condition as Condition, varCounter);
      code += compCode;
      subResults.push(outVar);
    } else {
      const { code: subCode, finalVar } = await processLogicGroup(condition as LogicGroup, varCounter);
      code += subCode;
      if (finalVar !== '0') {  // 只有當子群組有有效結果時才加入
        subResults.push(finalVar);
      }
    }
  }
  
  if (subResults.length === 0) {
    return { code: '', finalVar: '0' };
  }
  
  const finalVar = `intermediate${varCounter.intermediate++}`;
  code += generateCombination(subResults, finalVar, logic.operator);
  return { code, finalVar };
}

async function generateComparison(condition: Condition, varCounter: VarCounter): Promise<ComparisonResult> {
  const compName = `comp${varCounter.comp++}`;
  const outVar = `${compName}_out`;
  
  let code = `    // 比較 ${condition.name} ${condition.logic} ${condition.value}\n`;
  code += `    signal ${outVar};\n`;
  
  // transform input field to md5 hash with v prefix
  const inputName = generateHashName(condition.name)
  
  if (condition.logic === "=(number)" || condition.logic === "===") {
    code += `    component ${compName} = IsEqual();\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "!=(number)" || condition.logic === "!==") {
    code += `    component ${compName} = IsNotEqual();\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === ">(number)") {
    code += `    component ${compName} = GreaterThan(32);\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === ">=(number)") {
    code += `    component ${compName} = GreaterEqThan(32);\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "<(number)") {
    code += `    component ${compName} = LessThan(32);\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "<=(number)") {
    code += `    component ${compName} = LessEqThan(32);\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${condition.value};\n`;
  } else if (condition.logic === "==(string)") {
    // transform value to poseidon hash string
    let value = condition.value as string
    const poseidon = await buildPoseidon();
    const hexWithPrefix = stringToHex(value)
    const poseidonHash = poseidon.F.toString(poseidon([hexWithPrefix])); 

    code += `    component ${compName} = IsEqualString();\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${poseidonHash};\n`;
  } else if (condition.logic === "!=(string)") {
    // transform value to poseidon hash string
    let value = condition.value as string
    const poseidon = await buildPoseidon();
    const hexWithPrefix = stringToHex(value)
    const poseidonHash = poseidon.F.toString(poseidon([hexWithPrefix])); 

    code += `    component ${compName} = IsNotEqualString();\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
    code += `    ${compName}.in[1] <== ${poseidonHash};\n`;
  }else if (condition.logic === "==(bool)") {
    code += `    component ${compName} = IsEqual();\n`;
    code += `    ${compName}.in[0] <== ${inputName};\n`;
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


export default generateCircomCode;