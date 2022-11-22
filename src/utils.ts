import fs from 'fs';
import chalk from 'chalk';

const alertBar = chalk.bgGreen.whiteBright.bold(' * * * * * ');

// Probably shouldn't mess with console.log but hey :D
const cl = console.log;
console.log = function(...args) {
    const text = args[0];
    const alert = args[1];
    const timeText = `[${new Date().toISOString()}]`;
    const topAlertBar = `${(alert ? alertBar + '\n' : '')}`;
    const botAlertBar = `${(alert ? '\n' + alertBar : '')}`;
    args[0] = `${topAlertBar}${(!alert ? timeText : '')} ${text}${botAlertBar}`;
    if(args.length > 1) args.pop();
    cl.apply(console, args);
}

const configFile = fs.readFileSync(__dirname + `/config.json`).toString();
export const settings = JSON.parse(configFile);