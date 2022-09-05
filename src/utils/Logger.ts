import chalk from "chalk";
import { readFileSync } from "fs";

export default {
    info: (message: string) => {
        console.log(chalk.yellow("- ") + chalk.bold("Info ") + chalk.gray("» ") + chalk.reset(message));
    },

    success: (message: string) => {
        console.log(chalk.green("√ ") + chalk.bold("Success ") + chalk.gray("» ") + chalk.reset(message));
    },

    error: (message: string) => {
        console.log(chalk.red("x ") + chalk.bold("Error ") + chalk.gray("» ") + chalk.reset(message));
    }
};

export function logCrown() : void {
    console.log(readFileSync(`${__dirname}/$resources/art/crown.txt`, { encoding: "utf-8" }).replace(
        /(_|\||\*|\+)/g,
        input => ["_", "|"].includes(input) ? chalk.yellow(input) : chalk.red(input === "*" ? "_" : "|")
    ));
}