export const isDevEnvironment = process.argv.includes("dev");
export const isProdEnvironment = !process.argv.includes("dev");