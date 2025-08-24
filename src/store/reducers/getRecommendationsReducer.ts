import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    GET_RECOMMENDATIONS_FAILURE,
    GET_RECOMMENDATIONS_REQUEST,
    GET_RECOMMENDATIONS_SUCCESS,
    CLEAR_RECOMMENDATIONS,
} from '../actions/getRecommendationsActions';

const getRecommendationsReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {
            loading: false,
            error: false,
            errorDetails: {},
            data: {
                recommendations: [],
                source: null,
            },
        };
    }
    
    switch (action.type) {
        case GET_RECOMMENDATIONS_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: {
                    ...state.data,
                },
            });

        case GET_RECOMMENDATIONS_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    recommendations: action.response.data.recommendations || [],
                    source: action.response.data.source || 'ai',
                },
            });
            
        case GET_RECOMMENDATIONS_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
                data: {
                    recommendations: [],
                    source: null,
                },
            });
            
        case CLEAR_RECOMMENDATIONS:
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    recommendations: [],
                    source: null,
                },
            });
    }
    return state;
};

export default getRecommendationsReducer;
