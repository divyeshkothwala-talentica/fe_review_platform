import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_USER_REVIEWS_REQUEST = 'GET_USER_REVIEWS_REQUEST';
export const GET_USER_REVIEWS_SUCCESS = 'GET_USER_REVIEWS_SUCCESS';
export const GET_USER_REVIEWS_FAILURE = 'GET_USER_REVIEWS_FAILURE';

export const getUserReviews = (userId: string, skip: number = 0, limit: number = 20): IActionGenerator => {
    let getUserReviewsUrl = getBase() + '/v1' + URLS.USER_REVIEWS_URL;
    getUserReviewsUrl = getUserReviewsUrl.replace('{userId}', userId);
    
    // Convert skip to page number (backend expects page-based pagination)
    const page = Math.floor(skip / limit) + 1;
    getUserReviewsUrl += `?page=${page}&limit=${limit}`;
    

    
    return {
        [CALL_API]: {
            types: [
                GET_USER_REVIEWS_REQUEST,
                GET_USER_REVIEWS_SUCCESS,
                GET_USER_REVIEWS_FAILURE,
            ],
            url: getUserReviewsUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Fetch User Reviews Failed',
        },
    };
};

export const getUserReviewsAction = (userId: string, skip: number = 0, limit: number = 20): IActionGenerator => {
    return getUserReviews(userId, skip, limit);
};
