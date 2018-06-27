import { AnyAction } from 'redux';
const ADD: string = 'ADD';
const DELETE: string = 'DELETE';

export interface Book {
    id: number;
    name: string;
    price: number
}


export function add(item: Book){
    return {type: ADD, item}
}
export function del(id: number){
    return {type: DELETE, id}
}

export function books(state: Array<Book> = [], action: AnyAction) {
  switch (action.type) {
      case ADD:
          return [...state, action.item]
      case DELETE:
        return state.filter(item=>item.id != action.id)
      default:;
  }
  return state;
}
