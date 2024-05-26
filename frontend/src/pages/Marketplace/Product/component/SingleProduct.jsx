import { useEffect, useState } from "react";
import { Footer, Loader, Navbar } from "../../../../components";
import { getRequest } from "../../../../utils/apiHandler";
import { useParams } from "react-router-dom";
import { setItemsToCart } from "../../../../utils/handleAddToCart";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SingleProduct() {
  const { productID } = useParams();

  // for loader
  const [loader, setLoader] = useState(false);

  const [allProductDetails, setAllProductDetails] = useState([]);

  const fetchAllProducts = async () => {
    setLoader(false);
    const response = await getRequest({
      endpoint: `/products/${productID}`,
    });

    if (response.ok) {
      setLoader(false);
      setAllProductDetails(response.data);
    } else {
      console.log("ERROR");
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAllProducts(productID);
  }, [productID]);

  const addToCart = (product) => {
    setItemsToCart(product);
    alert(`${product.title} has been added to the cart.`);
  };

  return (
    <>
      {loader && <Loader />}
      <Navbar />
      <div className="bg-white mt-[8rem] mb-[-8rem]">
        <div className="pt-6">
          {allProductDetails.map((product) => (
            <>
              {/* Image gallery */}
              <div className="flex gap-5 items-center w-[90%] mx-auto">
                {product.images.map((image) => (
                  <>
                    <div className="">
                      <img
                        src={`http://localhost:8000/${image}`}
                        alt={`https://localhost:8000/${image}`}
                        className="w-full h-full"
                      />
                    </div>
                  </>
                ))}
              </div>

              {/* Product info */}
              <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {product.title}
                  </h1>
                </div>

                {/* Options */}
                <div className="mt-4 lg:row-span-3 lg:mt-0">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl tracking-tight text-gray-900">
                    {product.point}
                  </p>

                  <div className="mt-10">
                    <button
                      type="submit"
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-[#119f48] px-8 py-3 text-base font-medium text-white hover:scale-105 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none "
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                  {/* Description and details */}
                  <div>
                    <h3 className="sr-only">Description</h3>

                    <div className="space-y-6">
                      <p className="text-base text-gray-900">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-sm font-medium text-gray-900">
                      Highlights
                    </h3>

                    <div className="mt-4"></div>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-sm font-medium text-gray-900">
                      Details of Product
                    </h2>

                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
