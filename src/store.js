import { configureStore } from "@reduxjs/toolkit";
import { characterReducer } from "./store/reducer/characterReducer";
export const store = configureStore({
  reducer: {
        characters: characterReducer
    }

});