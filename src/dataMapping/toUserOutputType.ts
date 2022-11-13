import {UserDBType} from "../types/user-type";

export const userDBtoUser = (userDB: UserDBType) => {
    return {
        email: userDB.email,
        login: userDB.login,
        userId: userDB.id,
    }
}

export const usersOutputType = (userDB: UserDBType) => {
    return {
        id: userDB.id,
        login: userDB.login,
        email: userDB.email,
        createdAt: userDB.createdAt
    }
}