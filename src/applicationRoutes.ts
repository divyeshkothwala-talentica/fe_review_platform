import BookListing from './components/BookList/BookListing';
import UserProfile from './components/UserProfile/UserProfile';
import AIRecommendations from './components/Recommendations/AIRecommendations';

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
    {
        path: '/recommendations',
        component: AIRecommendations,
    },
];

export default applicationRoutes;
