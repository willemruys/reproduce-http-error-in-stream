import { Server } from "./server.js";

async function run() {
  const server = new Server();
  await server.run();
  await server.send("foobar");
}

run();
