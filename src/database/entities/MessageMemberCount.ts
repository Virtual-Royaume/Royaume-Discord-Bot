import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

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