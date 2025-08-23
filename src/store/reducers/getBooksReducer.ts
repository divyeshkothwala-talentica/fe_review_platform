import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
  GET_BOOKS_FAILURE,
  GET_BOOKS_REQUEST,
  GET_BOOKS_SUCCESS,
  UPDATE_BOOKS_TASK,
} from '../actions/getBooksActions';

const getBooksReducer: getReducerType = (
  state,
  action: IReducerAction,
) => {
  if (state === undefined) {
    state = {
      loading: false,
      error: false,
      errorDetails: {},
      data: {
        books: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  }
  
  switch (action.type) {
    case GET_BOOKS_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        error: false,
        data: state.data || {
          books: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 12,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      });

    case GET_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: false,
        data: {
          books: action.response.data?.books || [],
          pagination: action.response.meta?.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 12,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      });
      
    case GET_BOOKS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        errorDetails: {
          errorMessage: action.error.errorMessage,
          errorStatusCode: action.error.errorStatusCode,
        },
      });
      
    case UPDATE_BOOKS_TASK:
      const updatedData = { ...state.data };
      return Object.assign({}, state, {
        loading: false,
        data: { ...updatedData },
      });
  }
  return state;
};

export default getBooksReducer;
