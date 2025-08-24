import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
  SEARCH_BOOKS_FAILURE,
  SEARCH_BOOKS_REQUEST,
  SEARCH_BOOKS_SUCCESS,
  CLEAR_SEARCH_RESULTS,
} from '../actions/searchBooksActions';
import { UPDATE_BOOK_IN_LIST } from '../actions/getBooksActions';

const searchBooksReducer: getReducerType = (
  state,
  action: IReducerAction,
) => {
  if (state === undefined) {
    state = {
      loading: false,
      error: false,
      errorDetails: {},
      data: {
        searchResults: [],
        searchTerm: '',
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false,
        },
        hasSearched: false,
      },
    };
  }
  
  switch (action.type) {
    case SEARCH_BOOKS_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        error: false,
        data: {
          ...state.data,
          hasSearched: true,
        },
      });

    case SEARCH_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: false,
        data: {
          searchResults: action.response.data?.books || [],
          searchTerm: (action as any).searchTerm || '',
          pagination: action.response.meta?.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 12,
            hasNextPage: false,
            hasPrevPage: false,
          },
          hasSearched: true,
        },
      });
      
    case SEARCH_BOOKS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        errorDetails: {
          errorMessage: action.error.errorMessage,
          errorStatusCode: action.error.errorStatusCode,
        },
        data: {
          ...state.data,
          hasSearched: true,
        },
      });
      
    case CLEAR_SEARCH_RESULTS:
      return Object.assign({}, state, {
        loading: false,
        error: false,
        errorDetails: {},
        data: {
          searchResults: [],
          searchTerm: '',
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 12,
            hasNextPage: false,
            hasPrevPage: false,
          },
          hasSearched: false,
        },
      });
      
    case UPDATE_BOOK_IN_LIST:
      const updatedSearchResults = state.data.searchResults.map((book: any) => 
        book._id === (action as any).book._id ? (action as any).book : book
      );
      return Object.assign({}, state, {
        data: {
          ...state.data,
          searchResults: updatedSearchResults,
        },
      });
  }
  return state;
};

export default searchBooksReducer;
