import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    UPDATE_USER_PROFILE_FAILURE,
    UPDATE_USER_PROFILE_REQUEST,
    UPDATE_USER_PROFILE_SUCCESS,
} from '../actions/updateUserProfileActions';

const updateUserProfileReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {};
    }
    switch (action.type) {
        case UPDATE_USER_PROFILE_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
            });

        case UPDATE_USER_PROFILE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data, // Fixed: was action.response.data.data
            });
        case UPDATE_USER_PROFILE_FAILURE:
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

export default updateUserProfileReducer;
