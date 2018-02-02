import React, { Children, Component, cloneElement, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import { declareResources as declareResourcesAction } from './actions';
import Loading from './mui/layout/Loading';
import NotFound from './mui/layout/NotFound';
import WithPermissions from './auth/WithPermissions';
import { AUTH_GET_PERMISSIONS } from './auth/types';
import { isLoggedIn, getResources } from './reducer';
import DefaultLayout from './mui/layout/Layout';
import Logout from './mui/auth/Logout';
import Menu from './mui/layout/Menu';

export class AdminRoutes extends Component {
    state = { children: [] };

    componentWillMount() {
        this.initializeResources(this.props);
    }

    initializeResources = props => {
        if (typeof props.children === 'function') {
            props.authClient(AUTH_GET_PERMISSIONS).then(permissions => {
                const resources = props
                    .children(permissions)
                    .filter(node => node);

                this.setState({ children: resources });
                this.props.declareResources(
                    resources.map(node => ({
                        name: node.props.name,
                        options: node.props.options,
                        hasList: !!node.props.list,
                        hasEdit: !!node.props.edit,
                        hasShow: !!node.props.show,
                        hasCreate: !!node.props.create,
                        hasDelete: !!node.props.remove,
                        icon: node.props.icon,
                    }))
                );
            });
        } else {
            const resources =
                React.Children.map(
                    props.children,
                    child => (child ? child.props : false)
                ) || [];

            if (resources.length) {
                this.props.declareResources(
                    resources.filter(r => r).map(resource => ({
                        name: resource.name,
                        options: resource.options,
                        hasList: !!resource.list,
                        hasEdit: !!resource.edit,
                        hasShow: !!resource.show,
                        hasCreate: !!resource.create,
                        hasDelete: !!resource.remove,
                        icon: resource.icon,
                    }))
                );
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            this.setState(
                {
                    children: [],
                },
                () => this.initializeResources(nextProps)
            );
        }
    }

    render() {
        const {
            appLayout,
            catchAll,
            children,
            customRoutes,
            dashboard,
            logout,
            menu,
            resources,
            theme,
            title,
        } = this.props;

        const { children: childrenFromState } = this.state;

        let childrenToRender =
            typeof children !== 'function' ? children : childrenFromState;

        if (!resources || resources.length === 0) {
            return (
                <Route
                    path="/"
                    key="loading"
                    render={() => (
                        <Loading
                            loadingPrimary="ra.page.loading"
                            loadingSecondary="ra.message.loading"
                        />
                    )}
                />
            );
        }

        return (
            <Switch>
                {customRoutes &&
                    customRoutes
                        .filter(route => route.props.noLayout)
                        .map((route, index) => (
                            <Route
                                key={index}
                                exact={route.props.exact}
                                path={route.props.path}
                                render={props => {
                                    if (route.props.render) {
                                        return route.props.render({
                                            ...props,
                                            title,
                                        });
                                    }
                                    if (route.props.component) {
                                        return createElement(
                                            route.props.component,
                                            {
                                                ...props,
                                                title,
                                            }
                                        );
                                    }
                                }}
                            />
                        ))}
                <Route
                    path="/"
                    render={() =>
                        createElement(appLayout, {
                            children: (
                                <Switch>
                                    {customRoutes &&
                                        customRoutes.map((route, index) => (
                                            <Route
                                                key={index}
                                                exact={route.props.exact}
                                                path={route.props.path}
                                                component={
                                                    route.props.component
                                                }
                                                render={route.props.render}
                                                children={route.props.children} // eslint-disable-line react/no-children-prop
                                            />
                                        ))}
                                    {Children.map(childrenToRender, child => (
                                        <Route
                                            path={`/${child.props.name}`}
                                            render={props =>
                                                cloneElement(child, {
                                                    context: 'route',
                                                    ...props,
                                                })}
                                        />
                                    ))}
                                    {dashboard ? (
                                        <Route
                                            exact
                                            path="/"
                                            render={routeProps => (
                                                <WithPermissions
                                                    authParams={{
                                                        route: 'dashboard',
                                                    }}
                                                    {...routeProps}
                                                    render={props =>
                                                        React.createElement(
                                                            dashboard,
                                                            props
                                                        )}
                                                />
                                            )}
                                        />
                                    ) : (
                                        childrenToRender[0] && (
                                            <Route
                                                exact
                                                path="/"
                                                render={() => (
                                                    <Redirect
                                                        to={`/${childrenToRender[0]
                                                            .props.name}`}
                                                    />
                                                )}
                                            />
                                        )
                                    )}
                                    <Route
                                        render={() =>
                                            React.createElement(
                                                catchAll || NotFound,
                                                {
                                                    title,
                                                }
                                            )}
                                    />
                                </Switch>
                            ),
                            dashboard,
                            logout,
                            menu,
                            theme,
                            title,
                        })}
                />
            </Switch>
        );
    }
}

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

AdminRoutes.propTypes = {
    appLayout: componentPropType,
    authClient: PropTypes.func,
    catchAll: componentPropType,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    declareResources: PropTypes.func.isRequired,
    logout: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.string,
    ]),
    menu: componentPropType,
    isLoggedIn: PropTypes.bool,
    theme: PropTypes.object,
    title: PropTypes.node,
};

AdminRoutes.defaultProps = {
    appLayout: DefaultLayout,
    logout: Logout,
    menu: Menu,
};

const mapStateToProps = state => ({
    isLoggedIn: isLoggedIn(state),
    resources: getResources(state),
});

export default compose(
    getContext({
        authClient: PropTypes.func,
    }),
    connect(mapStateToProps, { declareResources: declareResourcesAction })
)(AdminRoutes);
