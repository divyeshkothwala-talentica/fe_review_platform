import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const CHECK_FAVORITE_REQUEST = 'CHECK_FAVORITE_REQUEST';
export const CHECK_FAVORITE_SUCCESS = 'CHECK_FAVORITE_SUCCESS';
export const CHECK_FAVORITE_FAILURE = 'CHECK_FAVORITE_FAILURE';

export const UPDATE_FAVORITE_STATUS = 'UPDATE_FAVORITE_STATUS';
export const CLEAR_FAVORITE_STATUS = 'CLEAR_FAVORITE_STATUS';

export const checkFavorite = (bookId: string): IActionGenerator => {
    const checkFavoriteUrl = getBase() + '/api/v1' + URLS.FAVORITE_CHECK_URL.replace('{bookId}', bookId);
    return {
        [CALL_API]: {
            types: [
                CHECK_FAVORITE_REQUEST,
                CHECK_FAVORITE_SUCCESS,
                CHECK_FAVORITE_FAILURE,
            ],
            url: checkFavoriteUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Check Favorite Status Failed',
            bookId,
        },
    };
};

export const checkFavoriteAction = (bookId: string): IActionGenerator => {
    return checkFavorite(bookId);
};

export const checkFavoriteActionSafe = (bookId: string, isAuthenticated: boolean): IActionGenerator | null => {
    if (!isAuthenticated) {
        return null;
    }
    return checkFavorite(bookId);
};

export const updateFavoriteStatus: any = (bookId: string, isFavorite: boolean) => {
    return { 
        type: UPDATE_FAVORITE_STATUS, 
        response: { bookId, isFavorite } 
    };
};

export const clearFavoriteStatus: any = () => {
    return { type: CLEAR_FAVORITE_STATUS };
};
