import { configureStore } from "@reduxjs/toolkit";
import { load, save } from "redux-localstorage-simple";
import application from "./modules/application/applicationSlice";
import bridge from "./modules/bridge/bridgeSlice";
import burn from "./modules/burn/burnSlice";
import { updateVersion } from "./modules/global/actions";
import lists from "./modules/lists/reducer";
import mint from "./modules/mint/mintSlice";
import multicall from "./modules/multicall/reducer";
import swap from "./modules/swap/swapSlice";
import transactions from "./modules/transactions/transactionsSlice";
import user from "./modules/user/reducer";
import { bridgeHistoryApi } from "./modules/bridgeHistory/services/bridgeHistory";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const PERSISTED_KEYS: string[] = ["user", "transactions", "lists"];

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    bridge,
    multicall,
    lists,
    [bridgeHistoryApi.reducerPath]: bridgeHistoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS })).concat(bridgeHistoryApi.middleware),
  preloadedState: load({ states: PERSISTED_KEYS }),
  devTools: process.env.NODE_ENV !== "production",
});

store.dispatch(updateVersion());

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
