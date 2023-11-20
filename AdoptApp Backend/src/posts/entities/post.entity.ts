import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import {User} from 'src/users/entities/user.entity'

@Entity()
export abstract class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    authorID: string

    @Column()
    type: string

    @ManyToOne(
        () => User,
        user => user.post,
        {onDelete: 'CASCADE'}
    )
    author: User
    
    @Column({ default: 0 })
    likesCount: number;
    
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;
}
