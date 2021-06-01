import { TextChannel } from "discord.js";
import { AfterInsert, BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import Client from "../client/Client";
import ChannelIDs from "../constants/ChannelIDs";

@Entity()
export default class User extends BaseEntity {

    @PrimaryColumn({
        length: 30
    })
    userId: string;

    @Column({
        length: 50
    })
    username: string;

    @Column("simple-json")
    messageCount: {
        general: number,

        games: number,
        musique: number,

        dropShipping: number,
        developpement: number,
        trading: number,
        graphisme: number,
        sneakers: number
    };

    @Column()
    totalMessageCount: number;

    @Column({default: true})
    alwaysInTheServer: boolean;

    @BeforeUpdate()
    beforeUpdate(){
        this.totalMessageCount = Object.values(this.messageCount).reduce((a, b) => a + b);

        if(this.totalMessageCount % 1000 === 0){
            Client.instance.embed.sendSimple(
                "<@" + this.userId + "> vient de passer le cap des " + this.totalMessageCount.toLocaleString("fr-FR") + " messages envoyés ! 🎉", 
                <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.general)
            );

            Client.instance.logger.wow(
                this.username + " vient de passer le cap des " + this.totalMessageCount.toLocaleString("fr-FR") + " messages envoyés !"
            );
        }
    }
}