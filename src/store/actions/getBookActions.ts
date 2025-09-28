import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const GET_BOOK_REQUEST = 'GET_BOOK_REQUEST';
export const GET_BOOK_SUCCESS = 'GET_BOOK_SUCCESS';
export const GET_BOOK_FAILURE = 'GET_BOOK_FAILURE';

export const getBook = (bookId: string): IActionGenerator => {
    let getBookUrl = getBase() + '/api/v1' + URLS.BOOKS_URL + `/${bookId}`;
    return {
        [CALL_API]: {
            types: [
                GET_BOOK_REQUEST,
                GET_BOOK_SUCCESS,
                GET_BOOK_FAILURE,
            ],
            url: getBookUrl,
            method: HttpMethod.GET,
        },
        actionData: {
            errorMessage: 'Get Book Failed',
        },
    };
};

export const getBookAction = (bookId: string): IActionGenerator => {
    return getBook(bookId);
};
