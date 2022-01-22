
import { WebSocketServer, ServerOptions, WebSocket } from 'ws';

import { actions, createStore } from "store/server";
import { actions as clientActions, RootState } from "store/client";
import { countHandsOnTTTBoard, createInitialTTTBoard, isTTTBoardWon } from "lib/tit-tat-toe";
import logger from "./logger";

const OPTIONS: ServerOptions = {
  port: 4000,
};

(async () => {
  const server = new WebSocketServer(OPTIONS);
  const store = createStore();
  const clients: WebSocket[] = [];

  // クライアント接続時の処理とクライアントからのデータ受信による処理
  server.on("connection", socket => {
    // 役割の判定
    const role: RootState["role"]["value"] = ({ 0: "O", 1: "X" } as const)[clients.length] ?? "A";
    logger.info(`Connection! No. ${clients.length + 1}, Role: ${role}`);

    // ============= 接続時の処理 ===============
    {
      // クライアントリストへの登録
      clients.push(socket);

      // クライアントに最新の表示情報と役割を送る。
      socket.send(JSON.stringify(clientActions.display.updateAll(store.getState().display)));
      socket.send(JSON.stringify(clientActions.role.updateRole(role)));

      // 後手が接続されたら、ゲームを開始する。
      if (role === "X") {
        const action = actions.display.setStatus("O-Turn");
        store.dispatch(action);
        clients.forEach(client => client.send(JSON.stringify(action)));
      }

      // 観客が接続したら、観客数を更新する。
      if (role === "A") {
        const action = actions.display.setAudience(store.getState().display.audience + 1);
        store.dispatch(action);
        clients.forEach(client => client.send(JSON.stringify(action)));
      }
    }

    // ============= メッセージ受信時の処理 ===============
    socket.on("message", async data => {
      // 自分のターンでない場合におけるメッセージ受信は異常。
      const status = store.getState().display.status;
      if (!(role === "O" && status === "O-Turn") && !(role === "X" && status === "X-Turn")) {
        logger.warn("Message received on accepting", data);
        socket.close();
        return;
      }

      // メッセージを受信したら、サーバー上のデータを更新し、また全員に送信する。
      try {
        store.dispatch(JSON.parse(data.toString()));
        clients.forEach(client => client.send(data.toString()));
      } catch (e) {
        logger.warn("Illegal message:", e);
        socket.close();
        return;
      }

      // 勝敗が決定していない場合、先手・または後手のターンを確認し、更新・送信する。
      // 勝敗・引き分けが決定した場合、ステータスを更新・送信し、接続を切断する。
      const board = store.getState().display.board;
      const hands = countHandsOnTTTBoard(board)
      const newStatus: RootState["display"]["status"] =
        isTTTBoardWon(board, "O") ? "O-Won"
          : isTTTBoardWon(board, "X") ? "X-Won"
            : countHandsOnTTTBoard(board) >= 9 ? "Draw"
              : (hands % 2) === 1 ? "X-Turn" : "O-Turn";
      const action = actions.display.setStatus(newStatus);
      store.dispatch(action);
      clients.forEach(client => client.send(JSON.stringify(action)));

      if (["O-Won", "X-Won", "Draw"].includes(newStatus)) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // IMPROVEME: バッファーが空になるのを待機したほうがよい
        clients.forEach(client => client.close());
      }

    });

    // ============= 切断時の処理 ===============
    socket.on("close", () => {
      // 接続が切断されたら、プレイヤーの場合は全員の接続を切断し、盤面をクリアする。
      if (["O", "X"].includes(role)) {
        clients.forEach(client => client.close());
        store.dispatch(actions.display.updateAll({
          audience: 0,
          board: createInitialTTTBoard(),
          status: "Accepting",
        }));
        clients.splice(0, clients.length);
        return;
      }

      // 観客の場合は、クライアントリストから削除し、観客数を更新し、クライアントにも送る。
      if (role === "A") {
        const action = actions.display.setAudience(store.getState().display.audience - 1);
        store.dispatch(action);
        clients.forEach(client => client.send(JSON.stringify(action)));
        clients.splice(clients.indexOf(socket), 1);
        return;
      }
    });
  });

  // サーバーの起動
  try {
    await new Promise<void>((resolve, reject) => {
      const off = () => {
        server.off("listening", resolve);
        server.off("error", reject);
      };
      server.on("listening", () => { off(); resolve() });
      server.on("error", err => { off(); reject(err) });
    });
  } catch (e) {
    logger.error("Server faild to start.");
    logger.error(e);
    return;
  }

  logger.info(`Server started.`);
})();
