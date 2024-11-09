"use client"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux";
import CreateCircuit from "@components/genCircuit/createCircuit"
import CircuitReducer from "../store/circuitSlice"
const store = configureStore({
  reducer: {
    circuit: CircuitReducer,
  },
});


export default function Home() {
  return (
    <Provider store={store}>
      <CreateCircuit />
x    </Provider>
  );
}
