// import { KlaruSocketServer } from './../src/module/KlaruSocketServer';
//
// const server = new KlaruSocketServer();
//
// server.listen(7001, "127.0.0.1", () => console.log("listening"))


import {convertIncomeBuffer, convertToBytes} from "../src/module/features/functions";
import {SocketCommunicationFlags, SocketCommunicationMessageType} from "../src/module/features/Enums";

/*
const num = 2048;
const sliced = sliceNumberToOctaves(num);
const unsliced = concatOctavesToNumber(sliced);
console.log(sliced, unsliced)
*/


//console.log(unshiftBits(19))


const res = convertToBytes(SocketCommunicationMessageType.SYS, 5, "Hello, fucking ass", 228);
console.log(res)
const undec = convertIncomeBuffer(res);
console.log(undec)