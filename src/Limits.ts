/**
 * Limits namespace.
 */
export const Limits = {
    /** General limits */
    general: {
        id: { min: 13, max: 20 },

        /**
         * Generic hard limit. Used for non specific fields. Needed to prevent data overrun.
         */
        hard: { min: 2, max: 128 },
    },
    /** Users and authentication limits */
    uam: {
        password: { min: 2, max: 64 },
        username: { min: 2, max: 32 }
    },
    /** User profile limits */
    userProfile: {
        displayName: { min: 0, max: 64 },
        biography: { min: 0, max: 256 }
    },
    /** Posts limits */
    posts: {
        tcontent: { min: 1, max: 280 }
    }
}