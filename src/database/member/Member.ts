import { User } from "discord.js";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import MemberActivity from "./MemberActivity";

@Entity()
export default class Member extends BaseEntity {

    @PrimaryColumn({length: 35})
    userId: string;

    @Column({length: 50})
    username: string;

    @Column()
    profilPictureLink: string;

    @Column({default: true})
    alwaysInTheServer: boolean;

    @OneToOne(() => MemberActivity, {cascade: true, eager: true})
    @JoinColumn()
    activity: MemberActivity;


    constructor(user: User){
        super();

        if(user){
            this.userId = user.id;
            this.username = user.username;
            this.profilPictureLink = user.avatarURL() ?? user.defaultAvatarURL;
            this.activity = new MemberActivity(this);
        }
    }

    
    public static async getMember(user: User) : Promise<Member> {
        let member: Member|undefined = await Member.findOne({userId: user.id});

        if(!member) member = new Member(user);

        return member;
    }
}