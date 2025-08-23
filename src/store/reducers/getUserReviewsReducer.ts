import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    GET_USER_REVIEWS_FAILURE,
    GET_USER_REVIEWS_REQUEST,
    GET_USER_REVIEWS_SUCCESS,
} from '../actions/getUserReviewsActions';

const getUserReviewsReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {};
    }
    switch (action.type) {
        case GET_USER_REVIEWS_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
            });

        case GET_USER_REVIEWS_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data, // Fixed: was action.response.data.data
            });
        case GET_USER_REVIEWS_FAILURE:
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

export default getUserReviewsReducer;
