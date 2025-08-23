import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const SEARCH_BOOKS_REQUEST = 'SEARCH_BOOKS_REQUEST';
export const SEARCH_BOOKS_SUCCESS = 'SEARCH_BOOKS_SUCCESS';
export const SEARCH_BOOKS_FAILURE = 'SEARCH_BOOKS_FAILURE';

export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

export const searchBooks = (searchTerm: string, params: {
  page?: number;
  limit?: number;
  skip?: number;
} = {}): IActionGenerator => {
  const { page = 1, limit = 12, skip } = params;
  
  const queryParams = new URLSearchParams();
  
  if (skip !== undefined) {
    queryParams.append('skip', skip.toString());
  } else {
    queryParams.append('page', page.toString());
  }
  
  queryParams.append('limit', limit.toString());
  queryParams.append('search', searchTerm.trim());

  let searchBooksUrl = getBase() + '/v1' + URLS.BOOKS_URL;
  searchBooksUrl += `?${queryParams.toString()}`;

  return {
    [CALL_API]: {
      types: [
        SEARCH_BOOKS_REQUEST,
        SEARCH_BOOKS_SUCCESS,
        SEARCH_BOOKS_FAILURE,
      ],
      url: searchBooksUrl,
      method: HttpMethod.GET,
    },
    actionData: {
      errorMessage: 'Search Books Failed',
      searchTerm: searchTerm.trim(),
    },
  };
};

export const searchBooksAction = (searchTerm: string, params: {
  page?: number;
  limit?: number;
  skip?: number;
} = {}): IActionGenerator => {
  return searchBooks(searchTerm, params);
};

export const clearSearchResults: any = () => {
  return { type: CLEAR_SEARCH_RESULTS };
};
