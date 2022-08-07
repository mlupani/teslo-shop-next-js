import { IUser } from '../../interfaces'
import { AuthState } from './'

type authActionType =
| { type: 'Auth - login', payload: IUser}
| { type: 'Auth - logout'}

export const authReducer = (state: AuthState, action: authActionType):AuthState => {
  switch (action.type) {
    case 'Auth - login':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true
      }
    case 'Auth - logout':
      return {
        ...state,
        user: undefined,
        isLoggedIn: false
      }
    default:
      return state
  }
}
