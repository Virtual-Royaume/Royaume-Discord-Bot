import { readFileSync } from "fs";

const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    thin: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        gray: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m"
    },

    bg: {
        gray: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m"
    }
};

export default {
    info: (message: string) => {
        console.log(`${colors.fg.yellow}- ${colors.bold}${colors.fg.white}Info${colors.reset}    ${colors.fg.gray}» ${colors.reset}${message}`);
    },

    success: (message: string) => {
        console.log(`${colors.fg.green}√ ${colors.bold}${colors.fg.white}Success${colors.reset} ${colors.fg.gray}» ${colors.reset}${message}`);
    },

    error: (message: string) => {
        console.log(`${colors.fg.red}x ${colors.bold}${colors.fg.white}Error  ${colors.reset} ${colors.fg.gray}» ${colors.reset}${message}`);
    }
};

export function logCrown() : void {
    console.log(readFileSync(`${__dirname}/../../resources/art/crown.txt`, { encoding: "utf-8" }).replace(
        /(_|\||\*|\+)/g,
        input => ["_", "|"].includes(input) ? `${colors.fg.yellow}${input}` : `${colors.fg.red}${input === "*" ? "_" : "|"}`
    ));
}