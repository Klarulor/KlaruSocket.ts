import { KlaruSocketClient } from "../src/module/KlaruSocketClient";


const client = new KlaruSocketClient("gay");

client.connect(7001, "127.0.0.1", "gay",() => {
    console.log("connected");
    const buffer = Buffer.alloc(2, 0);
    buffer.fill(new Uint8Array([0,1,2,3,4,5]));
    client.connection.sendBytes(buffer)
})