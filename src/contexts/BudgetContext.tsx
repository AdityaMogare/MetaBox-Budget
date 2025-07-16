import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface BudgetItem {
  id: string
  category: string
  subcategory: string
  description: string
  amount: number
  actual: number
  variance: number
  notes: string
  date: string
}

export interface BudgetState {
  items: BudgetItem[]
  totalBudget: number
  totalActual: number
  totalVariance: number
  categories: string[]
  subcategories: Record<string, string[]>
}

// Actions
type BudgetAction =
  | { type: 'ADD_ITEM'; payload: BudgetItem }
  | { type: 'UPDATE_ITEM'; payload: BudgetItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_ITEMS'; payload: BudgetItem[] }
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'ADD_SUBCATEGORY'; payload: { category: string; subcategory: string } }

// Initial state
const initialState: BudgetState = {
  items: [],
  totalBudget: 0,
  totalActual: 0,
  totalVariance: 0,
  categories: [
    'Above the Line',
    'Production',
    'Post-Production',
    'Other',
    'Contingency'
  ],
  subcategories: {
    'Above the Line': ['Director', 'Producer', 'Writer', 'Cast', 'Crew'],
    'Production': ['Equipment', 'Location', 'Props', 'Costumes', 'Transportation'],
    'Post-Production': ['Editing', 'Visual Effects', 'Sound', 'Music', 'Color Grading'],
    'Other': ['Insurance', 'Legal', 'Marketing', 'Distribution'],
    'Contingency': ['Emergency Fund', 'Overages']
  }
}

// Reducer
function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        totalBudget: state.totalBudget + action.payload.amount,
        totalActual: state.totalActual + action.payload.actual,
        totalVariance: state.totalVariance + action.payload.variance
      }
    
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? action.payload : item
      )
      const newTotalBudget = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const newTotalActual = updatedItems.reduce((sum, item) => sum + item.actual, 0)
      const newTotalVariance = updatedItems.reduce((sum, item) => sum + item.variance, 0)
      
      return {
        ...state,
        items: updatedItems,
        totalBudget: newTotalBudget,
        totalActual: newTotalActual,
        totalVariance: newTotalVariance
      }
    
    case 'DELETE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      const remainingBudget = filteredItems.reduce((sum, item) => sum + item.amount, 0)
      const remainingActual = filteredItems.reduce((sum, item) => sum + item.actual, 0)
      const remainingVariance = filteredItems.reduce((sum, item) => sum + item.variance, 0)
      
      return {
        ...state,
        items: filteredItems,
        totalBudget: remainingBudget,
        totalActual: remainingActual,
        totalVariance: remainingVariance
      }
    
    case 'SET_ITEMS':
      const totalBudget = action.payload.reduce((sum, item) => sum + item.amount, 0)
      const totalActual = action.payload.reduce((sum, item) => sum + item.actual, 0)
      const totalVariance = action.payload.reduce((sum, item) => sum + item.variance, 0)
      
      return {
        ...state,
        items: action.payload,
        totalBudget,
        totalActual,
        totalVariance
      }
    
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
        subcategories: {
          ...state.subcategories,
          [action.payload]: []
        }
      }
    
    case 'ADD_SUBCATEGORY':
      return {
        ...state,
        subcategories: {
          ...state.subcategories,
          [action.payload.category]: [
            ...(state.subcategories[action.payload.category] || []),
            action.payload.subcategory
          ]
        }
      }
    
    default:
      return state
  }
}

// Context
interface BudgetContextType {
  state: BudgetState
  dispatch: React.Dispatch<BudgetAction>
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

// Provider
interface BudgetProviderProps {
  children: ReactNode
}

export function BudgetProvider({ children }: BudgetProviderProps) {
  const [state, dispatch] = useReducer(budgetReducer, initialState)

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  )
}

// Hook
export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider')
  }
  return context
} 