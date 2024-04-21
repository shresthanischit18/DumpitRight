/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
  } from '@material-tailwind/react';
  import { useEffect, useState } from 'react';
  import Loader from '../Loader';
  
  import { apiHandler } from '../../utils';
  import Swal from 'sweetalert2';
  
  const EditProductForm = ({ productInfo, open, handleOpen, fetchProducts }) => {
    const defaultProductInfo = {
      title: '',
      category: '',
      quantity: '',
      point: '',
      description: '',
    };
  
    const [displayLoader, setDisplayLoader] = useState(false);
    const [editedProductInfo, setEditedProductInfo] = useState(defaultProductInfo);
  
    const [submitMessage, setSubmitMessage] = useState({
      display: false,
      isError: false,
      message: '',
    });
  
    const {
      title,
      category,
      quantity,
      point,
      description,
    } = editedProductInfo;
  
    const handleChange = e => {
      const { name, value } = e.target;
      setEditedProductInfo(prevDetails => ({ ...prevDetails, [name]: value }));
    };
  
    useEffect(() => {
      if (productInfo) {
        setEditedProductInfo(productInfo);
      } else {
        setEditedProductInfo(defaultProductInfo);
      }
    }, [productInfo]);
  
    const handleSubmit = async e => {
      e.preventDefault();
  
      setDisplayLoader(true);
  
      let res = await apiHandler.patchRequest({
        endpoint: `/products/${productInfo._id}`,
        data: editedProductInfo,
      });
  
      setDisplayLoader(false);
  
      if (res.ok) {
        fetchProducts();
  
        setSubmitMessage({
          display: false,
          isError: false,
          message: '',
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
        });
  
        handleOpen();
  
        setEditedProductInfo(defaultProductInfo);
  
        return;
      }
  
      setSubmitMessage({
        display: true,
        isError: true,
        message: res.message,
      });
    };
  
    return (
        
      <>
        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>Edit Product Details</DialogHeader>
  
          <DialogBody>
            {displayLoader && <Loader />}
  
            <form className='space-y-5' id='productForm' onSubmit={handleSubmit}>
              <Input
                type='text'
                name='title'
                label='Title'
                value={title}
                onChange={handleChange}
                required
              />
  
              <Input
                type='text'
                name='category'
                label='Category'
                value={category}
                onChange={handleChange}
                required
              />
  
              <Input
                type='number'
                name='quantity'
                label='Quantity'
                value={quantity}
                onChange={handleChange}
                required
              />
  
              <Input
                type='number'
                name='point'
                label='Point'
                value={point}
                onChange={handleChange}
                required
              />
  
              <Input
                type='text'
                name='description'
                label='Description'
                value={description}
                onChange={handleChange}
                required
              />
            </form>
          </DialogBody>
  
          <DialogFooter>
            <Button
              variant='text'
              color='red'
              onClick={() => {
                handleOpen();
                setSubmitMessage({
                  display: false,
                  isError: false,
                  message: '',
                });
              }}
              className='mr-1'>
              <span>Cancel</span>
            </Button>
  
            <Button
              variant='gradient'
              color='green'
              type='submit'
              form='productForm'>
              <span>Edit</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  };
  
  export default EditProductForm;
  