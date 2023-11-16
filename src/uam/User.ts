/**
 * Represents a user account.
 */
export interface UserProfile {
    id: string;
    displayName: string;
    username: string;
    email: string;
    avatarURL: string;
    biography: string;
    dateJoined: Date;
    following: string[];
    followers: string[];
}