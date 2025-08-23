import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_FAVORITES_REQUEST = 'GET_FAVORITES_REQUEST';
export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const GET_FAVORITES_FAILURE = 'GET_FAVORITES_FAILURE';

export const UPDATE_FAVORITES_TASK = 'UPDATE_FAVORITES_TASK';

export const getFavorites = (skip: number = 0, limit: number = 20): IActionGenerator => {
    const getFavoritesUrl = getBase() + '/v1' + URLS.FAVORITES_URL;
    return {
        [CALL_API]: {
            types: [
                GET_FAVORITES_REQUEST,
                GET_FAVORITES_SUCCESS,
                GET_FAVORITES_FAILURE,
            ],
            url: getFavoritesUrl,
            method: HttpMethod.GET,
            data: { skip, limit },
        },
        actionData: {
            errorMessage: 'Fetch Favorites Failed',
        },
    };
};

export const getFavoritesAction = (skip: number = 0, limit: number = 20): IActionGenerator => {
    return getFavorites(skip, limit);
};

export const updateFavoritesTask: any = (favorites: any) => {
    return { type: UPDATE_FAVORITES_TASK, response: favorites };
};
