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
  // 使用正则表达式匹配字段名
  const fieldPattern = /([a-zA-Z_]\w*)\s*[=><]/g;
  const matches = expression.match(fieldPattern);

  if (!matches) {
    return [];
  }

  // 先去除運算符，再清理空白
  const fields = matches.map(match => 
    match.replace(/[=><]/g, "").trim()
  );

  // 去重
  return Array.from(new Set(fields));
}

