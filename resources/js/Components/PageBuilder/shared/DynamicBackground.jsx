import { lazy, Suspense } from 'react';

const backgrounds = {
    event: lazy(() => import('./backgrounds/EventBackground')),
    product: lazy(() => import('./backgrounds/ProductBackground')),
    wheel: lazy(() => import('./backgrounds/WheelBackground')),
    course: lazy(() => import('./backgrounds/CourseBackground')),
    team: lazy(() => import('./backgrounds/TeamBackground')),
    company: lazy(() => import('./backgrounds/CompanyBackground')),
    app: lazy(() => import('./backgrounds/AppBackground')),
    landing: lazy(() => import('./backgrounds/LandingBackground')),
    news: lazy(() => import('./backgrounds/NewsBackground')),
    portfolio: lazy(() => import('./backgrounds/PortfolioBackground')),
};

export default function DynamicBackground({ template = 'event', colorTheme = 'cyan' }) {
    const Background = backgrounds[template] || backgrounds.event;

    return (
        <Suspense fallback={null}>
            <Background colorTheme={colorTheme} />
        </Suspense>
    );
}