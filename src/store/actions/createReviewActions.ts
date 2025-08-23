import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';

export const CREATE_REVIEW_REQUEST = 'CREATE_REVIEW_REQUEST';
export const CREATE_REVIEW_SUCCESS = 'CREATE_REVIEW_SUCCESS';
export const CREATE_REVIEW_FAILURE = 'CREATE_REVIEW_FAILURE';

export const createReview = (bookId: string, rating: number, text: string): IActionGenerator => {
    const createReviewUrl = URLS.REVIEWS_URL;
    
    return {
        [CALL_API]: {
            types: [
                CREATE_REVIEW_REQUEST,
                CREATE_REVIEW_SUCCESS,
                CREATE_REVIEW_FAILURE,
            ],
            url: createReviewUrl,
            method: HttpMethod.POST,
            data: {
                bookId,
                rating,
                text,
            },
        },
        actionData: {
            errorMessage: 'Create Review Failed',
        },
    };
};

export const createReviewAction = (bookId: string, rating: number, text: string): IActionGenerator => {
    return createReview(bookId, rating, text);
};
