export type EmailConfirmationType = {
    id: string,
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}