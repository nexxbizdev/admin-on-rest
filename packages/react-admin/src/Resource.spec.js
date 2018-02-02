import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { Resource } from './Resource';
import { Route } from 'react-router-dom';

const PostList = () => <div>PostList</div>;
const PostEdit = () => <div>PostEdit</div>;
const PostCreate = () => <div>PostCreate</div>;
const PostShow = () => <div>PostShow</div>;
const PostDelete = () => <div>PostDelete</div>;
const PostIcon = () => <div>PostIcon</div>;

const resource = {
    name: 'posts',
    options: { foo: 'bar' },
    list: PostList,
    edit: PostEdit,
    create: PostCreate,
    show: PostShow,
    remove: PostDelete,
    icon: PostIcon,
};

describe('<Resource>', () => {
    it('renders list route if specified', () => {
        const wrapper = shallow(
            <Resource {...resource} context="route" match={{ url: 'posts' }} />
        );
        assert.ok(wrapper.containsMatchingElement(<Route path="posts" />));
    });
    it('renders create route if specified', () => {
        const wrapper = shallow(
            <Resource {...resource} context="route" match={{ url: 'posts' }} />
        );
        assert.ok(
            wrapper.containsMatchingElement(<Route path="posts/create" />)
        );
    });
    it('renders edit route if specified', () => {
        const wrapper = shallow(
            <Resource {...resource} context="route" match={{ url: 'posts' }} />
        );
        assert.ok(wrapper.containsMatchingElement(<Route path="posts/:id" />));
    });
    it('renders show route if specified', () => {
        const wrapper = shallow(
            <Resource {...resource} context="route" match={{ url: 'posts' }} />
        );
        assert.ok(
            wrapper.containsMatchingElement(<Route path="posts/:id/show" />)
        );
    });
    it('renders delete route if specified', () => {
        const wrapper = shallow(
            <Resource {...resource} context="route" match={{ url: 'posts' }} />
        );
        assert.ok(
            wrapper.containsMatchingElement(<Route path="posts/:id/delete" />)
        );
    });
});
