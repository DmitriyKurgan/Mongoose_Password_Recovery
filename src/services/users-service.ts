import {EazeUserType, OutputUserType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";

export const users = [] as EazeUserType[]

export const usersService:any = {

    async createUser(login:string, email:string, password:string):Promise<EazeUserType | null> {
        const passwordSalt = await bcrypt.genSalt(10);

        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser:UserDBType = {
            _id: new ObjectId(),
            accountData:{
                userName:login,
                email,
                passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation:{
                confirmationCode:uuidv4(),
                expirationDate:add(new Date(), {
                    hours: 3,
                    minutes: 10
                }),
                isConfirmed:false,
            },
        }
        const createdUser = await usersRepository.createUser(newUser);
        return createdUser
    },
   async deleteUser(userID:string): Promise<boolean>{
       return await usersRepository.deleteUser(userID);
    },
    async checkCredentials(loginOrEmail:string, password:string):Promise<OutputUserType | null> {
        const user:OutputUserType | null = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user){
            return null
        }
        const isPasswordsMatch = await bcrypt.compare(password, user.accountData.passwordHash)
        if (!isPasswordsMatch) return null
        return user
    },

    async _generateHash(password:string, salt:string):Promise<string>{
        const hash = await bcrypt.hash(password, salt);
        return hash
    },

    async findUserRecoveryCodeAndChangeNewPassword(newPassword:string, recoveryCode:string):Promise<void> {
        const userCode = await usersRepository.findUserByRecoveryCode(recoveryCode);
        if (!userCode) return
        const passwordSalt = await bcrypt.genSalt(10)
        const hash = await this._generateHash(newPassword, passwordSalt)
        await usersRepository.updateUserPassword(userCode.email, hash)


      //
      //   const recoveryCode: RecoveryCodeType = {
      //       email: email,
      //       recoveryCode: uuidv4()
      //   }
      //   const result = await this.usersRepository.addRecoveryUserCode(recoveryCode)
      //   try {
      //       const message = `<h1>Password recovery</h1>
      //  <p>To finish password recovery please follow the link below:
      //     <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode.recoveryCode}'>recovery password</a>
      // </p>`
      //       await emailService.sendEmail(email, "recovery code", message)
      //   } catch (error) {
      //       console.log(error)
      //       return null
      //   }
      //   return result


    }
}