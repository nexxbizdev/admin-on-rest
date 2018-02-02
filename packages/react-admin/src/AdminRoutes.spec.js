/* eslint react/jsx-key: off */
import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'enzyme';
import { html } from 'cheerio';
import assert from 'assert';
import TranslationProvider from './i18n/TranslationProvider';

import { AdminRoutes } from './AdminRoutes';

describe('<AdminRoutes>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const Custom = () => <div>Custom</div>;
    const appLayout = ({ children }) => (
        <div className="layout">{children}</div>
    );

    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const store = createStore(() => ({
        admin: { auth: { isLoggedIn: true } },
        i18n: { locale: 'en' },
    }));

    const defaultProps = {
        appLayout,
        resources: [{}],
        declareResources: jest.fn(() => {}),
    };

    it('should show dashboard on / when provided', () => {
        const wrapper = render(
            <Provider store={store}>
                <TranslationProvider>
                    <MemoryRouter initialEntries={['/']}>
                        <AdminRoutes {...defaultProps} dashboard={Dashboard}>
                            <div name="posts" />
                        </AdminRoutes>
                    </MemoryRouter>
                </TranslationProvider>
            </Provider>
        );
        assert.equal(
            html(wrapper),
            '<div class="layout"><div>Dashboard</div></div>'
        );
    });

    it('should accept custom routes without layout', () => {
        const customRoutes = [
            <Route path="/custom" component={Custom} noLayout />,
        ];
        const wrapper = render(
            <Provider store={store}>
                <TranslationProvider>
                    <MemoryRouter initialEntries={['/custom']}>
                        <AdminRoutes
                            {...defaultProps}
                            customRoutes={customRoutes}
                        >
                            <div name="posts" />
                        </AdminRoutes>
                    </MemoryRouter>
                </TranslationProvider>
            </Provider>
        );
        assert.equal(html(wrapper), '<div>Custom</div>');
    });

    it('should accept custom routes with layout', () => {
        const customRoutes = [<Route path="/custom" component={Custom} />];
        const wrapper = render(
            <Provider store={store}>
                <TranslationProvider>
                    <MemoryRouter initialEntries={['/custom']}>
                        <AdminRoutes
                            {...defaultProps}
                            customRoutes={customRoutes}
                        >
                            <div name="posts" />
                        </AdminRoutes>
                    </MemoryRouter>
                </TranslationProvider>
            </Provider>
        );
        assert.equal(
            html(wrapper),
            '<div class="layout"><div>Custom</div></div>'
        );
    });
});
