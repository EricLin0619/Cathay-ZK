"use client"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux";
import userReducer from "../store/userSlice"
import CreateCircuit from "@components/createCircuit"
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});


export default function Home() {
  return (
    <Provider store={store}>
      <CreateCircuit />
x    </Provider>
  );
}
