import {createContext, useReducer} from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {}
});

function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    // ..update state to add a meal item
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
    const updatedItems = [...state.items];

    if(existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];

      updatedItems[existingCartItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };
    } else {
      const newItem = {
        ...action.item,
        quantity: 1
      };
      updatedItems.push(newItem);
    }
    return {...state, items: updatedItems};
  }

  if (action.type === 'REMOVE_ITEM') {
    // ..update state to remove a meal item
    let updatedItems = [...state.items];
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
    const existingCartItem = state.items[existingCartItemIndex];

    if(existingCartItem.quantity > 1) {
      updatedItems[existingCartItemIndex] = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1
      }
    } else {
      // updatedItems = updatedItems.filter((item) => item.id !== existingCartItemIndex);
      updatedItems.splice(existingCartItemIndex, 1);
    }
    return {...state, items: updatedItems};
  }

  if(action.type === 'CLEAR_CART') {
    return {...state, items: []};
  }

  return state;
}

export function CartContextProvider({children}) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({
      type: 'ADD_ITEM',
      item
    });
  }

  function removeItem(id) {
    dispatchCartAction({
      type: 'REMOVE_ITEM',
      id
    });
  }

  function clearCart() {
    dispatchCartAction({
      type: 'CLEAR_CART'
    });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  };

  // console.log(cartContext);

  return (
      <CartContext.Provider value={cartContext}>
        {children}
      </CartContext.Provider>
  );
}

export default CartContext;
