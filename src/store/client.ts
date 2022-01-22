import { configureStore, Slice } from '@reduxjs/toolkit';

import display from "./slices/display";
import role from "./slices/role";

const slices = {
  display, role
};

const getActionsFromSlices = <T extends Record<string, Slice>>(
  obj: T
): { [P in keyof T]: T[P]["actions"] } => (Object.entries(obj).reduce(
  (prev, [k, v]) => (prev[k] = v.actions, prev), {} as any)
);

const getReducersFromSlices = <T extends Record<string, Slice>>(
  obj: T
): { [P in keyof T]: T[P]["reducer"] } => (Object.entries(obj).reduce(
  (prev, [k, v]) => (prev[k] = v.reducer, prev), {} as any)
);

export const actions = getActionsFromSlices(slices);
export const createStore = () => configureStore({ 
  reducer: getReducersFromSlices(slices),
});
export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store["getState"]>;
