import {PostMapper} from "../repositories/query-repositories/posts-query-repository";
import {BLogMapper} from "../repositories/query-repositories/blogs-query-repository";
import {BLogType, CommentType, PostType, UserDBType, UserType} from "./types";
import {WithId} from "mongodb";
import {BlogModel, CommentsModel, PostsModel, UsersModel} from "../repositories/db";
import {UserSimpleMapper} from "../repositories/query-repositories/users-query-repository";
import {CommentMapper} from "../repositories/query-repositories/comments-query-repository";

export enum CodeResponsesEnum {
    Incorrect_values_400 = 400,
    Unauthorized_401= 401,
    Forbidden_403= 403,
    Not_found_404 = 404,
    Not_content_204 = 204,
    Created_201 = 201,
    OK_200 = 200,
}

export type QueryOptions ={
    pageNumber?: any
    pageSize?: any
    sortBy?: any
    sortDirection?: any
    searchNameTerm?: any
    searchLoginTerm?: any
    searchEmailTerm?: any
}

export const getQueryValues = ({   pageNumber,
                                   pageSize,
                                   sortBy,
                                   sortDirection,
                                   searchNameTerm,
                                   searchLoginTerm,
                                   searchEmailTerm}: QueryOptions): QueryOptions => {
    return {
        pageNumber: pageNumber ? parseInt(pageNumber as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 10,
        sortBy: sortBy ? sortBy as string : "createdAt",
        sortDirection: sortDirection ? sortDirection as "asc" | "desc" : "desc",
        searchNameTerm: searchNameTerm ? searchNameTerm as string : undefined,
        searchLoginTerm: searchLoginTerm ? searchLoginTerm as string : undefined,
        searchEmailTerm: searchEmailTerm ? searchEmailTerm as string : undefined,
    };
};


export const getPostsFromDB = async (query:any, blogID?:string) => {
    const byId = blogID ? {  blogId: blogID } : {};
    const search = query.searchNameTerm
        ? { title: { $regex: query.searchNameTerm, $options: 'i' } }
        : {};
    const filter = {
        ...byId,
        ...search,
    };

    try {
        const items: WithId<PostType>[] = await PostsModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const totalCount = await PostsModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map((post:WithId<PostType>) => PostMapper(post)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}

export const getCommentsFromDB = async (query:any, postID?:string) => {
    const byId = postID ? {  postId: postID } : {};
    const search = query.searchNameTerm
        ? { title: { $regex: query.searchNameTerm, $options: 'i' } }
        : {};
    const filter = {
        ...byId,
        ...search,
    };

    try {
        const items: WithId<CommentType>[] = await CommentsModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const totalCount = await CommentsModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map((comment:WithId<CommentType>) => CommentMapper(comment)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}


export const getBlogsFromDB = async (query:any) => {
    const search = query.searchNameTerm
        ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
        : {};
    const filter = {
        ...search,
    };
    try {
        const items: WithId<BLogType>[] = await BlogModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const totalCount = await BlogModel.countDocuments(filter);

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map((blog: WithId<BLogType>) => BLogMapper(blog)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}

export const getUsersFromDB = async (query:any) => {
    const search = {
        $or: [
            query.searchLoginTerm ? { login: { $regex: query.searchLoginTerm, $options: 'i' } } : {},
            query.searchEmailTerm ? { email: { $regex: query.searchEmailTerm, $options: 'i' } } : {}
        ]
    };

    const filter = {
        ...search
    };

    try {
        const items: UserDBType[] = await UsersModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const totalCount = await UsersModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: items.map((user:WithId<UserType>) => UserSimpleMapper(user)),
        };
    } catch (e) {
        console.log(e);
        return { error: 'some error' };
    }
}