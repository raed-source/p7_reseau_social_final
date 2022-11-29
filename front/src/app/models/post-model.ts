export class Post {
_id!:string;
userId!:string;
title!: string;
content!: string;
imgUrl?:string
createdAt!: Date;
// like?: string;
// dislike?: string;
location?:string;
// likes!:number;
comments?:[];
likes!: number;
dislikes!: number;
usersLiked!: string[];
usersDisliked!: string[];
}
