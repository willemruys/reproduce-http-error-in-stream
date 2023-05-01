import nock from "nock";
import { test, describe } from "@jest/globals";
import { Server } from "../src/server.js";

describe("server.js", () => {
  test("Run server and send data", async () => {
    nock("https://jsonplaceholder.typicode.com")
      .get("/todos")
      .reply(200, { data: "foobar" });

    const server = new Server();
    await server.run();
    await server.send("foobar");
  });
});
