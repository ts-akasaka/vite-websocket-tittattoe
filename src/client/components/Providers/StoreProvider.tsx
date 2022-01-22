import { createContext, FC, ReactNode, useContext, useEffect, useReducer, useState } from 'react';
import shallowEqual from 'shallowequal';

import { createStore, Store, RootState } from "store/client";

export const StoreContext = createContext<Store | null>(null);
export const useStoreContext = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("No StoreContext provided.");
  }
  return ctx;
}
export const useSelector = <T extends unknown>(fn: (root: RootState) => T, compare?: (a: T, b: T) => boolean): T => {
  const store = useStoreContext();
  const [, forceUpdate] = useReducer(()=>[], []);
  const [current] = useState<{value: T}>(() => ({ value: fn(store.getState()) }));
  useEffect(() => store.subscribe(() => {
    const value = fn(store.getState());
    if (compare ? compare(current.value, value) : current.value !== value) {
      current.value = value;
      forceUpdate();
    }
  }), []);
  return current.value;
};
export const useSelectorShallow = <T extends unknown>(fn: (root: RootState) => T) => useSelector(fn, shallowEqual);

type Props = {
  children: ReactNode | ReactNode[],
};

const StoreProvider: FC<Props> = ({ children }) => {
  const [store] = useState(() => createStore());
  return <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
};

export default StoreProvider;
