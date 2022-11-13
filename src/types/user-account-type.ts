import {EmailConfirmationType} from "./email-confirmation-type";
import {UserDBType} from "./user-type";

export type UserAccountType = {
    accountData: UserDBType,
    emailConfirmation: EmailConfirmationType
}