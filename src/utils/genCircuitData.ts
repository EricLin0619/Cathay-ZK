import { GroupConditions } from "@/interfaces/circuit";

function  genCircuitData (
    circuitName: string,
    circuitDescription: string,
    groupCondition_1: GroupConditions | undefined,
    groupCondition_2: GroupConditions | undefined,
    groupCondition_3: GroupConditions | undefined,
    logicOperator_1: string | undefined,
    logicOperator_2: string | undefined
) {
    const logic = {
        operator: logicOperator_1,
        conditions: [
            groupCondition_1
        ]
    }
}