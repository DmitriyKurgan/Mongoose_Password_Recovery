import {RecoveryCodeModel, UsersModel} from "./db";
import {ObjectId, DeleteResult} from "mongodb";
import {EazeUserType, UserDBType} from "../utils/types";
import {UserMapper, UserSimpleMapper, usersQueryRepository} from "./query-repositories/users-query-repository";

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return user ? UserMapper(user) : null
    },
    async findUserByID(userID:string){
        const user = await UsersModel.findOne({_id: new ObjectId(userID)})
        return user ? UserMapper(user) : null
    },


    async createUser(newUser:UserDBType):Promise<EazeUserType | any> {
        const _id = await UsersModel.create(newUser);
         const user = await UsersModel.findOne({_id});
         return user ? UserSimpleMapper(user) : null;
    },

   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await UsersModel.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    },

    async findUserByRecoveryCode(recoveryCode: string): Promise<any>{
        return RecoveryCodeModel.findOne({recoveryCode:recoveryCode})
    },

    async updateUserPassword(email: string, hash: string): Promise<any>{
        console.log('emailAndHash: ', {email, hash})
       const updatedUser = await UsersModel.updateOne({"accountData.email":email}, {$set:{
           "accountData.passwordHash":hash
       }});
        const currentUser = await usersQueryRepository.findByLoginOrEmail(email)
       return updatedUser
       },
}