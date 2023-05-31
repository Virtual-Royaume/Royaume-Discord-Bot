/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { TaskExecute, TaskInterval } from "$core/utils/handler/task/task.type";
import type { EnableInDev } from "$core/utils/handler/handler.type";
import { isDevEnvironment } from "$core/configs/env";
import { existsSync, readdirSync, statSync } from "fs";
import { startCronJob } from "$core/utils/cron";
import { sep } from "path";

export const load = async(tasksFolder: string): Promise<number> => {
  const folders = readdirSync(tasksFolder);
  let tasksLoaded = 0;

  for (const folder of folders) {
    const path = `${tasksFolder}${sep}${folder}${sep}`;

    if (!statSync(path).isDirectory()) continue;

    const taskFileName = `${folder}.task.ts`;

    if (!existsSync(`${path}${taskFileName}`)) throw new Error(`"${taskFileName}" file can't be found in \`${path}\``);

    const dynamicTaskImport = await import(`${path}${taskFileName}`);
    const enableInDev: EnableInDev = dynamicTaskImport.enableInDev ?? false;

    if (!enableInDev && isDevEnvironment) continue;

    const taskInterval: TaskInterval = dynamicTaskImport.interval;

    if (!taskInterval) throw new Error(`"interval" isn't defined in ${path}${taskFileName}`);

    const execute: TaskExecute = dynamicTaskImport.execute;

    if (!execute) throw new Error(`"execute" isn't defined in ${path}${taskFileName}`);

    startCronJob(taskInterval, () => void execute());

    tasksLoaded++;
  }

  return tasksLoaded;
};