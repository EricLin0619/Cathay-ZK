interface Condition {
    name: string;
    logic: string;
    value: string;
}

interface GroupCondition {
    logic: string;
    conditions: Condition[];
}

interface Circuit {
    circuitName: string;
    circuitDescription: string;
    condition: GroupCondition[];
}

export interface RootState {
    circuit: Circuit;
}