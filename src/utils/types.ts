import {ObjectId} from "mongodb";

export type BLogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: Date | string
    isMembership:boolean
}

export type OutputBlogType = BLogType & {id:string}

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName:string
    createdAt: Date | string
}

export type OutputPostType = PostType & {id:string}

export type UserType = {
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType
}

export type UserDBType = {
    _id: ObjectId
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType
}

export type AccountDataType = {
    userName: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: Date | string
}

export type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: Date | string,
    isConfirmed:boolean
}


export type OutputUserType = UserType & {id:string}

export type CommentType = {
    postId?:string
    content:string
    commentatorInfo:{
        userId: string,
        userLogin: string
    }
    createdAt:string
}

export type RequestType = {
    IP:string
    URL:string
    date:Date
}

export type DeviceType = {
    ip: string
    title: string
    lastActiveDate: string | number
    deviceId: string
}

export type RateLimitType = {
    userIP: string
    url: string
    time: Date
}

export type OutputCommentType = CommentType & {id:string}

export type BlogsServiceType = {
    createBlog(body: BLogType): Promise<OutputBlogType | null>
    updateBlog(blogID: string, body: BLogType): Promise<boolean>
    deleteBlog(blogID: string): Promise<boolean>
}

export type PostsServiceType = {
    createPost(body: PostType, blogName: string, blogID: string):Promise<OutputPostType | null>
    updatePost(postID: string, body: PostType): Promise<boolean>
    deletePost(postID: string): Promise<boolean>
}

export type AccessToken = {
    accessToken: string;
};


export type TokenType = { accessToken: AccessToken; refreshToken: string }

export type EazeUserType = {
    id:any
    email:string,
    login:string,
    createdAt:string|Date,
}

export type MongoRefreshTokenType = {
    refreshToken: string;
};