import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';

export const ADD_FAVORITE_REQUEST = 'ADD_FAVORITE_REQUEST';
export const ADD_FAVORITE_SUCCESS = 'ADD_FAVORITE_SUCCESS';
export const ADD_FAVORITE_FAILURE = 'ADD_FAVORITE_FAILURE';

export const UPDATE_FAVORITE_OPTIMISTIC = 'UPDATE_FAVORITE_OPTIMISTIC';

export const addFavorite = (bookId: string): IActionGenerator => {
    return {
        [CALL_API]: {
            types: [
                ADD_FAVORITE_REQUEST,
                ADD_FAVORITE_SUCCESS,
                ADD_FAVORITE_FAILURE,
            ],
            url: URLS.FAVORITES_URL,
            method: HttpMethod.POST,
            data: { bookId },
        },
        actionData: {
            errorMessage: 'Add to Favorites Failed',
            bookId,
        },
    };
};

export const addFavoriteAction = (bookId: string): IActionGenerator => {
    return addFavorite(bookId);
};

export const updateFavoriteOptimistic: any = (bookId: string, isFavorite: boolean) => {
    return { 
        type: UPDATE_FAVORITE_OPTIMISTIC, 
        response: { bookId, isFavorite } 
    };
};
