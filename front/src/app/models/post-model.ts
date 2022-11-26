export class Post {
_id!:number;
userId!:string;
title!: string;
content!: string;
imgUrl?:string
dateCreate!: Date;
like?: string;
dislike?: string;
location?:string;
likes!:number;
comments?:[];
}
