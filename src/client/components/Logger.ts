import Constants from "../../constants/Constants";
import ColorManager from "colors";

type Colors = keyof ColorManager.Color;
type Type = "info" | "notice" | "warning" | "debug" | "error" | "wow";

export default class Logger {

    private log(color: Colors, type: Type, message: string) : any {
        console.log(ColorManager[color](Constants.prefix + "[" + type.toUpperCase() + "] " + message));
    }

    public info(message: string) : void {
        this.log("yellow", "info", message);
    }

    public notice(message: string) : void {
        this.log("yellow", "notice", message);
    }

    public warning(message: string) : void {
        this.log("blue", "warning", message);
    }

    public debug(message: string) : void {
        this.log("gray", "debug", message);
    }

    public error(message: string) : void {
        this.log("red", "error", message);
    }

    public wow(message: string) : void {
        this.log("rainbow", "wow", message);
    }
}