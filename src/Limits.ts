/**
 * Limits namespace.
 */
export const Limits = {
    /** General limits */
    general: {
        id: { min: 13, max: 20 }
    },
    /** Users and authentication limits */
    uam: {
        password: { min: 2, max: 64 },
        username: { min: 2, max: 32 }
    }
}