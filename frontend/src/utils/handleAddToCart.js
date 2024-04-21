export const getItemsFromCart = () => {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
};

const storeCartItemsInLocalStorage = cartItems => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

export const setItemsToCart = (item, quantity = 1) => {
  const cartItems = getItemsFromCart();

  const existingCartItemIndex = cartItems.findIndex(
    cartItem => cartItem._id === item._id
  );

  if (existingCartItemIndex === -1) {
    cartItems.push({ ...item, quantity });
  } else {
    cartItems[existingCartItemIndex].quantity += quantity;
  }

  storeCartItemsInLocalStorage(cartItems);

  return cartItems;
};

export const removeItemFromCart = _id => {
  const cartItems = getItemsFromCart();
  const newCartItems = cartItems.filter(item => item._id !== _id);
  storeCartItemsInLocalStorage(newCartItems);
  return newCartItems;
};

export const decreaseQuantity = _id => {
  const cartItems = getItemsFromCart();

  const existingCartItem = cartItems.findIndex(
    cartItem => cartItem?._id === _id
  );

  if (existingCartItem !== -1 && cartItems[existingCartItem].quantity !== 0) {
    cartItems[existingCartItem].quantity -= 1;
  }

  storeCartItemsInLocalStorage(cartItems);
  return cartItems;
};

export const calculateOrderTotal = () => {
  const cartItems = getItemsFromCart();
  return cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
};

export const clearCart = () => {
  localStorage.removeItem('cartItems');
  return [];
};

