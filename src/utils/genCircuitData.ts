// 輸入的 GroupCondition 類型
interface InputCondition {
  inputValue: string;
  comparator: string;
  value: string | number;
}

interface GroupConditions {
  logic: string;
  conditions: InputCondition[];
}

// 輸出的 Circuit 類型
interface OutputCondition {
  name: string;
  logic: string;
  value: string | number;
}

interface LogicGroup {
  operator: string;
  conditions: (OutputCondition | LogicGroup)[];
}

interface Circuit {
  name: string;
  description: string;
  logic: LogicGroup;
}

function transformCondition(input: InputCondition): OutputCondition {
  return {
    name: input.inputValue,
    logic: input.comparator,
    value: input.value,
  };
}

function genCircuitData(
  circuitName: string,
  circuitDescription: string,
  groupCondition_1: GroupConditions | undefined,
  groupCondition_2: GroupConditions | undefined,
  groupCondition_3: GroupConditions | undefined,
  logicOperator_1: string,
  logicOperator_2: string
): Circuit {
  let logic: LogicGroup;

  // 只有一個 group condition
  if (!groupCondition_1) {
    throw new Error("At least one group condition is required");
  }

  if (!groupCondition_2) {
    // 單個 group
    logic = {
      operator: groupCondition_1.logic.toLowerCase(),
      conditions: groupCondition_1.conditions.map(transformCondition),
    };
  } else if (!groupCondition_3) {
    // 兩個 groups
    if (!logicOperator_1) {
      throw new Error("Logic operator is required for two group conditions");
    }

    logic = {
      operator: logicOperator_1.toLowerCase(),
      conditions: [
        {
          operator: groupCondition_1.logic.toLowerCase(),
          conditions: groupCondition_1.conditions.map(transformCondition),
        },
        {
          operator: groupCondition_2.logic.toLowerCase(),
          conditions: groupCondition_2.conditions.map(transformCondition),
        },
      ],
    };
  } else {
    // 三個 groups
    if (!logicOperator_1 || !logicOperator_2) {
      throw new Error(
        "Two logic operators are required for three group conditions"
      );
    }

    logic = {
      operator: logicOperator_2.toLowerCase(),
      conditions: [
        {
          operator: logicOperator_1.toLowerCase(),
          conditions: [
            {
              operator: groupCondition_1.logic.toLowerCase(),
              conditions: groupCondition_1.conditions.map(transformCondition),
            },
            {
              operator: groupCondition_2.logic.toLowerCase(),
              conditions: groupCondition_2.conditions.map(transformCondition),
            },
          ],
        },
        {
          operator: groupCondition_3.logic.toLowerCase(),
          conditions: groupCondition_3.conditions.map(transformCondition),
        },
      ],
    };
  }

  return {
    name: circuitName,
    description: circuitDescription,
    logic,
  };
}

export { genCircuitData, type Circuit, type GroupConditions };
