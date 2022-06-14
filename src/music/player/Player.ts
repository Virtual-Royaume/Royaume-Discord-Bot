import { VoiceChannel, VoiceState } from "discord.js";

import MusicManager from "../MusicManager";
import Queue from "./Queue";

export default class Player {
    public readonly musicManager: MusicManager;

    public readonly guildId: string;

    public readonly queue: Queue;

    public readonly voiceChannel: VoiceChannel;

    public readonly voiceState: VoiceState;

    public readonly isPaused: boolean = false;

    constructor(musicManager: MusicManager, guildId: string, queue: Queue, voiceChannel: VoiceChannel, voiceState: VoiceState) {
        this.musicManager = musicManager;
        this.guildId = guildId;
        this.queue = queue;
        this.voiceChannel = voiceChannel;
        this.voiceState = voiceState;
    }

    // ToDo
}