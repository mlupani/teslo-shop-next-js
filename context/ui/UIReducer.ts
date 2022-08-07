import { UIState } from './'

type UIActionType =
| { type: 'UI_toggle'}

export const UIReducer = (state: UIState, { type }: UIActionType):UIState => {
  switch (type) {
    case 'UI_toggle':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      }
    default:
      return state
  }
}
