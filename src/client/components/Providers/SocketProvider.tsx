import { createContext, FC, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

import Socket from "client/interfaces/socket";

export const SocketContext = createContext<Socket | null>(null);
export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("No SocketContext provided.");
  }
  return ctx;
}

export const useSocketIsConnected = () => {
  const [, forceUpdate] = useReducer(() => [], []);
  const ctx = useSocketContext();
  useEffect(()=>ctx.subscribe("open", forceUpdate));
  useEffect(()=>ctx.subscribe("close", forceUpdate));
  return ctx.isOpen;
}

type Props = {
  children: ReactNode | ReactNode[],
};

const SocketProvider: FC<Props> = ({ children }) => {
  const [socket] = useState(()=>new Socket());
  return <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
};

export default SocketProvider;
