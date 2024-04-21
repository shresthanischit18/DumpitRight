import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Footer, Navbar } from "../../components";
import { getUserInfoFromCookie, setCookie } from "../../utils";
import { getRequest, postRequest } from "../../utils/apiHandler";
import {
  clearCart,
  decreaseQuantity,
  getItemsFromCart,
  removeItemFromCart,
  setItemsToCart,
} from "../../utils/handleAddToCart";
import { Alert, Button } from "@material-tailwind/react";

export default function Cart() {
  const userCookie = getUserInfoFromCookie();

  // State variable for managing the cart items
  const [cartItems, setCartItems] = useState(getItemsFromCart());

  const [productData, setProductData] = useState([]);

  // Update cart items from local storage on mount
  useEffect(() => {
    setCartItems(getItemsFromCart());
  }, []);

  // Function to handle increasing quantity of a cart item
  const handleIncreaseQuantity = (product) => {
    // Check if the current quantity + 1 exceeds the available quantity
    if (product.quantity + 1 > product.availableQuantity) {
      // Display an alert message if the quantity exceeds available quantity
      alert("Cannot increase quantity beyond available stock.");
    } else {
      // Increase the quantity of the product in the cart
      setItemsToCart(product, 1);
      setCartItems(getItemsFromCart()); // Update the state
    }
  };

  // Function to handle decreasing quantity of a cart item
  const handleDecreaseQuantity = (product) => {
    // Decrease the quantity of the product in the cart
    decreaseQuantity(product._id);
    setCartItems(getItemsFromCart()); // Update the state
  };

  // Function to handle removing a cart item
  const handleRemoveItem = (product) => {
    // Remove the product from the cart
    removeItemFromCart(product._id);
    setCartItems(getItemsFromCart()); // Update the state
  };

  // Fetching real quantity
  const fetchProductDetails = async () => {
    const response = await getRequest({
      endpoint: "/products",
    });
    if (response.ok) {
      setProductData(response.data);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  // Define a function to handle checkout
  // Define a function to handle checkout
  const handleCheckout = async () => {
    // Calculate the total points from the cart items
    const totalPoints = mergedCartItems.reduce((total, item) => {
      return total + item.quantity * item.point;
    }, 0);

    // Compare total points with user's reward points
    if (totalPoints > userCookie.rewardPoint) {
      // If total points exceed user's reward points, show an alert message
      toast.error(
        " 'Total points exceed your available reward points. Please adjust the quantity or remove items.'"
      );
    } else {
      const orderItems = getItemsFromCart();
      // Call the PATCH request to update user's reward points
      const response = await postRequest({
        endpoint: `/orders`,
        data: {
          orderItems: orderItems,
          orderTotal: totalPoints,
          userID: userCookie._id,
        },
      });

      if (response.ok) {
        userCookie.rewardPoint -= totalPoints;

        setCookie("user", JSON.stringify(userCookie));

        toast.success(
          "Your order is placed successfully. It will be delivered soon."
        );

        setCartItems(clearCart());
      } else {
        toast.error(response.message);
      }
    }
  };

  // Merge cart items with product data based on product IDs
  const mergedCartItems = cartItems.map((cartItem) => {
    // Find the matching product data
    const product = productData.find((prod) => prod._id === cartItem._id);
    // Add available quantity to cart item if product data is found
    return product
      ? { ...cartItem, availableQuantity: product.quantity }
      : cartItem;
  });

  const totalPoints = mergedCartItems.reduce((total, item) => {
    // Multiply the item's quantity with the points to calculate total points for the item
    return total + item.quantity * item.point;
  }, 0);

  return (
    <>
      <Navbar />
      <div className="bg-black-900 max-h-full mt-[8rem]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-semibold text-center mb-[4rem]">
              Shopping Cart
            </h1>
            {mergedCartItems?.length === 0 && (
              <>
                <Alert>No Items in the cart. Please add some!!!</Alert>

                <br />
                <br />

                <Link to="/product">
                  <Button color="green">Browse Product</Button>
                </Link>
              </>
            )}

            {mergedCartItems?.length !== 0 && (
              <>
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {mergedCartItems.map((product) => (
                      <li key={product._id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={`http://localhost:8000/${product.images[0]}`}
                            alt={product.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <Link to={product.href}>{product.title}</Link>
                              </h3>
                              <p className="ml-4">{product.price}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1 rounded-full border border-black"
                                onClick={() => handleIncreaseQuantity(product)}
                              >
                                +
                              </button>
                              <p>{product.quantity}</p>
                              <button
                                className="p-1 rounded-full border border-black"
                                onClick={() => handleDecreaseQuantity(product)}
                              >
                                -
                              </button>
                              <p>
                                Available Quantity: {product.availableQuantity}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="font-medium text-[#119f48] hover:text-red-700"
                              onClick={() => handleRemoveItem(product)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  {/* Display total points */}
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                    <p>Total Points</p>
                    <p>{totalPoints}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6" onClick={handleCheckout}>
                    <Link className="flex items-center justify-center rounded-md border border-transparent bg-[#119f48] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#2c874f]">
                      Redeem
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
