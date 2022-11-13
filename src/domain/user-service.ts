import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {UserDBType, UserType} from "../types/user-type";
import {ContentPageType} from "../types/content-page-type";
import {paginationContentPage} from "../paginationContentPage";
import {_generateHash} from "../helperFunctions";
import {AboutMeType} from "../types/aboutMe-type";
import {userDBtoUser, usersOutputType} from "../dataMapping/toUserOutputType";
import {emailConfirmationRepository} from "../repositories/emailConfirmation-repository";
import {UserAccountType} from "../types/user-account-type";

export const usersService = {
    async aboutMe(user: UserDBType): Promise<AboutMeType> {
        return userDBtoUser(user)
    },

    async createNewUser(login: string, password: string, email: string): Promise<UserType | null> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await _generateHash(password, passwordSalt)

        const createNewUser: UserDBType = {
            id: String(+new Date()),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }

        const createdNewUser = await usersRepository.createNewUser(createNewUser)

        if (!createdNewUser) {
            return null
        }

        return usersOutputType(createdNewUser)
    },

    async giveUserById(id: string): Promise<UserDBType | null> {
        return usersRepository.giveUserById(id)
    },

    async giveUsersPage(sortBy: string,
                        sortDirection: string,
                        pageNumber: string,
                        pageSize: string,
                        searchLoginTerm: string,
                        searchEmailTerm: string): Promise<ContentPageType> {

        const users = await usersRepository.giveUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        const totalCount = await usersRepository.giveTotalCount(searchLoginTerm, searchEmailTerm)

        return paginationContentPage(pageNumber, pageSize, users, totalCount)
    },

    async updateUserPassword(userId: string, password: string): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await _generateHash(password, passwordSalt) //TODO вынести в отдельную функцию

        return await usersRepository.updateUserPassword(userId, passwordSalt, passwordHash)
    },

    async deleteUserById(userId: string): Promise<boolean> {
        return await usersRepository.deleteUserById(userId)
    }
}