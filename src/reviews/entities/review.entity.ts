import { Product } from "src/products/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    ratings:number;

    @Column()
    comments:string;

    @ManyToOne(()=>User,(user)=>user.reviews)
    user:User;

    @ManyToOne(()=>Product,(product)=>product.reviews)
    product:Product;
}
