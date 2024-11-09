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
  groupConditions: []
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
    setGroupCondition: (state, action: PayloadAction<GroupCondition>) => {
      // @ts-ignore
      state.groupConditions = [...state.groupConditions, action.payload];
    }
  },
});

export const { setCircuitName, setCircuitDescription, setGroupCondition} = circuitSlice.actions;
export default circuitSlice.reducer;
