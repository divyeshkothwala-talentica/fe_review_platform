import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';
import { getBase } from '../../services/api';

export const UPDATE_USER_PROFILE_REQUEST = 'UPDATE_USER_PROFILE_REQUEST';
export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_FAILURE = 'UPDATE_USER_PROFILE_FAILURE';

export const updateUserProfile = (profileData: { email?: string; name?: string }): IActionGenerator => {
    const updateUserProfileUrl = getBase() + URLS.USER_PROFILE_URL;
    return {
        [CALL_API]: {
            types: [
                UPDATE_USER_PROFILE_REQUEST,
                UPDATE_USER_PROFILE_SUCCESS,
                UPDATE_USER_PROFILE_FAILURE,
            ],
            url: updateUserProfileUrl,
            method: HttpMethod.PUT,
            data: profileData,
        },
        actionData: {
            errorMessage: 'Update User Profile Failed',
        },
    };
};

export const updateUserProfileAction = (profileData: { email?: string; name?: string }): IActionGenerator => {
    return updateUserProfile(profileData);
};
