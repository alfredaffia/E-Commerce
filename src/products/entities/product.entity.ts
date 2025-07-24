import { Review } from "src/reviews/entities/review.entity";
import { Category } from "../../categories/entities/category.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column()
    stock: number;

    @ManyToOne(() => User, (user) => user.products)
    addedBy: User;

    @ManyToOne(() => Category, (category) => category.products,)
    categories: Category;

    @OneToMany(()=> Review,(review)=>review.product)
    reviews:Review[];
}
