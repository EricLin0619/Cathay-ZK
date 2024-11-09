const circuits = {
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


function generateCircomCode(circuit) {
    let code = `pragma circom 2.0.0;\ninclude "node_modules/circomlib/circuits/comparators.circom";\n\n`;
    
    // 生成主模板
    code += `template ${circuit.name.replace(/\s+/g, '')} () {\n`;
    
    // 收集所有輸入變數
    const inputs = new Set();
    collectInputs(circuit.logic, inputs);
    
    // 生成輸入信號
    code += '    // 宣告輸入信號\n';
    inputs.forEach(input => {
      code += `    signal input ${input};\n`;
    });
    
    let varCounter = {
      comp: 0,
      intermediate: 0
    };
    
    // 生成中間變數和輸出
    code += '\n    // 宣告中間變數和比較結果\n';
    const { code: logicCode, finalVar } = processLogicGroup(circuit.logic, varCounter);
    code += logicCode;
    
    // 宣告並設置輸出
    code += '\n    // 宣告輸出信號\n';
    code += '    signal output result;\n';
    code += `    result <== ${finalVar};\n`;
    
    code += '}\n\n';
    code += `component main = ${circuit.name.replace(/\s+/g, '')}();`;
    
    return code;
  }
  
  function processLogicGroup(logic, varCounter) {
    let code = '';
    
    if (!logic.conditions || logic.conditions.length === 0) {
      return { code: '', finalVar: '0' };
    }
    
    // 如果是基本條件（沒有子條件）
    if (logic.conditions.every(c => c.name)) {
      const results = logic.conditions.map(condition => {
        const { code: compCode, outVar } = generateComparison(condition, varCounter);
        code += compCode;
        return outVar;
      });
      
      // 合併這組條件的結果
      const groupResult = `intermediate${varCounter.intermediate++}`;
      code += generateCombination(results, groupResult, logic.operator);
      return { code, finalVar: groupResult };
    }
    
    // 處理複雜邏輯組
    const subResults = [];
    for (const condition of logic.conditions) {
      if (condition.name) {
        // 基本條件
        const { code: compCode, outVar } = generateComparison(condition, varCounter);
        code += compCode;
        subResults.push(outVar);
      } else {
        // 遞迴處理子邏輯組
        const { code: subCode, finalVar } = processLogicGroup(condition, varCounter);
        code += subCode;
        subResults.push(finalVar);
      }
    }
    
    // 合併所有子結果
    const finalVar = `intermediate${varCounter.intermediate++}`;
    code += generateCombination(subResults, finalVar, logic.operator);
    
    return { code, finalVar };
  }
  
  function generateComparison(condition, varCounter) {
    const compName = `comp${varCounter.comp++}`;
    const outVar = `${compName}_out`;
    
    let code = `    // 比較 ${condition.name} ${condition.logic} ${condition.value}\n`;
    code += `    signal ${outVar};\n`;
    
    if (condition.logic === "==" || condition.logic === "===") {
      code += `    component ${compName} = IsEqual();\n`;
      code += `    ${compName}.in[0] <== ${condition.name};\n`;
      code += `    ${compName}.in[1] <== ${condition.value};\n`;
    } else if (condition.logic === ">") {
      code += `    component ${compName} = GreaterThan(32);\n`;
      code += `    ${compName}.in[0] <== ${condition.name};\n`;
      code += `    ${compName}.in[1] <== ${condition.value};\n`;
    } else if (condition.logic === ">=") {
      code += `    component ${compName} = GreaterEqThan(32);\n`;
      code += `    ${compName}.in[0] <== ${condition.name};\n`;
      code += `    ${compName}.in[1] <== ${condition.value};\n`;
    } else if (condition.logic === "<") {
      code += `    component ${compName} = LessThan(32);\n`;
      code += `    ${compName}.in[0] <== ${condition.name};\n`;
      code += `    ${compName}.in[1] <== ${condition.value};\n`;
    } else if (condition.logic === "<=") {
      code += `    component ${compName} = LessThanOrEqual(32);\n`;
      code += `    ${compName}.in[0] <== ${condition.name};\n`;
      code += `    ${compName}.in[1] <== ${condition.value};\n`;
    }

    code += `    ${outVar} <== ${compName}.out;\n\n`;
    
    return { code, outVar };
  }
  
  function generateCombination(vars, resultVar, operator) {
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
  
  function collectInputs(logic, inputs) {
    if (logic.conditions) {
      logic.conditions.forEach(condition => {
        if (condition.name) {
          inputs.add(condition.name);
        } else {
          collectInputs(condition, inputs);
        }
      });
    }
}

const generatedCircom = generateCircomCode(circuits);
console.log(generatedCircom);
