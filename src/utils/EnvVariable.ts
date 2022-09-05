export function getEnv<T>(envName: string): T {
    const env = process.env[envName];

    if (!env) throw new Error(`Environment variable is missing : ${envName}`);

    return env as T;
}