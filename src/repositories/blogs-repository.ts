import {BlogModel} from "../repositories/db";
import { ObjectId, UpdateResult, WithId} from "mongodb";
import {BLogType, OutputBlogType} from "../utils/types";
import {BLogMapper} from "./query-repositories/blogs-query-repository";
export const blogs = [] as BLogType[]


export const blogsRepository = {
    async createBlog(newBlog:BLogType):Promise<OutputBlogType | null> {
        const _id = await BlogModel.create(newBlog);
        const blog: WithId<BLogType> | null = await BlogModel.findOne({_id});
        return blog ? BLogMapper(blog) : null;
    },
    async updateBlog(blogID:string, body:BLogType):Promise<boolean> {
        const result: UpdateResult<BLogType>= await BlogModel.updateOne({_id: new ObjectId(blogID)},
            {$set:{name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
            }}
        );
        return result.matchedCount === 1;
    },
   async deleteBlog(blogID:string): Promise<boolean>{
       const result: any = await BlogModel.deleteOne({_id: new ObjectId(blogID)});
       return result.deletedCount === 1
    }
}