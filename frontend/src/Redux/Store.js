import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Reducer from "./Reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const Store = createStore(Reducer, composeEnhancers(applyMiddleware(thunk)));

export default Store;
