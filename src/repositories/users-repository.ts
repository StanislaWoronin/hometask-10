import {UserScheme} from "./db";
import {UserDBType, UsersType} from "../types/user-type";
import {giveSkipNumber} from "../helperFunctions";

export const usersRepository = {
    async createNewUser(newUser: UserDBType): Promise<UserDBType | null> {
        try {
            await UserScheme.create(newUser)
            return newUser
        } catch (e) {
            return null
        }
    },

    async giveUsers(sortBy: string,
                    sortDirection: string,
                    pageNumber: string,
                    pageSize: string,
                    searchLoginTerm: string,
                    searchEmailTerm: string): Promise<UsersType> {

        return UserScheme
            .find({$and: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                               {email: {$regex: searchEmailTerm, $options: 'i'}}]},
                {projection: {_id: false, passwordHash: false, passwordSalt: false}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .lean()
    },

    async giveTotalCount(searchLoginTerm: string, searchEmailTerm: string): Promise<number> {
        return UserScheme
            .countDocuments({$and: [{login: {$regex: searchLoginTerm, $options: 'i'}},
                                         {email: {$regex: searchEmailTerm, $options: 'i'}}]})
    },

    async giveUserById(id: string): Promise<UserDBType | null> {
        return UserScheme.findOne({id})
    },

    async giveUserByLoginOrEmail(loginOrEmail: string) {
        return UserScheme.findOne({$or:
                [{login: loginOrEmail}, {email: loginOrEmail}]},
                {projection: {_id: false}})
    },

    async updateUserPassword(userId: string, passwordSalt: string, passwordHash: string): Promise<boolean> {
        const result = await UserScheme.updateOne({id: userId}, {$set: {passwordSalt, passwordHash}})

        return result.matchedCount === 1
    },

    async deleteUserById(userId: string): Promise<boolean> {
        const result = await UserScheme.deleteOne({id: userId})
        return result.deletedCount === 1
    },

    async deleteAllUsers(): Promise<boolean> {
        try {
            await UserScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('UserScheme => deleteAll =>', e)
            return false
        }
    }
}