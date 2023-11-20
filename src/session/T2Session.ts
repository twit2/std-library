export interface T2Session {
    /**
     * The ID of the currently authenticated user.
     */
    id: string;
}

export interface WithT2Session {
    session: T2Session
}