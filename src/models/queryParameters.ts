export type QueryParameters = {
    /**
     *  Input query params
     */
    searchNameTerm: string,
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: string,
    pageSize: string,
    blogId: string
}