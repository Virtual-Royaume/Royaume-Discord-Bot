
export type LeaderboardEntryType = {
    username: string,
    count: number
}
export type LeaderboardOptionsType = {
    period?: "month",
    channel?: string
}

export class Leaderboard{

    private entries: LeaderboardEntryType[];
    private maxPage: number;

    constructor(entries: LeaderboardEntryType[], private pageLength = 20, private options: LeaderboardOptionsType = {}){

        this.entries = entries.sort((a, b) => {
            return (b.count ?? 0) - (a.count ?? 0);
        });

        this.maxPage = Math.ceil(this.entries.length / this.pageLength);
    }

    /**
     * Default format => `**{pos} • {user} :** {score}`
     * @param format - `{pos} => leaderboard position` | `{user} => username` | `{score} => user score`
     */
    public getFormatedPage(page: number, format?: string) : string[]{

        const pageEntries = this.getPage(page);

        const entryFormat = format ?? "**{pos} • {user} :** {score}";

        return pageEntries.map( (member, i) => {

            const position = (page-1)*this.pageLength + i + 1;
    
            let entry = entryFormat.replace("{pos}", String(position));
            entry = entry.replace("{user}", member.username);
            entry = entry.replace("{score}", String(member.count));
            return entry;
        });
    }

    public getPage(page: number) : LeaderboardEntryType[]{

        page = this.getCorrectPageNum(page);

        return this.entries.slice( (page-1) * this.pageLength, page * this.pageLength);
    }

    public getCorrectPageNum(page: number){

        if(page < 1) page = 1;
        if(page > this.maxPage) page = this.maxPage;

        return page;
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

    public getMaxPage(){
        return this.maxPage;
    }

    public getEntries(): LeaderboardEntryType[]{
        return this.entries;
    }

    public getOptions(){
        return this.options;
    }
}