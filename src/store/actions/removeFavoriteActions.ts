import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';

export const REMOVE_FAVORITE_REQUEST = 'REMOVE_FAVORITE_REQUEST';
export const REMOVE_FAVORITE_SUCCESS = 'REMOVE_FAVORITE_SUCCESS';
export const REMOVE_FAVORITE_FAILURE = 'REMOVE_FAVORITE_FAILURE';

export const removeFavorite = (bookId: string): IActionGenerator => {
    const removeFavoriteUrl = URLS.FAVORITE_REMOVE_URL.replace('{bookId}', bookId);
    return {
        [CALL_API]: {
            types: [
                REMOVE_FAVORITE_REQUEST,
                REMOVE_FAVORITE_SUCCESS,
                REMOVE_FAVORITE_FAILURE,
            ],
            url: removeFavoriteUrl,
            method: HttpMethod.DELETE,
        },
        actionData: {
            errorMessage: 'Remove from Favorites Failed',
            bookId,
        },
    };
};

export const removeFavoriteAction = (bookId: string): IActionGenerator => {
    return removeFavorite(bookId);
};
