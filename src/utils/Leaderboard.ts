
type LeaderboardEntryType = {
    username: string,
    count: number
}

export default class Leaderboard{

    private entries: LeaderboardEntryType[];
    private maxPage: number;

    constructor( entries: LeaderboardEntryType[], private pageLength = 20 ){

        this.entries = entries.sort( (a, b) => {
            return (b.count ?? 0) - (a.count ?? 0);
        });

        this.maxPage = Math.ceil(this.entries.length / this.pageLength);
    }

    public getPage( page: number ) : LeaderboardEntryType[]{

        if(page < 1) page = 1;
        if(page > this.maxPage) page = this.maxPage;

        return this.entries.slice( (page-1) * this.pageLength, page * this.pageLength);
    }

    public setPageLength(length: number){

        if(length < 1) length = 1;

        this.pageLength = length;
        this.updateMaxPage();
    }

    public getPageLength() : number{
        return this.pageLength;
    }

    private updateMaxPage(){
        this.maxPage = Math.ceil(this.entries.length / this.pageLength);
    }

    public getEntries(): LeaderboardEntryType[]{
        return this.entries;
    }
}