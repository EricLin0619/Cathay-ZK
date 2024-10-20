import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    name: "",
    email: "",
    login: false,
}


const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setLogin: (state, action) => {
            const { name, email } = action.payload
            state = {
                name,
                email,
                login: true,
            }
            return state
            // return {
            //     name: action.payload.name,
            //     email: action.payload.email,
            //     login: true,
            // };
        },
        setLogout: (state) => {
            state.name = "";
            state.email = "";
            state.login = false;
        }
    }
});

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;
