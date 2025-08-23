import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    DELETE_REVIEW_FAILURE,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
} from '../actions/deleteReviewActions';

const deleteReviewReducer: getReducerType = (
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
        case DELETE_REVIEW_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: state.data,
            });

        case DELETE_REVIEW_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: action.response.data,
            });
            
        case DELETE_REVIEW_FAILURE:
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

export default deleteReviewReducer;
