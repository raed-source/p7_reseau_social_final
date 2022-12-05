import{Comment} from './comment-model';
export class Post {
_id!:string;
userId!:string;
title!: string;
content!: string;
imgUrl!:string
createdAt!: Date;
location?:string;
comments!: Comment[];
likes!: number;
dislikes!: number;
usersLiked!: string[];
usersDisliked!: string[];
}
