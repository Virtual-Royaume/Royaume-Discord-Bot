export default abstract class Task {

  protected readonly time: number;

  protected readonly timer: NodeJS.Timer;

  constructor(time: number) {
    this.time = time;
    this.timer = setInterval(() => this.run(), time);
  }

    public abstract run() : void;
}