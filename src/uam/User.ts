/**
 * Represents a user account.
 */
export interface User {
    id: string;
    displayName: string;
    username: string;
    email: string;
    avatarURL: string;
    biography: string;
    dateJoined: Date;
}