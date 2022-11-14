import {UserDBType} from "../types/user-type";

export const userDBtoUser = (userDB: UserDBType) => {
    return {
        email: userDB.email,
        login: userDB.login,
        userId: userDB.id,
    }
}

export const usersOutputType = (accountData: UserDBType) => {
    return {
        id: accountData.id,
        login: accountData.login,
        email: accountData.email,
        createdAt: accountData.createdAt
    }
}