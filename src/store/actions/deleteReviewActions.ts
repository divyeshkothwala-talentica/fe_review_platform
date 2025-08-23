import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';

export const DELETE_REVIEW_REQUEST = 'DELETE_REVIEW_REQUEST';
export const DELETE_REVIEW_SUCCESS = 'DELETE_REVIEW_SUCCESS';
export const DELETE_REVIEW_FAILURE = 'DELETE_REVIEW_FAILURE';

export const deleteReview = (reviewId: string): IActionGenerator => {
    const deleteReviewUrl = URLS.REVIEWS_URL + `/${reviewId}`;
    
    return {
        [CALL_API]: {
            types: [
                DELETE_REVIEW_REQUEST,
                DELETE_REVIEW_SUCCESS,
                DELETE_REVIEW_FAILURE,
            ],
            url: deleteReviewUrl,
            method: HttpMethod.DELETE,
        },
        actionData: {
            errorMessage: 'Delete Review Failed',
        },
    };
};

export const deleteReviewAction = (reviewId: string): IActionGenerator => {
    return deleteReview(reviewId);
};
