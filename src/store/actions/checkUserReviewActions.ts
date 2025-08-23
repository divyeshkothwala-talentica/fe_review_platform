import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const CHECK_USER_REVIEW_REQUEST = 'CHECK_USER_REVIEW_REQUEST';
export const CHECK_USER_REVIEW_SUCCESS = 'CHECK_USER_REVIEW_SUCCESS';
export const CHECK_USER_REVIEW_FAILURE = 'CHECK_USER_REVIEW_FAILURE';

export const checkUserReview = (bookId: string): IActionGenerator => {
    const checkUserReviewUrl = getBase() + `/v1/reviews/check/${bookId}`;
    
    return {
        [CALL_API]: {
            types: [
                CHECK_USER_REVIEW_REQUEST,
                CHECK_USER_REVIEW_SUCCESS,
                CHECK_USER_REVIEW_FAILURE,
            ],
            url: checkUserReviewUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Check User Review Failed',
        },
    };
};

export const checkUserReviewAction = (bookId: string): IActionGenerator => {
    return checkUserReview(bookId);
};
