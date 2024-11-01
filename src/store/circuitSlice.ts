import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const initialState = {
  circuitName: "",
  circuitDescription: "",
  groupCondition_1: {
    operator: "",
    condition: [{
        name: "",
        logic: "",
        value: ""
    }]
  },
  condition: [
    {
        logic: "",
        conditions: [
            {
                name: "",
                logic: "",
                value: ""
            }
        ]
    }
  ]
}
const circuitSlice = createSlice({
  name: "circuit",
  initialState,
  reducers: {
    setCircuitName: (state, action: PayloadAction<string>) => {
      state.circuitName = action.payload;
    },
    setCircuitDescription: (state, action: PayloadAction<string>) => {
      state.circuitDescription = action.payload;
    },
    setCondition: (state, action: PayloadAction<GroupCondition[]>) => {
      state.condition = action.payload;
    }
  },
});

export const { setCircuitName, setCircuitDescription, setCondition} = circuitSlice.actions;
export default circuitSlice.reducer;