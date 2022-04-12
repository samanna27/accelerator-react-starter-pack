import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createAPI} from '../services/api';
import {composeWithDevTools} from 'redux-devtools-extension';
import {reducer} from '../store/reducer';
import {redirect} from '../store/middlewares/redirect';

const api = createAPI();

export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk.withExtraArgument(api)),
    applyMiddleware(redirect),
  ),
);
