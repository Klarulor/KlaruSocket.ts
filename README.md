# KlaruSocket - MultiLanguage socket
Socket to communicate with a response to a specific request

## Installation


```
$ npm install klarusocket
```
## Example
```
$ git clone https://github.com/Klarulor/KlaruSocket.ts.git --depth 1
$ cd example
```
*server.ts*
```typescript
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
```

*client*
```typescript
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
```