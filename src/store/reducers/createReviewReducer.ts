import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    CREATE_REVIEW_FAILURE,
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
} from '../actions/createReviewActions';

const createReviewReducer: getReducerType = (
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
        case CREATE_REVIEW_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: state.data,
            });

        case CREATE_REVIEW_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: action.response.data,
            });
            
        case CREATE_REVIEW_FAILURE:
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

export default createReviewReducer;
