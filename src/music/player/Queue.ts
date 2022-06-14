export default class Queue {
    public readonly trackList: TrackInfo[];

    public readonly player: Player;

    constructor(trackList: TrackInfo[], player: Player) {
        this.trackList = trackList;
        this.player = player;
    }

    public get currentTrack(): TrackInfo | undefined {
        return this.trackList[0];
    }

    public get nextTrack(): TrackInfo | undefined {
        return this.trackList[1];
    }

    public get previousTrack(): TrackInfo | undefined {
        return this.trackList[this.trackList.length - 1];
    }

    public get isEmpty(): boolean {
        return this.trackList.length === 0;
    }

    public get isSingleTrack(): boolean {
        return this.trackList.length === 1;
    }

    public get isMultipleTracks(): boolean {
        return this.trackList.length > 1;
    }

    public get isPlaying(): boolean {
        return !this.player.isPaused;
    }

    public get isPaused(): boolean {
        return this.player.isPaused;
    }
}