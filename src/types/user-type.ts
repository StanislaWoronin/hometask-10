export type UserType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UsersType = UserType[]

export type UserDBType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string,
}

export type UsersDBType = UserDBType[]