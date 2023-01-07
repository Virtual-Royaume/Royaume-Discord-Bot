export default abstract class Task {

  protected readonly time: number;

  protected readonly timer: NodeJS.Timer;

  public abstract readonly enabledInDev: boolean;

  constructor(time: number) {
    this.time = time;
    this.timer = setInterval(() => this.run(), time);
  }

  public abstract run() : void;

  public stop() : void {
    clearInterval(this.timer);
  }

}