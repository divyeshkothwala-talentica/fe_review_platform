import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_RECOMMENDATIONS_REQUEST = 'GET_RECOMMENDATIONS_REQUEST';
export const GET_RECOMMENDATIONS_SUCCESS = 'GET_RECOMMENDATIONS_SUCCESS';
export const GET_RECOMMENDATIONS_FAILURE = 'GET_RECOMMENDATIONS_FAILURE';

export const CLEAR_RECOMMENDATIONS = 'CLEAR_RECOMMENDATIONS';

export const getRecommendations = (): IActionGenerator => {
    const getRecommendationsUrl = getBase() + '/v1' + URLS.RECOMMENDATIONS_URL;
    return {
        [CALL_API]: {
            types: [
                GET_RECOMMENDATIONS_REQUEST,
                GET_RECOMMENDATIONS_SUCCESS,
                GET_RECOMMENDATIONS_FAILURE,
            ],
            url: getRecommendationsUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Failed to fetch AI recommendations',
        },
    };
};

export const getRecommendationsAction = (): IActionGenerator => {
    return getRecommendations();
};

export const clearRecommendations = () => {
    return { type: CLEAR_RECOMMENDATIONS };
};
