import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  chefId: string;
  chefName: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CART_STORAGE_KEY = 'homechef_cart_v1';
const EMPTY_CART_STATE: CartState = { items: [], total: 0 };

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const loadCartState = (): CartState => {
  if (typeof window === 'undefined') {
    return EMPTY_CART_STATE;
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return EMPTY_CART_STATE;
    }

    const parsed = JSON.parse(storedCart) as { items?: CartItem[] };
    const items = Array.isArray(parsed.items) ? parsed.items : [];

    return {
      items,
      total: calculateTotal(items),
    };
  } catch (error) {
    console.error('Failed to restore cart state:', error);
    return EMPTY_CART_STATE;
  }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.dishId === action.payload.dishId);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.dishId === action.payload.dishId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const newItem: CartItem = { ...action.payload, quantity: 1 };
      const updatedItems = [...state.items, newItem];

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'CLEAR_CART': {
      return EMPTY_CART_STATE;
    }

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART_STATE, loadCartState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items: state.items })
      );
    } catch (error) {
      console.error('Failed to persist cart state:', error);
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
