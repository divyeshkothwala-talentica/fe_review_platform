import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    CHECK_FAVORITE_FAILURE,
    CHECK_FAVORITE_REQUEST,
    CHECK_FAVORITE_SUCCESS,
    UPDATE_FAVORITE_STATUS,
    CLEAR_FAVORITE_STATUS,
} from '../actions/checkFavoriteActions';

const checkFavoriteReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = { favoriteStatuses: {} };
    }
    switch (action.type) {
        case CHECK_FAVORITE_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
                favoriteStatuses: state.favoriteStatuses || {},
            });

        case CHECK_FAVORITE_SUCCESS:
            const bookId = action.actionData?.bookId;
            const isFavorite = action.response.data?.isFavorite;
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data, // Fixed: was action.response.data.data
                favoriteStatuses: {
                    ...state.favoriteStatuses,
                    [bookId]: isFavorite,
                },
            });
        case CHECK_FAVORITE_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
            });
        case UPDATE_FAVORITE_STATUS:
            const newState = Object.assign({}, state, {
                loading: false,
                favoriteStatuses: {
                    ...state.favoriteStatuses,
                    [action.response.bookId]: action.response.isFavorite,
                },
            });
            return newState;
        case CLEAR_FAVORITE_STATUS:
            return Object.assign({}, state, {
                loading: false,
                favoriteStatuses: {},
            });
    }
    return state;
};

export default checkFavoriteReducer;
