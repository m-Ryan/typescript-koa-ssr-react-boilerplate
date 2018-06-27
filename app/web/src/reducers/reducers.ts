import {
  combineReducers
} from 'redux';

import  { books } from '../model/books';



const reducers = combineReducers({
    books: books
})

export default reducers
