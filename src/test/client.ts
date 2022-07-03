import {KlaruSocketClient} from "../module/KlaruSocketClient";

const client: KlaruSocketClient = new KlaruSocketClient("da");
client.connect(1111, "127.0.0.1");


client.subscribe("kak", req => {
    console.log(req.data)
    req.reply("tak");
})


setTimeout(async () => {
    const req = await client.get("test", 100);
    console.log(req.content);
}, 1000);