import { FC, useReducer, ReactNode } from 'react'
import { UIContext, UIReducer } from './'

export interface UIState {
   isMenuOpen: boolean;
}

export const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false
}

interface Props {
  children: ReactNode
}

export const UIProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE)

  const toggleMenu = () => {
    dispatch({ type: 'UI_toggle' })
  }

  return (
        <UIContext.Provider value={{
          ...state,
          toggleMenu
        }}>
             {children}
        </UIContext.Provider>
  )
}
