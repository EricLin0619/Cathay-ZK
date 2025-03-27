export interface Condition {
    name: string;
    logic: string;
    value: string;
}

export interface ConditionGroup {
    operator: string;
  conditions: (ConditionGroup | Condition)[];
}

export interface Circuit {
    id: number;
    name: string;
    description: string;
    uuid: string;
    contract_address: string;
    circuit_logic: ConditionGroup;
}