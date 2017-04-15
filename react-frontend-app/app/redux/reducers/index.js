import {combineReducers} from 'redux';

//import other reducers 
import auth from './authReducer';
import user from './userReducer';
import game from './gameReducer';

export default combineReducers({
    auth,
    user,
    game
})
