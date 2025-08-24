import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_FAVORITES_REQUEST = 'GET_FAVORITES_REQUEST';
export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const GET_FAVORITES_FAILURE = 'GET_FAVORITES_FAILURE';

export const APPEND_FAVORITES_SUCCESS = 'APPEND_FAVORITES_SUCCESS';
export const UPDATE_FAVORITES_TASK = 'UPDATE_FAVORITES_TASK';

export const getFavorites = (skip: number = 0, limit: number = 20, append: boolean = false): IActionGenerator => {
    const successType = append ? APPEND_FAVORITES_SUCCESS : GET_FAVORITES_SUCCESS;
    
    // Convert skip to page number (backend expects page-based pagination)
    const page = Math.floor(skip / limit) + 1;
    
    // Construct URL with query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    const getFavoritesUrl = getBase() + '/v1' + URLS.FAVORITES_URL + `?${queryParams.toString()}`;
    
    return {
        [CALL_API]: {
            types: [
                GET_FAVORITES_REQUEST,
                successType,
                GET_FAVORITES_FAILURE,
            ],
            url: getFavoritesUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Fetch Favorites Failed',
        },
    };
};

export const getFavoritesAction = (skip: number = 0, limit: number = 20, append: boolean = false): IActionGenerator => {
    return getFavorites(skip, limit, append);
};

// Keep backward compatibility for existing code
export const getFavoritesActionSimple = (skip: number = 0, limit: number = 20): IActionGenerator => {
    return getFavorites(skip, limit, false);
};

export const updateFavoritesTask: any = (favorites: any) => {
    return { type: UPDATE_FAVORITES_TASK, response: favorites };
};
