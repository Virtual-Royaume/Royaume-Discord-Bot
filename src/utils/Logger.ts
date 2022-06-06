import colors from "colors";

export default {
    info: (message: string) => {
        console.log(colors.yellow("- ") + colors.bold("Info ") + colors.gray("» ") + colors.reset(message));
    },

    success: (message: string) => {
        console.log(colors.green("√ ") + colors.bold("Success ") + colors.gray("» ") + colors.reset(message));
    },

    error: (message: string) => {
        console.log(colors.red("x ") + colors.bold("Error ") + colors.gray("» ") + colors.reset(message));
    }
};