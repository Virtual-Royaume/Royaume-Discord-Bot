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
}