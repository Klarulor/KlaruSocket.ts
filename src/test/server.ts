import {KlaruSocketServer} from "../module/KlaruSocketServer";

const server: KlaruSocketServer = new KlaruSocketServer();
server.listen(1111, "127.0.0.1", () => {
    console.log("Listening");
})


server.on(`auth`, client => {
    console.log("auth");
})

server.subscribe("test", req => {
    console.log(req.data)
    req.reply("da");
})

setTimeout(async () => {
    const req = await server.getClients()[0].get("kak", "oof");
    console.log(req.content);
    //console.log(server.getClients().length)
}, 5000);