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

    @AfterUpdate()
    checkStepUp(){
        if(this.count % 100 === 0){
            Client.instance.embed.sendSimple(
                "<@" + this.userId + "> vient de passer le cap des " + this.count + " messages envoyés !", 
                <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.command)
            );

            Client.instance.logger.wow(this.username + " vient de passer le cap des " + this.count + " messages envoyés !");
        }
    }
}