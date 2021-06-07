import { TextChannel } from "discord.js";
import { AfterUpdate, BaseEntity, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import Client from "../../client/Client";
import ChannelIDs from "../../constants/ChannelIDs";
import Member from "./Member";

@Entity()
export default class MemberActivity extends BaseEntity {

    @PrimaryColumn({length: 35})
    userId: string;

    @Column()
    voiceMinute: number = 0;

    @Column()
    totalMessageCount: number = 0;

    @Column()
    monthMessageCount: number = 0;

    @Column()
    generalMessageCount: number = 0;
    @Column()
    gamesMessageCount: number = 0;
    @Column()
    musiqueMessageCount: number = 0;
    @Column()
    dropShippingMessageCount: number = 0;
    @Column()
    developpementMessageCount: number = 0;
    @Column()
    tradingMessageCount: number = 0;
    @Column()
    graphismeMessageCount: number = 0;
    @Column()
    sneakersMessageCount: number = 0;


    constructor(member: Member){
        super();

        if(member) this.userId = member.userId;
    }


    public static channelIdsToColumnName: {[key: string]: string} = {
        "786216771723198514": "generalMessageCount",
    
        "778044698685866025": "gamesMessageCount",
        "829662265942343692": "musiqueMessageCount",
    
        "798164233443213322": "dropShippingMessageCount",
        "732392873667854372": "developpementMessageCount",
        "779129024327712783": "tradingMessageCount",
        "768996501049311243": "graphismeMessageCount",
        "789126328082235412": "sneakersMessageCount"
    }


    @BeforeUpdate()
    updateGlobalMessageCount(){
        this.totalMessageCount = this.generalMessageCount + this.gamesMessageCount + 
            this.musiqueMessageCount + this.dropShippingMessageCount + this.developpementMessageCount +
            this.tradingMessageCount + this.graphismeMessageCount + this.sneakersMessageCount;

        this.save();
    }

    private stepUpAnnoucement: number;

    @AfterUpdate()
    async stepUp(){
        if(this.totalMessageCount && this.totalMessageCount !== this.stepUpAnnoucement && this.totalMessageCount % 1000 === 0){
            Client.instance.embed.sendSimple(
                "<@" + this.userId + "> vient de passer le cap des " + this.totalMessageCount.toLocaleString("fr-FR") + " messages envoyés ! 🎉", 
                // @ts-ignore : TODO remove this (djs v13 master problem)
                <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.general)
            );

            const member = await Member.findOne({userId: this.userId});
    
            if(member) Client.instance.logger.wow(
                member.username + " vient de passer le cap des " + this.totalMessageCount.toLocaleString("fr-FR") + " messages envoyés !"
            );

            this.stepUpAnnoucement = this.totalMessageCount;
        }
    }
}