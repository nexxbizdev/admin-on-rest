import assert from 'assert';
import reducer from './index';
import { DECLARE_RESOURCES } from '../../../actions';

describe('Resources Reducer', () => {
    it('should return previous state if the action has no resource meta and is not DECLARE_RESOURCES', () => {
        const previousState = { previous: true };
        assert.deepEqual(
            reducer(previousState, { type: 'A_TYPE', meta: { foo: 'bar' } }),
            previousState
        );
    });

    it('should initialize resources upon DECLARE_RESOURCES', () => {
        const resources = [
            { name: 'posts', hasList: true },
            { name: 'comments', hasCreate: true },
            { name: 'users', hasEdit: true },
        ];

        const dataReducer = () => () => 'data_data';
        const listReducer = () => () => 'list_data';

        assert.deepEqual(
            reducer(
                { oldResource: {} },
                { type: DECLARE_RESOURCES, payload: resources },
                dataReducer,
                listReducer
            ),
            {
                posts: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'posts', hasList: true },
                },
                comments: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'comments', hasCreate: true },
                },
                users: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'users', hasEdit: true },
                },
            }
        );
    });

    it('should call inner reducers for each resource when action has a resource meta', () => {
        const innerReducer = state => state;
        const dataReducer = jest.fn(() => innerReducer);
        const listReducer = jest.fn(() => innerReducer);

        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'comments' },
                    },
                },
                { type: 'A_RESOURCE_ACTION', meta: { resource: 'posts' } },
                dataReducer,
                listReducer
            ),
            {
                posts: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'posts' },
                },
                comments: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'comments' },
                },
            }
        );

        assert.equal(dataReducer.mock.calls[0][0], 'posts');
        assert.equal(listReducer.mock.calls[0][0], 'posts');
    });
});
