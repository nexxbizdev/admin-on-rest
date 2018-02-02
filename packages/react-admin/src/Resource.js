import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui-icons/ViewList';
import { Route, Switch } from 'react-router-dom';
import WithPermissions from './auth/WithPermissions';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

export const Resource = ({
    match,
    name,
    list,
    create,
    edit,
    show,
    remove,
    options,
}) => {
    const resource = {
        resource: name,
        options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        hasDelete: !!remove,
    };

    return (
        <Switch>
            {create && (
                <Route
                    exact
                    path={`${match.url}/create`}
                    render={routeProps => (
                        <WithPermissions
                            render={props => createElement(create, props)}
                            {...routeProps}
                            {...resource}
                        />
                    )}
                />
            )}
            {show && (
                <Route
                    exact
                    path={`${match.url}/:id/show`}
                    render={routeProps => (
                        <WithPermissions
                            render={props => createElement(show, props)}
                            {...routeProps}
                            {...resource}
                        />
                    )}
                />
            )}
            {remove && (
                <Route
                    exact
                    path={`${match.url}/:id/delete`}
                    render={routeProps => (
                        <WithPermissions
                            render={props => createElement(remove, props)}
                            {...routeProps}
                            {...resource}
                        />
                    )}
                />
            )}
            {edit && (
                <Route
                    exact
                    path={`${match.url}/:id`}
                    render={routeProps => (
                        <WithPermissions
                            render={props => createElement(edit, props)}
                            {...routeProps}
                            {...resource}
                        />
                    )}
                />
            )}
            {list && (
                <Route
                    exact
                    path={`${match.url}`}
                    render={routeProps => (
                        <WithPermissions
                            render={props => createElement(list, props)}
                            {...routeProps}
                            {...resource}
                        />
                    )}
                />
            )}
        </Switch>
    );
};

Resource.propTypes = {
    name: PropTypes.string.isRequired,
    list: componentPropType,
    create: componentPropType,
    edit: componentPropType,
    show: componentPropType,
    remove: componentPropType,
    icon: componentPropType,
    options: PropTypes.object,
    match: PropTypes.object,
};

Resource.defaultProps = {
    icon: ViewListIcon,
    options: {},
};

export default Resource;
