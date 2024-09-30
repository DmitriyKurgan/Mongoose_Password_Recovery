import {ObjectId, WithId, UpdateResult, DeleteResult} from "mongodb";
import {OutputPostType, PostType} from "../utils/types";
import {PostsModel} from "./db";
export const posts = [] as PostType[]

export const PostMapper = (post : WithId<PostType>) : OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsRepository = {
   async createPost(newPost:PostType):Promise<OutputPostType | null> {
       const _id = await PostsModel.create(newPost)
       const post: WithId<PostType> | null = await PostsModel.findOne({_id})
       return post ? PostMapper(post) : null
    },
   async updatePost(postID:string, body:PostType): Promise<boolean> {
        const result: UpdateResult<PostType> = await PostsModel.updateOne({_id: new ObjectId(postID)},
            {$set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
                }});
       return result.matchedCount === 1
    },
   async deletePost(postID:string){

        const result: DeleteResult = await PostsModel.deleteOne({_id: new ObjectId(postID)})

       return result.deletedCount === 1
    }

}