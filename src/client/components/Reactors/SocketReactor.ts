import { FC, useEffect } from 'react';

import { useDialogContext } from "client/components/Providers/DialogProvider";
import { useSocketContext } from "client/components/Providers/SocketProvider";
import { useStoreContext } from "client/components/Providers/StoreProvider";

type Props = {
};

const SocketReactor: FC<Props> = () => {
  const dialog = useDialogContext();
  const socket = useSocketContext();
  const { dispatch } = useStoreContext();
  useEffect(()=>socket.subscribe("message", async (ev)=>{
    try {
      // Note: 現状、受信データは全てRedux アクションとして扱う。
      const data = JSON.parse(ev.data);
      dispatch(data);
    } catch (e) {
      socket.disconnect();
      await dialog.message({ message: "WebSocket受信メッセージにエラーがあり、接続を切断しました" });
    }
  }), []);
  return null;
};

export default SocketReactor;
