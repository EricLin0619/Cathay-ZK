interface Condition {
    inputValue: string;
    comparator: string;
    value: string;
}

interface GroupConditions {
    logic: string;
    conditions: Condition[];
}


export type { Condition, GroupConditions };