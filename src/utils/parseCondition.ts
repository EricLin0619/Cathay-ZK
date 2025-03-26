import { Condition, ConditionGroup } from "../type/circuit";

function isCondition(obj: any): obj is Condition {
  return (
    obj.name !== undefined && obj.logic !== undefined && obj.value !== undefined
  );
}

export function parseCondition(condition: ConditionGroup | Condition): string {
  if (isCondition(condition)) {
    if (!condition.name) return "";
    return `${condition.name} ${condition.logic} ${condition.value}`;
  } else {
    if (condition.operator === "and" || condition.operator === "or") {
      const validConditions = condition.conditions.filter((c) =>
        isCondition(c) ? !!c.name : true
      );

      if (validConditions.length === 0) return "";

      const parsedConditions = validConditions
        .map((c) => parseCondition(c))
        .filter((c) => c !== "");
      return `(${parsedConditions.join(` ${condition.operator} `)})`;
    } else {
      // 處理沒有運算符的情況，直接解析第一個有效條件
      const validConditions = condition.conditions.filter((c) =>
        isCondition(c) ? !!c.name : true
      );

      if (validConditions.length === 0) return "";

      return parseCondition(validConditions[0]);
    }
  }
}

export function extractFields(expression: string): string[] {
  // 修改正則表達式以匹配所有支援的型別
  const fieldPattern = /([a-zA-Z_]\w*)\s*(?:[=!<>]=?|={2,3})\s*(?:\((\w+)\)|(-?\d+(?:\.\d+)?|true|false|["'].*?["']))/g;
  const matches = expression.matchAll(fieldPattern);

  if (!matches) {
    return [];
  }

  const fields = Array.from(matches).map(match => {
    const fieldName = match[1].trim();
    let type: string;
    
    if (match[2]) {
      // 處理明確指定型別的情況，如 field === (string)
      type = match[2];
    } else {
      // 根據值推斷型別
      const value = match[3];
      if (value === 'true' || value === 'false') {
        type = 'bool';
      } else if (/^-?\d+(?:\.\d+)?$/.test(value)) {
        type = 'number';
      } else {
        type = 'string';
      }
    }
    
    return `${fieldName} (${type})`;
  });

  // 去重
  return Array.from(new Set(fields));
}

