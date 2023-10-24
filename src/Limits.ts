/**
 * Limits namespace.
 */
export const Limits = {
    /** Users and authentication limits */
    uam: {
        password: { min: 2, max: 64 },
        username: { min: 2, max: 32 }
    }
}