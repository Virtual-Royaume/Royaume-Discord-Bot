export default class TrackInfo {
    public readonly title: string;

    public readonly artist: string;

    public readonly album: string;

    public readonly duration: number;

    constructor(title: string, artist: string, album: string, duration: number) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.duration = duration;
    }

    public durationString(): string {
        return this.duration.toString();
    }

    public getTitle(): string {
        return `${this.title}`;
    }

    public getArtist(): string {
        return `${this.artist}`;
    }

    public getAlbum(): string {
        return `${this.album}`;
    }

    public getDuration(): number {
        return this.duration;
    }
}