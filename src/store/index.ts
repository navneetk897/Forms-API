import { configureStore } from "@reduxjs/toolkit";

import reducers from "./reducers";

const store = configureStore({
    reducer: reducers
});

const { dispatch } = store;

export {store, dispatch};

export type AppDispatch = typeof store.dispatch;
export type Rootstate = ReturnType<typeof store.getState>;