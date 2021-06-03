import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class ServerActivity extends BaseEntity {

    @PrimaryColumn()
    date: Date = new Date(new Date().setHours(0, 0, 0, 0));

    @Column()
    voiceMinute: number = 0;

    @Column()
    messageCount: number = 0;

    @Column()
    memberCount: number = 0;


    private static serverActivity: ServerActivity|undefined;

    public static async getServerActivity() : Promise<ServerActivity> {
        if(!this.serverActivity){
            this.serverActivity = await ServerActivity.findOne({date: new Date(new Date().setHours(0, 0, 0, 0))});

            if(!this.serverActivity) this.serverActivity = await new ServerActivity().save();
        }

        return this.serverActivity;
    }
}