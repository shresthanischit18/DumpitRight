import React, { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { v4 as uuid } from "uuid";
import Swal from "sweetalert2";
import { AddProductForm, EditProductForm, Loader } from "../components";
import { getRequest, deleteRequest } from "../utils/apiHandler";

const Addproduct = () => {
  const [page, setPage] = useState(1);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const [openDialogs, setOpenDialogs] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [displayEditForm, setDisplayEditForm] = useState(false); // Define displayEditForm state variable

  const fetchProducts = async () => {
    setDisplayLoader(true);
    const res = await getRequest({
      endpoint: "/products",
    });

    if (res.ok) {
      setDisplayLoader(false);
      setProducts(res?.data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDisplayForm = (toggleForm) =>
    toggleForm((prevState) => !prevState);

  const toggleDialog = (index) => {
    setOpenDialogs((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = !prevState[index];
      return updatedState;
    });
  };

  const deleteProduct = async (productID) => {
    const res = await deleteRequest({
      endpoint: `/products/${productID}`,
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        message: res.message,
      });

      fetchProducts();
    }
  };

  const handleDisplayEditForm = () => {
    setDisplayEditForm(!displayEditForm);
  };

  return (
    <>
      {displayLoader && <Loader />}
      <AddProductForm
        handleOpen={() => handleDisplayForm(setDisplayForm)}
        handeClose={() => setDisplayForm(false)}
        fetchProducts={fetchProducts}
        open={displayForm}
      />
      <EditProductForm
        productInfo={productInfo}
        open={displayEditForm}
        handleOpen={handleDisplayEditForm}
        fetchProducts={fetchProducts}
      />
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Products
            </Typography>
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={() => handleDisplayForm(setDisplayForm)}
            >
              <PlusIcon strokeWidth={2} className="h-5 w-5" />
              Add
            </Button>
          </div>
        </CardHeader>
        {products.length == 0 && (
          <CardBody>
            <Alert> No products have been added yet.</Alert>
          </CardBody>
        )}
        {products.length !== 0 && (
          <>
            <CardBody className="overflow-scroll px-0">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {[
                      "Images",
                      "Title",
                      "Category",
                      "Quantity",
                      "Points",
                      "Action",
                    ].map((head) => (
                      <th
                        key={uuid()}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const { _id, images, title, category, quantity, point } =
                      product;

                    return (
                      <tr key={_id}>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal cursor-pointer"
                            onClick={() => toggleDialog(index)}
                          >
                            View Image
                          </Typography>
                          {openDialogs[index] && (
                            <div
                              className="fixed flex items-center  flex-col z-10 justify-center inset-0 bg-[rgba(0,0,0,0.4)]"
                              onClick={() => toggleDialog(index)}
                            >
                              <h1 className="text-3xl font-medium text-white mb-12 uppercase bg-blue-500 p-4">
                                Images
                              </h1>
                              <div className=" flex gap-5 ">
                                {images.map((image, imageIndex) => (
                                  <img
                                    key={imageIndex}
                                    src={`http://localhost:8000/${image}`}
                                    alt={`Product ${index + 1}`}
                                    className="w-48 h-48  object-cover"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {title}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {category}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {quantity}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {point}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setProductInfo(product);
                              handleDisplayEditForm();
                            }}
                          >
                            <PencilSquareIcon
                              color="green"
                              className="h-6 w-6"
                            />
                          </IconButton>
                          <IconButton
                            variant="text"
                            onClick={() => deleteProduct(_id)}
                          >
                            <TrashIcon color="red" className="h-6 w-6" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </>
        )}
      </Card>
    </>
  );
};

export default Addproduct;
