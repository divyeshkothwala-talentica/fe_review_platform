import BookListing from './components/BookList/BookListing';
import UserProfile from './components/UserProfile/UserProfile';

const applicationRoutes = [
    {
        path: '/',
        component: BookListing,
    },
    {
        path: '/books',
        component: BookListing,
    },
    {
        path: '/profile',
        component: UserProfile,
    },
];

export default applicationRoutes;
