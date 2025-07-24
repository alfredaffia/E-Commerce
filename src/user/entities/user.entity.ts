import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../utility/enum/user.role.enum';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column({
        select: false,
    })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({
        default: false
    })
    isBlocked: boolean;

    @OneToMany(() => Category, (category) => category.addedBy)
    categories: Category[];

    @OneToMany(() => Product, (prod) => prod.addedBy)
    products: Product[];

    @OneToMany(()=> Review,(review)=>review.user)
    reviews:Review[];
}
