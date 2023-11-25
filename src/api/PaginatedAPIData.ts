/**
 * Represents paginated API data.
 */
export interface PaginatedAPIData<T> {
    currentPage: number;
    pageSize: number;
    data?: T[];
}