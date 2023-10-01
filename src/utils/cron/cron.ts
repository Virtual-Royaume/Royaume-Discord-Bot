import type { CronCommand } from "cron";
import { CronJob } from "cron";

export const startCronJob = (interval: string, execute: CronCommand): void => {
  const job = new CronJob(interval, execute, null, null, "Europe/Paris");

  job.start();
};