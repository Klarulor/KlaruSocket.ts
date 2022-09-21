const chars = "qwertyuiopasdfghjklzxcvbnm";
const numbers = "1234567890";
const symbols = "!@#$%^&*()_+{}";

const characters = chars + numbers;

export function createString(length: number = 8): string{
    let sb = "";
    for(let i = 0; i < length; i++){
        sb += characters[randomAt(0, characters.length)];
    }
    return sb;
}

export const randomAt = (min: number, max: number) => Math.round((Math.random() * (max - min)) + min);