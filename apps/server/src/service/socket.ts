import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "",
  port: 6379,
  username: "jayabrata180402@gmail.com",
  password: "",
});

const sub = new Redis({
  host: "",
  port: 6379,
  username: "jayabrata180402@gmail.com",
  password: "",
});
class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }
  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log(`New Messsage Received`, message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}
export default SocketService;
