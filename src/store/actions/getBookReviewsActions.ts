import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_BOOK_REVIEWS_REQUEST = 'GET_BOOK_REVIEWS_REQUEST';
export const GET_BOOK_REVIEWS_SUCCESS = 'GET_BOOK_REVIEWS_SUCCESS';
export const GET_BOOK_REVIEWS_FAILURE = 'GET_BOOK_REVIEWS_FAILURE';

export const getBookReviews = (bookId: string, skip: number = 0, limit: number = 10): IActionGenerator => {
    let getBookReviewsUrl = getBase() + '/api/v1' + URLS.BOOK_REVIEWS_URL;
    getBookReviewsUrl = getBookReviewsUrl.replace('{bookId}', bookId);
    getBookReviewsUrl += `?skip=${skip}&limit=${limit}`;
    
    return {
        [CALL_API]: {
            types: [
                GET_BOOK_REVIEWS_REQUEST,
                GET_BOOK_REVIEWS_SUCCESS,
                GET_BOOK_REVIEWS_FAILURE,
            ],
            url: getBookReviewsUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Fetch Book Reviews Failed',
        },
    };
};

export const getBookReviewsAction = (bookId: string, skip?: number, limit?: number): IActionGenerator => {
    return getBookReviews(bookId, skip, limit);
};
