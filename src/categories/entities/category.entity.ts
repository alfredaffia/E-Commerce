import { User } from "src/user/entities/user.entity";
import { Column,  Entity,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    title:string;

    @Column()
    description:string;

    @ManyToOne(()=>User,(user)=>user.categories)
    addedBy:User
}
