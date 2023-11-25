/**
 * API data paginator.
 */
export interface APIDataPaginator<T> {
    currentPage: number;
    pageSize: number;
    data?: T[];
}