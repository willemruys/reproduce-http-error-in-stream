import axios from "axios";
import net, { createServer } from "net";
import { EventEmitter } from "events";

class Protocol extends EventEmitter {
  stream;
  constructor(stream) {
    super();
    this.stream = stream;
  }
  async send(message) {
    return new Promise((resolve, reject) => {
      this.stream.write(message, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

export class Server {
  PORT = 2314;
  HOST = "127.0.0.1";
  server;
  constructor() {
    this.server = createServer((socket) => {
      socket.on("Close", () => {
        console.log("Server: socket closed");
      });

      socket.on("data", (data) => {
        return socket.emit("message", data);
      });

      socket.on("message", async (message) => {
        return new Promise(async (resolve, reject) => {
          const ack = await handleMessage(message);

          socket.write(JSON.stringify(ack), (err) => {
            if (err) {
              console.log(err);
              reject();
            }
            console.log(
              "Server: Acknowledged message and written back in socket"
            );
            resolve();
          });
        });
      });
    });

    this.server.on("close", () => {
      console.log("Server: connection closed");
    });

    this.server.on("error", (err) => {
      console.log(err);
      console.log("Server: error occurred in server connection");
    });
  }

  async send() {
    return new Promise(async (resolve, reject) => {
      const client = net.connect({ port: 2314 }, () => {
        console.log("Client: connected to server");
      });

      const protocol = new Protocol(client);

      client.on("data", function (data) {
        console.log("Client: Data received by socket");
        client.end();
      });

      client.on("end", function () {
        console.log("Client: disconnected from server");
        resolve();
      });

      client.on("error", (err) => {
        reject(err);
      });

      await protocol.send("data");
    });
  }

  async run() {
    return new Promise((resolve, reject) => {
      this.server.on("error", (err) => {
        reject(err);
      });
      this.server.listen(this.PORT, this.HOST, () => {
        console.info("Server: Server listening");
        return resolve();
      });
    });
  }
}

async function handleMessage() {
  try {
    const data = await axios.get("https://jsonplaceholder.typicode.com/todos");
    return {
      status: "ACK",
      data: data.data,
    };
  } catch (error) {
    return {
      status: "NACK",
      data: null,
    };
  }
}
