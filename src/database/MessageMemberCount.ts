import { TextChannel } from "discord.js";
import { AfterUpdate, BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import Client from "../client/Client";
import ChannelIDs from "../constants/ChannelIDs";

@Entity()
export default class MessageMemberCount extends BaseEntity {

    @PrimaryColumn({
        length: 25
    })
    userId: string;

    @Column({
        length: 50
    })
    username: string;

    @Column()
    count: number;
    }
}