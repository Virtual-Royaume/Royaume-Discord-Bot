import { isDevEnvironment } from "$core/utils/environment";
import { EnableInDev } from "$core/utils/handler/handler.type";
import { existsSync, readdirSync, statSync } from "fs";
import { TaskExecute, TaskInterval } from "$core/utils/handler/task/task.type";
import { startCronJob } from "$core/utils/cron";

export const load = async(tasksFolder: string): Promise<number> => {
  const folders = readdirSync(tasksFolder);
  let tasksLoaded = 0;

  for (const folder of folders) {
    const path = `${tasksFolder}\\${folder}\\`;

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

    startCronJob(taskInterval, execute);

    tasksLoaded++;
  }

  return tasksLoaded;
};