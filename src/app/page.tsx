"use client"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux";
import userReducer from "../store/userSlice"
import Navbar from "@components/navbar"
import CreateCircuit from "@components/createCircuit"
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});


export default function Home() {
  return (
    <Provider store={store}>
      <Navbar />
      <CreateCircuit />
    </Provider>
  );
}
