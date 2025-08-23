import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    GET_BOOK_FAILURE,
    GET_BOOK_REQUEST,
    GET_BOOK_SUCCESS,
} from '../actions/getBookActions';

const getBookReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {};
    }
    switch (action.type) {
        case GET_BOOK_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
            });

        case GET_BOOK_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data.book,
            });
        case GET_BOOK_FAILURE:
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

export default getBookReducer;
