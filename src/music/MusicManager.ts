import { Snowflake } from "discord.js";
import Player from "./player/Player";

export default class MusicManager {

    public readonly playersMap: Map<Snowflake, Player> = new Map<Snowflake, Player>();

    public getPlayer(guildId: Snowflake): Player | undefined {
        return this.playersMap.get(guildId);
    }

    public setPlayer(guildId: Snowflake, player: Player): void {
        this.playersMap.set(guildId, player);
    }

    public deletePlayer(guildId: Snowflake): void {
        this.playersMap.delete(guildId);
    }

    public hasPlayer(guildId: Snowflake): boolean {
        return this.playersMap.has(guildId);
    }

    public getPlayers(): Player[] {
        return Array.from(this.playersMap.values());
    }

    public getPlayerCount(): number {
        return this.playersMap.size;
    }
}