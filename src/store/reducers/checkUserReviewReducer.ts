import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    CHECK_USER_REVIEW_FAILURE,
    CHECK_USER_REVIEW_REQUEST,
    CHECK_USER_REVIEW_SUCCESS,
} from '../actions/checkUserReviewActions';

const checkUserReviewReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {
            loading: false,
            error: false,
            errorDetails: {},
            data: {
                hasReviewed: false,
                review: null,
            },
        };
    }
    
    switch (action.type) {
        case CHECK_USER_REVIEW_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: state.data || {
                    hasReviewed: false,
                    review: null,
                },
            });

        case CHECK_USER_REVIEW_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    hasReviewed: action.response.data.hasReviewed,
                    review: action.response.data.review || null,
                },
            });
            
        case CHECK_USER_REVIEW_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
                data: {
                    hasReviewed: false,
                    review: null,
                },
            });
    }
    return state;
};

export default checkUserReviewReducer;
