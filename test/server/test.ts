import { WebSocket } from "ws";

const ENDPOINT = "ws://localhost:4000";

test("サーバーに接続する", async () => {
  const ws = new WebSocket(ENDPOINT);
  await new Promise((resolve, reject) => {
    ws.on("open", resolve);
    ws.on("error", reject);
  });
  ws.close();
  expect(true).toBeTruthy();
});

