import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_BOOKS_REQUEST = 'GET_BOOKS_REQUEST';
export const GET_BOOKS_SUCCESS = 'GET_BOOKS_SUCCESS';
export const GET_BOOKS_FAILURE = 'GET_BOOKS_FAILURE';

export const UPDATE_BOOKS_TASK = 'UPDATE_BOOKS_TASK';
export const UPDATE_BOOK_IN_LIST = 'UPDATE_BOOK_IN_LIST';

export const getBooks = (params: {
  page?: number;
  limit?: number;
  search?: string;
  skip?: number;
} = {}): IActionGenerator => {
  const { page = 1, limit = 12, search, skip } = params;
  
  const queryParams = new URLSearchParams();
  
  if (skip !== undefined) {
    queryParams.append('skip', skip.toString());
  } else {
    queryParams.append('page', page.toString());
  }
  
  queryParams.append('limit', limit.toString());
  
  if (search && search.trim()) {
    queryParams.append('search', search.trim());
  }

  let getBooksUrl = getBase() + '/v1' + URLS.BOOKS_URL;
  if (queryParams.toString()) {
    getBooksUrl += `?${queryParams.toString()}`;
  }

  return {
    [CALL_API]: {
      types: [
        GET_BOOKS_REQUEST,
        GET_BOOKS_SUCCESS,
        GET_BOOKS_FAILURE,
      ],
      url: getBooksUrl,
      method: HttpMethod.GET,
    },
    actionData: {
      errorMessage: 'Fetch Books Failed',
    },
  };
};

export const getBooksAction = (params: {
  page?: number;
  limit?: number;
  search?: string;
  skip?: number;
} = {}): IActionGenerator => {
  return getBooks(params);
};

export const updateBooksTask: any = (task: any) => {
  return { type: UPDATE_BOOKS_TASK, response: task };
};

export const updateBookInList: any = (book: any) => {
  return { type: UPDATE_BOOK_IN_LIST, book };
};
