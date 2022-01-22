import EventEmitter from 'eventemitter3';

const URL = import.meta.env.SERVER_URL as string ?? `ws://${location.hostname}:4000`;

const EventNames = ["close", "error", "message", "open"] as const;
type EventTypes = {
  [K in ((typeof EventNames)[any])]
  : K extends keyof WebSocketEventMap ? (ev: WebSocketEventMap[K]) => any : never
};

/**
 * Socketクラス
 * WebSocketをラップし、未接続の状態でもオブジェクト化を可能とする。
 * EventTargetではなく、EventEmitter + (un)subscribeインターフェースを持つ。
 * connect/disconnectメソッドは、接続完了/切断完了時に解決するpromiseを返す。
 * Note: Socket.ioはこのあたりの処理をラップし、かつ再接続の処理を持っているているはず。
 */
export default class Socket extends EventEmitter<EventTypes> {
  private _socket: WebSocket | null = null;
  public get socket(): WebSocket | null {
    return this._socket;
  }
  public set socket(value: WebSocket | null) {
    this._socket = value;
  }
  eventNames() {
    return [...EventNames];
  }
  subscribe = <T extends keyof EventTypes>(ev: T, fn: EventTypes[T]) => {
    this.on(ev, fn as any);
    return () => this.unsubscribe(ev, fn);
  }
  unsubscribe = <T extends keyof EventTypes>(ev: T, fn: EventTypes[T]) => {
    this.off(ev, fn as any);
  }
  connect = async () => {
    if (this._socket) {
      return this;
    }
    try {
      await new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(URL);
        const onOpen = () => {
          ws.removeEventListener("open", onOpen);
          ws.removeEventListener("error", onError);
          resolve();
        };
        const onError = (e: Event) => {
          ws.removeEventListener("open", onOpen);
          ws.removeEventListener("error", onError);
          reject(e);
        }
        ws.addEventListener("open", onOpen);
        ws.addEventListener("error", onError);

        for (const name of EventNames) {
          this.listeners(name).forEach(fn => ws.addEventListener(name, fn));
        }
        ws.addEventListener("close", () => { this._socket = null });
        this._socket = ws;
      });
      return this;
    } catch (e) {
      throw e;
    }
  }
  disconnect = async () => {
    const socket = this._socket;
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      return this;
    }
    await new Promise<any>(resolve => {
      socket.addEventListener("close", resolve, { once: true });
      this._socket?.close();
      // Note: this_socketは"close"イベントによりクリアされる。connectメソッド参照。
    });
    return this;
  }
  send = (data: Parameters<WebSocket["send"]>[0]) => {
    if (!this._socket) {
      throw new Error("Not connected.");
    }
    this._socket.send(data);
  }
  public get isOpen() {
    return this._socket ? this._socket.readyState === WebSocket.OPEN : false;
  }
};
