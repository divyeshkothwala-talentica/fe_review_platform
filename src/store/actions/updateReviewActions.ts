import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';

export const UPDATE_REVIEW_REQUEST = 'UPDATE_REVIEW_REQUEST';
export const UPDATE_REVIEW_SUCCESS = 'UPDATE_REVIEW_SUCCESS';
export const UPDATE_REVIEW_FAILURE = 'UPDATE_REVIEW_FAILURE';

export const updateReview = (reviewId: string, rating: number, text: string): IActionGenerator => {
    const updateReviewUrl = URLS.REVIEWS_URL + `/${reviewId}`;
    
    return {
        [CALL_API]: {
            types: [
                UPDATE_REVIEW_REQUEST,
                UPDATE_REVIEW_SUCCESS,
                UPDATE_REVIEW_FAILURE,
            ],
            url: updateReviewUrl,
            method: HttpMethod.PUT,
            data: {
                rating,
                text,
            },
        },
        actionData: {
            errorMessage: 'Update Review Failed',
        },
    };
};

export const updateReviewAction = (reviewId: string, rating: number, text: string): IActionGenerator => {
    return updateReview(reviewId, rating, text);
};
