import Constants from "../../constants/Constants";
import ColorManager from "colors";

type Colors = keyof ColorManager.Color;
type Type = "success" | "info" | "notice" | "warning" | "debug" | "error" | "wow";

export default class Logger {

    private log(color: Colors, type: Type, message: string) : any {
        console.log(ColorManager[color](Constants.prefix + "[" + type.toUpperCase() + "] " + message));
    }

    public success(message: string) : void {
        this.log("green", "success", message);
    }

    public info(message: string) : void {
        this.log("reset", "info", message);
    }

    public notice(message: string) : void {
        this.log("cyan", "notice", message);
    }

    public warning(message: string) : void {
        this.log("magenta", "warning", message);
    }

    public debug(message: string) : void {
        this.log("blue", "debug", message);
    }

    public error(message: string) : void {
        this.log("red", "error", message);
    }

    public wow(message: string) : void {
        this.log("rainbow", "wow", message);
    }
}