import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    UPDATE_REVIEW_FAILURE,
    UPDATE_REVIEW_REQUEST,
    UPDATE_REVIEW_SUCCESS,
} from '../actions/updateReviewActions';

const updateReviewReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {
            loading: false,
            error: false,
            errorDetails: {},
            data: null,
        };
    }
    
    switch (action.type) {
        case UPDATE_REVIEW_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: state.data,
            });

        case UPDATE_REVIEW_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: action.response.data,
            });
            
        case UPDATE_REVIEW_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
                data: null,
            });
    }
    return state;
};

export default updateReviewReducer;
