import {applyMiddleware, compose, createStore} from 'redux';
import Thunk from 'redux-thunk';
import reducers from './reducers';

export function configureStore(initialState) {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        reducers,
        initialState,
        composeEnhancers(applyMiddleware(Thunk))
    );
}
