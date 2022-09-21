import { KlaruSocketServer } from './../src/module/KlaruSocketServer';

const server = new KlaruSocketServer();

server.listen(7001, "127.0.0.1", () => console.log("listening"))