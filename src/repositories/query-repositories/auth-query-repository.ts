import { WithId} from "mongodb";
import {UserDBType} from "../../utils/types";
import {UserMapper} from "./users-query-repository";
import {UsersModel} from "../db";


export const authQueryRepository = {
    async findUserByEmailConfirmationCode(confirmationCode:string){
        const userAccount:WithId<UserDBType> | null = await UsersModel.findOne({"emailConfirmation.confirmationCode":confirmationCode})
        return userAccount ? UserMapper(userAccount) : null
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const userAccount:WithId<UserDBType> | null = await UsersModel.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return userAccount ? UserMapper(userAccount) : null
    },
}
