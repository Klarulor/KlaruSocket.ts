// import { KlaruSocketServer } from './../src/module/KlaruSocketServer';
//
// const server = new KlaruSocketServer();
//
// server.listen(7001, "127.0.0.1", () => console.log("listening"))


import {numToBitEnum, shiftBits, sliceNumberToOctaves} from "../src/module/features/functions";
import {SocketCommunicationFlags} from "../src/module/features/Enums";


console.log(sliceNumberToOctaves(429496737))
