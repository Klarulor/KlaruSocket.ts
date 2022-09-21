import { KlaruSocketClient } from "../src/module/KlaruSocketClient";


const client = new KlaruSocketClient("gay");

client.connect(7001, "127.0.0.1", "gay",() => {
    console.log("connected");
})