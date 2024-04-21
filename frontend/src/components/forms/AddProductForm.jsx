import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  // Alert,
} from "@material-tailwind/react";
// import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import Loader from "../Loader";
import { postRequest } from "../../utils/apiHandler";

const AddProductForm = ({ open, handleOpen, handeClose, fetchProducts }) => {
  const defaultProductInfo = {
    title: "",
    category: "",
    quantity: "",
    point: "",
    description: "",
    images: "",
  };

  const [displayLoader, setDisplayLoader] = useState(false);
  const [productInfo, setProductInfo] = useState(defaultProductInfo);

  const handleImageChange = (event) => {
    const images = Array.from(event.target.files);

    setProductInfo({
      ...productInfo,
      images: images,
    });
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "images") {
      setProductInfo((prevState) => ({
        ...prevState,
        [name]: files[0], // Store the file object directly
      }));
    } else {
      setProductInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setDisplayLoader(true);

    try {
      const formData = new FormData();
      // Append all fields to FormData
      formData.append("title", productInfo.title);
      formData.append("category", productInfo.category);
      formData.append("quantity", productInfo.quantity);
      formData.append("point", productInfo.point);
      formData.append("description", productInfo.description);

      productInfo.images.forEach((image) => {
        formData.append('images', image);
      });
      
      // Send POST request with FormData
      const response = await postRequest({
        endpoint: "/products",
        data: formData,
      });

      if (response.ok) {
        handeClose();
        setDisplayLoader(false);
        setProductInfo(defaultProductInfo);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:");
    } finally {
      setDisplayLoader(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Add Product</DialogHeader>

      <DialogBody>
        {displayLoader && <Loader />}

        <form className="space-y-5" id="productForm" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="title"
            label="Title"
            value={productInfo.title}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="category"
            label="Category"
            value={productInfo.category}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="quantity"
            label="Quantity"
            value={productInfo.quantity}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="point"
            label="point"
            value={productInfo.point}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="description"
            label="Description"
            value={productInfo.description}
            onChange={handleChange}
            required
          />
          <Input
            type="file"
            name="images"
            label="images"
            onChange={handleImageChange}
            multiple
            required
          />
        </form>
      </DialogBody>

      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => {
            handleOpen();
            setSubmitMessage({
              display: false,
              isError: false,
              message: "",
            });
          }}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>

        <Button
          variant="gradient"
          color="green"
          type="submit"
          form="productForm"
        >
          <span>Add</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddProductForm;
