import {AttemptsModel} from "./db";


export const attemptsRepository = {

        async addAttempts(userIP: string, url: string, time: Date) {
            return AttemptsModel.create({userIP, url, time})
        },

        async countOfAttempts(userIP: string, url: string, timeLimit: Date) {
            return AttemptsModel.countDocuments({userIP, url, time: {$gt: timeLimit}})
    }
}
