import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import daysjs from "dayjs";

@Entity()
export default class ServerActivity extends BaseEntity {

    @PrimaryColumn({type: "date"})
    date: string = daysjs().format("YYYY-MM-DD");

    @Column()
    voiceMinute: number = 0;

    @Column()
    messageCount: number = 0;

    @Column()
    memberCount: number = 0;


    private static serverActivity: ServerActivity|undefined;

    public static async getServerActivity() : Promise<ServerActivity> {
        const date = daysjs().format("YYYY-MM-DD");

        if(!this.serverActivity){
            this.serverActivity = await ServerActivity.findOne({date: date});

            if(!this.serverActivity) this.serverActivity = await new ServerActivity().save();
        }

        return this.serverActivity;
    }
}