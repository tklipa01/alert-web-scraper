import fs from 'fs';

const cl = console.log;
console.log = function(...args) {
    args[0] = `[${new Date().toISOString()}] ${args[0]}`;
    cl.apply(console, args);
}

const configFile = fs.readFileSync(__dirname + `/config.json`).toString();
export const settings = JSON.parse(configFile);