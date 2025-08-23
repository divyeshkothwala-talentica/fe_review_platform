import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    GET_BOOK_REVIEWS_FAILURE,
    GET_BOOK_REVIEWS_REQUEST,
    GET_BOOK_REVIEWS_SUCCESS,
} from '../actions/getBookReviewsActions';

const getBookReviewsReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {
            loading: false,
            error: false,
            errorDetails: {},
            data: {
                reviews: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10,
                    hasNextPage: false,
                    hasPrevPage: false,
                },
            },
        };
    }
    
    switch (action.type) {
        case GET_BOOK_REVIEWS_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: state.data || {
                    reviews: [],
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0,
                        itemsPerPage: 10,
                        hasNextPage: false,
                        hasPrevPage: false,
                    },
                },
            });

        case GET_BOOK_REVIEWS_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    reviews: action.response.data.reviews,
                    pagination: action.response.data.pagination,
                },
            });
            
        case GET_BOOK_REVIEWS_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
            });
    }
    return state;
};

export default getBookReviewsReducer;
