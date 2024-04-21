import { Disclosure } from "@headlessui/react";
import {

  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs"; // Import icons from react-icons library
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../../../../components";
import { getUserInfoFromCookie } from "../../../../utils";
import { getRequest } from "../../../../utils/apiHandler";
import { setItemsToCart } from "../../../../utils/handleAddToCart";

const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "Recycle", label: "Recycle" },
      { value: "Reuse", label: "Reuse" },
     
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  const user = getUserInfoFromCookie();

  const [allProductDetails, setAllProductDetails] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // State to track selected categories

  const fetchAllProducts = async () => {
    const response = await getRequest({
      endpoint: "/products",
    });

    if (response.ok) {
      setAllProductDetails(response.data);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const addToCart = (product) => {
    setItemsToCart(product);
    alert(`${product.title} has been added to the cart.`);
  };

  const handleFilterChange = (e, section, option) => {
    const { checked } = e.target;
    const category = option.value;

    // Update selected categories state
    if (checked) {
      // Add category to selectedCategories array if not already present
      setSelectedCategories((prevSelected) => [...prevSelected, category]);
    } else {
      // Remove category from selectedCategories array
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((c) => c !== category)
      );
    }
  };

  // Filter products based on selected categories
  const filteredProducts =
    selectedCategories.length > 0
      ? allProductDetails.filter((product) =>
          selectedCategories.includes(product.category)
        )
      : allProductDetails;

  return (
    <>
      <Navbar />

      <div className="bg-white mt-[4rem]">
        <div>
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                New Arrivals
              </h1>

              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <form className="hidden lg:block">
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={selectedCategories.includes(
                                      option.value
                                    )}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) =>
                                      handleFilterChange(e, section, option)
                                    }
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>

                {/* Product grid */}
                <div className="lg:col-span-3">
                  <div className="bg-white">
                    <div className="mx-auto max-w-2xl mt-0 px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        All Products
                      </h2>

                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {filteredProducts.map((product) => (
                          <div
                            key={product._id}
                            className="group relative border-solid border-2 p-2 hover:scale-110"
                          >
                            <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-60">
                              {product.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={`http://localhost:8000/${image}`}
                                  alt={image}
                                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                              ))}
                              <div className="z-20 group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0">
                                <button onClick={() => addToCart(product)}>
                                  <div className="flex justify-center items-center w-12 h-12 text-white bg-red-500">
                                    <BsPlus className="text-3xl" />
                                  </div>
                                </button>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                              <div>
                                <h3 className="text-sm text-gray-700">
                                  <a href={product.thumbnail}>
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-0"
                                    />
                                    {product.title}
                                  </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {product.category}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {product.point}
                              </p>
                            </div>

                            <Link
                              to={`/singleproduct/${product._id}`}
                              key={product._id}
                              className="relative z-20"
                            >
                              <button className="w-full py-2 px-3 bg-blue-700 text-white rounded">
                                View Product
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
