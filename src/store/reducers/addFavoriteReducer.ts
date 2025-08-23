import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    ADD_FAVORITE_FAILURE,
    ADD_FAVORITE_REQUEST,
    ADD_FAVORITE_SUCCESS,
    UPDATE_FAVORITE_OPTIMISTIC,
} from '../actions/addFavoriteActions';

const addFavoriteReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {};
    }
    switch (action.type) {
        case ADD_FAVORITE_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
            });

        case ADD_FAVORITE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data,
            });
        case ADD_FAVORITE_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
            });
        case UPDATE_FAVORITE_OPTIMISTIC:
            return Object.assign({}, state, {
                loading: false,
                data: action.response,
            });
    }
    return state;
};

export default addFavoriteReducer;
