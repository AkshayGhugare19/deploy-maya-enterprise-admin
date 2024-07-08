import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Button,
  Dropdown,
  Icon,
  Select,
  Input,
  Modal,
  Sidebar,
} from 'semantic-ui-react';
import { apiGET, apiPOST } from '../utils/apiHelper';
import useDebounce from '../utils/useDebounce';
import TableWrapper from '../utils/tableWrapper';
import moment from 'moment';
import Swal from 'sweetalert2';
import { RxCross1 } from 'react-icons/rx';
import { FaPlus } from 'react-icons/fa';
import './coupons.css';
import { SlOptionsVertical } from 'react-icons/sl';

const Coupons = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [TotalRows, setTotalRows] = useState();
  const [allCoupons, setAllCoupons] = useState([]);
  const [search, setSearch] = useState('');
  const [couponType, setCouponType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [viewCouponData, setViewCouponData] = useState(null);
  const [isViewCouponOpen, setIsViewCouponOpen] = useState(false);
  const [totalPage, setTotalPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNextPage = (pageno) => {
    if (pageno <= totalPage) {
      setTimeout(() => {
        setPage(pageno);
      }, 100);
    }
  };

  const handlePrevPage = (pageno) => {
    if (pageno >= 1) {
      setTimeout(() => {
        setPage(pageno);
      }, 100);
    }
  };



  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 767);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const applyToType = [
    { key: 1, text: 'All Product', value: 'all_products' },
    { key: 2, text: 'Specific Products', value: 'specific_products' },
    { key: 3, text: 'Specific Brand', value: 'specific_brand' },
    { key: 4, text: 'Minimum Order Subtotal', value: 'minimum_order_subtotal' },
    { key: 5, text: 'Minimum Order Subtotal_Shipping', value: 'minimum_order_subtotal_shipping' },
  ];

  const applyToTypeAuto = [
    { key: 2, text: 'Specific Products', value: 'specific_products' },
  ];

  const [selectedCouponType, setSelectedCouponType] = useState('price');
  const [editCouponData, setEditCouponData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [newCouponData, setNewCouponData] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [isRequirement, setIsRequirement] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const couponOptions = [
    { key: 1, text: 'All Coupons', value: '' },
    { key: 2, text: 'Discount By Price (£)', value: 'price' },
    { key: 3, text: 'Discount By Percentage (%)', value: 'percentage' },
    { key: 3, text: 'Automatic Discount (£)', value: 'automatic_discount' },
  ];

  const getProducts = async () => {
    try {
      let response = await apiGET('/v1/products/get-all-Products-admin/');
      if (response?.data?.code == 200) {
        let prods = response?.data?.data || [];
        let pData = [];
        for (let i = 0; i < prods?.length; i++) {
          pData.push({
            key: prods[i]?.id,
            text: `${prods[i]?.name} £${prods[i]?.price}`,
            value: prods[i]?.id,
          });
        }
        setProductsList(pData);
      }
    } catch (error) {
      Toast.error(error?.message);
    }
  };

  const getBrands = async () => {
    try {
      let response = await apiGET('/v1/category/get-category');
      if (response?.data?.code == 200) {
        let brds = response?.data?.data || [];
        let bData = [];
        for (let i = 0; i < brds?.length; i++) {
          bData.push({
            key: brds[i]?._id,
            text: brds[i]?.name,
            value: brds[i]?._id,
          });
        }
        setBrandsList(bData);
      }
    } catch (error) {
      Toast.error(error?.message);
    }
  };

  const handleCouponChange = (cType) => {
    setSelectedCouponType(cType);
    setNewCouponData({});
    if (cType === 'automatic_discount') {
      setNewCouponData({
        apply_to: 'specific_products',
        max_uses: null,
        min_qty: null,
        is_expiry_date: true
      });
    } else {
      setNewCouponData({
        apply_to: '',
        max_uses: null,
        min_qty: null,
        is_expiry_date: true
      });
    }
  };
  const createCoupon = async () => {
    setCreateLoading(true);
    try {
      let payload = {
        type: selectedCouponType,
        code: newCouponData?.code || '',
        name: newCouponData?.name || '',
        apply_to:
          selectedCouponType == 'free_shipping'
            ? 'all_products'
            : newCouponData?.apply_to || '',
        discount_price: newCouponData?.discount_price || null,
        discount_percentage: newCouponData?.discount_percentage || null,
        sale_price: newCouponData?.sale_price || null,
        specific_products: newCouponData?.specific_products || [],
        specific_products_automatic:
          newCouponData?.specific_products_automatic || [],
        specific_brand: newCouponData?.specific_brand || '',
        minimum_order_subtotal: newCouponData?.minimum_order_subtotal || null,
        minimum_order_subtotal_shipping: newCouponData?.minimum_order_subtotal_shipping || null,
        start_date: newCouponData?.start_date || null,
        is_expiry_date: newCouponData?.is_expiry_date || false,
        expiry_date: newCouponData?.expiry_date || null,
        max_uses: newCouponData?.max_uses || null,
        min_qty: newCouponData?.min_qty || null,
        one_use_per_customer: false,
      };

      if (payload?.code === '' && payload?.type !== 'automatic_discount') {
        Toast.fire({
          text: 'Coupon code field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (payload?.name === '') {
        Toast.fire({
          text: 'Coupon name field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (payload?.apply_to === '' && payload?.type !== 'free_shipping') {
        Toast.fire({
          text: 'Apply to field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (
        payload?.apply_to == 'specific_products' &&
        ((payload?.type == 'automatic_discount' &&
          payload?.specific_products_automatic?.length <= 0) ||
          (payload?.type !== 'automatic_discount' &&
            payload?.specific_products?.length <= 0))
      ) {
        Toast.fire({
          text: 'You have to choose at least one product to create a coupon.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (
        payload?.apply_to == 'specific_brand' &&
        payload?.specific_brand == ''
      ) {
        Toast.fire({
          text: 'You have to choose a brand to create a coupon.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (payload?.apply_to == "minimum_order_subtotal" &&
        payload.minimum_order_subtotal == null) {
        Toast.fire({
          text: 'Mimimum subtotal cannot be less than or equal to 0',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (payload?.apply_to == "minimum_order_subtotal_shipping" &&
      payload.minimum_order_subtotal_shipping == null) {
      Toast.fire({
        text: 'Mimimum subtotal shipping cannot be less than or equal to 0',
        icon: 'error',
      });
      setCreateLoading(false);
      return;
    }
      if (
        payload?.type == 'automatic_discount' &&
        payload?.sale_price == null
      ) {
        Toast.fire({
          text: 'Sale Price field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (
        (payload?.type == 'price' && payload?.discount_price == null) ||
        (payload?.type == 'percentage' && payload?.discount_percentage == null)
      ) {
        Toast.fire({
          text: 'Discount field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (payload?.start_date == null) {
        Toast.fire({
          text: 'Start date field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      if (payload?.is_expiry_date === true && payload?.expiry_date == null) {
        Toast.fire({
          text: 'Expiry date field is required.',
          icon: 'error',
        });
        setCreateLoading(false);
        return;
      }
      // if (payload?.type ==="automatic_discount" && payload?.min_qty == null
      // ) {
      //     Toast.fire({
      //         title: " field is required.",
      //         icon: "error"
      //     })
      //     setCreateLoading(false)
      //     return
      // }

      const response = await apiPOST('/v1/coupon/add-coupon', payload);

      if (response?.data?.code == 200) {
        setCreateLoading(false);
        setEditModal(false);
        setIsRequirement(false);
        setSelectedCouponType('price');
        setNewCouponData({});
        getAllCoupons();
        Toast.fire({
          text: 'Coupon Created Successfully',
          icon: 'success',
        });
      } else {
        Toast.fire({
          text: response?.data?.data || 'Something went wrong',
          icon: 'error',
        });
        setCreateLoading(false);
      }
    } catch (error) {
      setCreateLoading(false);
      console.log('Error in coupon create ->', error);
    }
  };

  const confirmDelet = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCouponByid(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Coupon Deleted Successfully.',
          icon: 'success',
        });
      }
    });
  };

  const deleteCouponByid = async (id) => {
    try {
      const response = await apiPOST(`/v1/coupon/delete-coupons/${id}`);

      if (response?.data?.code === 200) {
        // Swal.fire({
        //     title: 'Success!',
        //     text: 'Coupon Deleted Successfully!',
        //     icon: 'success',
        // });
        getAllCoupons();
      }
    } catch (error) {
      console.error('Error fetching coupon by id:', error);
    }
  };

  const getCouponByid = async (id) => {
    try {
      const response = await apiGET(`/v1/coupon/get-couponBy-id/${id}`);

      if (response?.data?.code === 200) {
        setIsViewCouponOpen(true);
        setViewCouponData(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching coupon by id:', error);
    }
  };

  const getAllCoupons = async () => {
    try {
      let url = `/v1/coupon/get-all-coupons?page=${page}&limit=${limit}`;
      let filter = {};

      if (search !== '') filter['search'] = search;
      if (couponType !== '') filter['type'] = couponType;

      // Correct way to check if the filter object has any keys
      if (Object.keys(filter).length > 0) {
        url += `&filter[query]={search:${search},type:${couponType}}`;
      }

      const response = await apiGET(url);

      if (response?.data?.code == 200) {
        setAllCoupons(response?.data?.data?.data);
        setTotalRows(response?.data?.data?.totalResults);
        setTotalPage(response?.data?.data?.totalPages);
      }
    } catch (error) {
      console.log('Error in Coupons Fetch.');
    }
  };

  const handleChangeLimit = (event) => {
    setLimit(event.target.value); // Update the selected value when the selection changes
    setPage(1)
  };

  const columns = [
    {
      name: 'Coupon Name',
      selector: (row) => row?.name,
      width: '18%',
    },
    {
      name: 'Coupon Code',
      selector: (row) => (row?.code ? row?.code : '--'),
      width: '12%',
    },
    {
      name: 'Type',
      selector: (row) => (
        <div style={{ textTransform: 'capitalize' }}>{row?.type}</div>
      ),
      width: '15%',
    },
    {
      name: 'Start Date',
      selector: (row) =>
        row?.start_date ? moment(row?.start_date).format('LL') : '--',

      width: '12%',
    },
    {
      name: 'Expire Date',
      selector: (row) =>
        row?.expiry_date ? moment(row?.expiry_date).format('LL') : '--',
      width: '12%',
    },
    {
      name: 'Applied To ',
      selector: (row) => row?.apply_to,
      width: '18%',
    },
    {
      name: 'Action',
      selector: (row) => (
        <>
          <div>
            <button
              onClick={() => getCouponByid(row?._id)}
              className="ui blue icon button basic">
              <i class="eye icon"></i>
            </button>
            <button
              onClick={() => confirmDelet(row?._id)}
              className="ui red icon button basic">
              <i class="trash alternate icon"></i>
            </button>
          </div>
        </>
      ),
      width: '15%',
      textAlign: 'center',
    },
  ];
  const handleCouponType = (e, d) => {
    setCouponType(d?.value);
  };

  useDebounce(getAllCoupons, 2000, [search]);
  useEffect(() => {
    getAllCoupons();
  }, [page, limit, couponType]);

  useEffect(() => {
    getProducts();
    getBrands();
  }, []);

  useEffect(() => {
    if (!editModal) {
      setNewCouponData({
        is_expiry_date: true,
      });
    }
  }, [editModal])
  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher style={{ backgroundColor: '#F4F4F4' }} className="fadeIn">
        <Modal
          open={editModal}
          onClose={() => setEditModal(false)}
          onOpen={() => setEditModal(true)}>
          <div
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '16px',
              width: '100%',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
              }}>
              <div
                style={{
                  color: '#202020',
                  fontSize: '24px',
                  gap: '10px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <span>New Coupon</span>
              </div>
              <RxCross1
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 600,
                  strokeWidth: 2,
                }}
                onClick={() => {
                  setEditModal(false);
                  setIsRequirement(false);
                  setSelectedCouponType('price');
                }}
              />
            </div>

            <div
              style={{
                marginTop: '18px',
              }}>
              <label
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                }}>
                Select the type of coupon you want to offer
              </label>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: '8px',
                }}>
                <div
                  onClick={() => {
                    handleCouponChange('price');
                  }}
                  style={{
                    backgroundColor:
                      selectedCouponType === 'price' ? '#0496FF' : '#F4F4F4',
                    borderRadius: '8px',
                    color: selectedCouponType === 'price' ? '#fff' : '#000',
                    height: '128px',
                    width: '128px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '8px',
                  }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100%',
                      backgroundColor:
                        selectedCouponType === 'price' ? '#fff' : '#D9D9D9',
                      display: 'flex',
                      color: '#000',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    £
                  </div>
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginTop: '8px',
                      textAlign: 'center',
                    }}>
                    Price
                  </label>
                </div>
                <div
                  onClick={() => {
                    handleCouponChange('percentage');
                  }}
                  style={{
                    backgroundColor:
                      selectedCouponType === 'percentage'
                        ? '#0496FF'
                        : '#F4F4F4',
                    borderRadius: '8px',
                    color:
                      selectedCouponType === 'percentage' ? '#fff' : '#000',
                    height: '128px',
                    width: '128px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '8px',
                  }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100%',
                      backgroundColor:
                        selectedCouponType === 'percentage'
                          ? '#fff'
                          : '#D9D9D9',
                      display: 'flex',
                      color: '#000',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    %
                  </div>
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginTop: '8px',
                      textAlign: 'center',
                    }}>
                    Percentage
                  </label>
                </div>
                <div
                  onClick={() => {
                    handleCouponChange('automatic_discount');
                  }}
                  style={{
                    backgroundColor:
                      selectedCouponType === 'automatic_discount'
                        ? '#0496FF'
                        : '#F4F4F4',
                    borderRadius: '8px',
                    color:
                      selectedCouponType === 'automatic_discount'
                        ? '#fff'
                        : '#000',
                    height: '128px',
                    width: '128px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '8px',
                  }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100%',
                      backgroundColor:
                        selectedCouponType === 'automatic_discount'
                          ? '#fff'
                          : '#D9D9D9',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon className="autoprefixer" style={{ color: '#000' }} />
                  </div>
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginTop: '8px',
                      textAlign: 'center',
                    }}>
                    Automatic Discount
                  </label>
                </div>
                <div
                  onClick={() => {
                    handleCouponChange('free_shipping');
                  }}
                  style={{
                    backgroundColor:
                      selectedCouponType === 'free_shipping'
                        ? '#0496FF'
                        : '#F4F4F4',
                    borderRadius: '8px',
                    color:
                      selectedCouponType === 'free_shipping' ? '#fff' : '#000',
                    height: '128px',
                    width: '128px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '8px',
                  }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100%',
                      backgroundColor:
                        selectedCouponType === 'free_shipping'
                          ? '#fff'
                          : '#D9D9D9',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon className="shipping fast" style={{ color: '#000' }} />
                  </div>
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginTop: '8px',
                      textAlign: 'center',
                    }}>
                    Free Shipping
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                margin: '10px 0',
                padding: '10px 0',
              }}>
              <div className="coupon-grid">
                {selectedCouponType !== 'automatic_discount' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Coupon code
                    </label>
                    <input
                      onChange={(e) => {
                        setNewCouponData({
                          ...newCouponData,
                          code: e.target?.value || '',
                        });
                      }}
                      placeholder="Example. FLAT20"
                      value={newCouponData?.code || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        border: '1px solid #D4D4D4',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                <div>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}>
                    Coupon name
                  </label>
                  <input
                    onChange={(e) => {
                      setNewCouponData({
                        ...newCouponData,
                        name: e.target?.value || '',
                      });
                    }}
                    placeholder="Example. FLAT20"
                    value={newCouponData?.name || ''}
                    style={{
                      height: '36px',
                      opacity: '100%',
                      border: '1px solid #D4D4D4',
                      width: '100%',
                      borderRadius: '8px',
                      padding: '0 10px',
                      marginTop: '4px',
                    }}
                  />
                </div>
                {selectedCouponType !== 'free_shipping' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Apply to
                    </label>
                    {selectedCouponType === 'automatic_discount' ? (
                      <input
                        disabled={true}
                        placeholder=""
                        value={newCouponData?.apply_to || ''}
                        style={{
                          height: '36px',
                          opacity: '100%',
                          border: '1px solid #D4D4D4',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                          marginTop: '4px',
                        }}
                      />
                    ) : (
                      <Dropdown
                        value={newCouponData?.apply_to}
                        style={{
                          minHeight: '34px',
                          opacity: '100%',
                          border: '1px solid #D4D4D4',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '',
                          marginTop: '4px',
                        }}
                        placeholder="Apply to"
                        fluid
                        selection
                        onChange={(e, d) => {
                          setNewCouponData({
                            ...newCouponData,
                            specific_products: [],
                            specific_products_automatic: [],
                            specific_brand: '',
                            minimum_order_subtotal: null,
                            apply_to: d?.value,
                          });
                        }}
                        options={applyToType}
                      />
                    )}
                  </div>
                ) : (
                  ''
                )}

                {newCouponData?.apply_to === 'minimum_order_subtotal' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Minimum subtotal
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '4px',
                      }}>
                      <input
                        onChange={(e) => {
                          if (e.target?.value <= 0) {
                            Toast.fire({
                              text: 'Mimimum subtotal cannot be less than or equal to 0',
                              icon: 'error',
                            });
                          }
                          setNewCouponData({
                            ...newCouponData,
                            minimum_order_subtotal:
                              e.target?.value > 0
                                ? Number(e.target?.value)
                                : null,
                          });
                        }}
                        placeholder="Example. 10"
                        type="number"
                        value={
                          newCouponData?.minimum_order_subtotal ||
                          null
                        }
                        style={{
                          height: '36px',
                          opacity: '100%',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                          border: '1px solid #D4D4D4',
                        }}
                      />
                      {selectedCouponType === 'price' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '36px',
                            top: '12px',
                          }}>
                          £
                        </span>
                      ) : selectedCouponType === 'percentage' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '36px',
                            top: '12px',
                          }}>
                          %
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )
                  :
                  ""
                }
                 {newCouponData?.apply_to === 'minimum_order_subtotal_shipping' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Minimum subtotal
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '4px',
                      }}>
                      <input
                        onChange={(e) => {
                          if (e.target?.value <= 0) {
                            Toast.fire({
                              text: 'Mimimum subtotal shipping cannot be less than or equal to 0',
                              icon: 'error',
                            });
                          }
                          setNewCouponData({
                            ...newCouponData,
                            minimum_order_subtotal_shipping:
                              e.target?.value > 0
                                ? Number(e.target?.value)
                                : null,
                          });
                        }}
                        placeholder="Example. 10"
                        type="number"
                        value={
                          newCouponData?.minimum_order_subtotal_shipping ||
                          null
                        }
                        style={{
                          height: '36px',
                          opacity: '100%',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                          border: '1px solid #D4D4D4',
                        }}
                      />
                      {selectedCouponType === 'price' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '36px',
                            top: '12px',
                          }}>
                          £
                        </span>
                      ) : selectedCouponType === 'percentage' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '36px',
                            top: '12px',
                          }}>
                          %
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )
                  :
                  ""
                }
                {newCouponData?.apply_to === 'specific_products' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Choose product
                    </label>
                    <Dropdown
                      style={{
                        minHeight: '34px',
                        opacity: '100%',
                        border: '1px solid #D4D4D4',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '',
                        marginTop: '4px',
                      }}
                      placeholder="Product"
                      fluid
                      multiple={
                        selectedCouponType === 'automatic_discount'
                          ? true
                          : false
                      }
                      search
                      selection
                      onChange={(e, d) => {
                        if (selectedCouponType === 'automatic_discount') {
                          setNewCouponData((prevData) => ({
                            ...prevData,
                            specific_products_automatic: [...d?.value],
                          }));
                        } else {
                          setNewCouponData({
                            ...newCouponData,
                            specific_products: [d?.value],
                          });
                        }
                      }}
                      options={productsList}
                    />
                  </div>
                ) : (
                  ''
                )}

                {newCouponData?.apply_to === 'specific_brand' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Choose brand
                    </label>
                    <Dropdown
                      style={{
                        minHeight: '34px',
                        opacity: '100%',
                        border: '1px solid #D4D4D4',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '',
                        marginTop: '4px',
                      }}
                      placeholder="Brand"
                      fluid
                      search
                      selection
                      onChange={(e, d) => {
                        setNewCouponData({
                          ...newCouponData,
                          specific_brand: d?.value,
                        });
                      }}
                      options={brandsList}
                    />
                  </div>
                ) : (
                  ''
                )}

                {selectedCouponType !== 'free_shipping' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      {selectedCouponType === 'automatic_discount'
                        ? 'Sale price'
                        : 'Discount'}
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '4px',
                      }}>
                      <input
                        onChange={(e) => {
                          if (e.target?.value <= 0) {
                            Toast.fire({
                              text: 'Discount value cannot be less than or equal to 0',
                              icon: 'error',
                            });
                          }
                          if (selectedCouponType === 'price') {
                            setNewCouponData({
                              ...newCouponData,
                              discount_price:
                                e.target?.value > 0
                                  ? Number(e.target?.value)
                                  : null,
                            });
                          } else if (selectedCouponType === 'percentage') {
                            setNewCouponData({
                              ...newCouponData,
                              discount_percentage:
                                e.target?.value > 0
                                  ? Number(e.target?.value)
                                  : null,
                            });
                          } else if (
                            selectedCouponType === 'automatic_discount'
                          ) {
                            setNewCouponData({
                              ...newCouponData,
                              sale_price:
                                e.target?.value > 0
                                  ? Number(e.target?.value)
                                  : null,
                            });
                          }
                        }}
                        placeholder="Example. 10"
                        type="number"
                        value={
                          newCouponData?.discount_price ||
                          newCouponData?.discount_percentage ||
                          newCouponData?.sale_price ||
                          null
                        }
                        style={{
                          height: '36px',
                          opacity: '100%',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                          border: '1px solid #D4D4D4',
                        }}
                      />
                      {selectedCouponType === 'price' ||
                        selectedCouponType === 'automatic_discount' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '36px',
                            top: '12px',
                          }}>
                          £
                        </span>
                      ) : selectedCouponType === 'percentage' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '36px',
                            top: '12px',
                          }}>
                          %
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>

              <div className="coupon-grid" style={{ marginTop: '20px' }}>
                <div>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}>
                    Valid between
                  </label>
                  <input
                    onChange={(e) => {
                      setNewCouponData({
                        ...newCouponData,
                        start_date: e.target?.value || null,
                      });
                    }}
                    placeholder="Example. 01-02-2024"
                    type="date"
                    value={newCouponData?.start_date || ''}
                    style={{
                      height: '36px',
                      opacity: '100%',
                      border: '1px solid #D4D4D4',
                      width: '100%',
                      borderRadius: '8px',
                      padding: '0 10px',
                      marginTop: '4px',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      height: '17px',
                    }}>
                    &nbsp;
                  </label>
                  <input
                    onChange={(e) => {
                      setNewCouponData({
                        ...newCouponData,
                        expiry_date: e.target?.value,
                      });
                    }}
                    disabled={!newCouponData?.is_expiry_date}
                    placeholder="Example. 01-02-2024"
                    type="date"
                    value={newCouponData?.expiry_date || ''}
                    style={{
                      height: '36px',
                      opacity: '100%',
                      border: '1px solid #D4D4D4',
                      width: '100%',
                      borderRadius: '8px',
                      padding: '0 10px',
                      marginTop: '4px',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      marginTop: '4px',
                    }}>
                    <input
                      onChange={(e) => {
                        setNewCouponData({
                          ...newCouponData,
                          expiry_date: null,
                          is_expiry_date: !e.target?.checked,
                        });
                      }}
                      type="checkbox"
                      checked={newCouponData?.is_expiry_date ? false : true}
                      style={{
                        accentColor: '#0496FF',
                        border: '1px solid #D4D4D4',
                        height: '20px',
                        opacity: '100%',
                        width: '20px',
                        borderRadius: '8px',
                      }}
                    />
                    <label
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}>
                      Don't Show end date
                    </label>
                  </div>
                </div>
              </div>

              <div className="coupon-grid" style={{ marginTop: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    minHeight: '58px',
                    alignItems: 'center',
                    marginTop: '4px',
                  }}>
                  <input
                    onChange={(e) => {
                      setIsRequirement(e.target?.checked);
                      setNewCouponData({
                        ...newCouponData,
                        min_qty: null,
                        max_uses: null,
                      });
                    }}
                    type="checkbox"
                    value={isRequirement || false}
                    style={{
                      accentColor: '#0496FF',
                      border: '1px solid #D4D4D4',
                      height: '20px',
                      opacity: '100%',
                      width: '20px',
                      borderRadius: '8px',
                    }}
                  />
                  <label
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                    }}>
                    Are there any requirements?
                  </label>
                </div>
                {isRequirement ? (
                  <>
                    {selectedCouponType === 'automatic_discount' ? (
                      <div>
                        <label
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                          }}>
                          Minimum quantity of items to buy
                        </label>
                        <input
                          onChange={(e) => {
                            if (e.target?.value <= 0) {
                              Toast.fire({
                                text: 'Minimum Quantity value cannot be less than or equal to 0',
                                icon: 'error',
                              });
                            }
                            setNewCouponData({
                              ...newCouponData,
                              min_qty: e.target?.value
                                ? Number(e.target?.value)
                                : null,
                            });
                          }}
                          placeholder="Example. 10"
                          type="number"
                          value={newCouponData?.min_qty || null}
                          style={{
                            height: '36px',
                            opacity: '100%',
                            border: '1px solid #D4D4D4',
                            width: '100%',
                            borderRadius: '8px',
                            padding: '0 10px',
                            marginTop: '4px',
                          }}
                        />
                      </div>
                    ) : selectedCouponType !== 'automatic_discount' ? (
                      <div>
                        <label
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                          }}>
                          Limit the total number of uses for this coupon
                        </label>
                        <input
                          onChange={(e) => {
                            if (e.target?.value <= 0) {
                              Toast.fire({
                                text: 'Maximum uses value cannot be less than or equal to 0',
                                icon: 'error',
                              });
                            }
                            setNewCouponData({
                              ...newCouponData,
                              max_uses: e.target?.value
                                ? Number(e.target?.value)
                                : null,
                            });
                          }}
                          placeholder="Example. 10"
                          type="number"
                          value={newCouponData?.max_uses || null}
                          style={{
                            height: '36px',
                            opacity: '100%',
                            border: '1px solid #D4D4D4',
                            width: '100%',
                            borderRadius: '8px',
                            padding: '0 10px',
                            marginTop: '4px',
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                paddingTop: '10px',
                alignItems: 'center',
              }}>
              <Button
                className="btn-class"
                onClick={createCoupon}
                loading={createLoading}
                style={{
                  backgroundColor: '#0496FF',
                  color: '#fff',
                  borderRadius: '16px',
                }}>
                <FaPlus />
                Create Coupon
              </Button>
              <Button
                className="btn-class"
                onClick={() => {
                  setEditModal(false);
                  setIsRequirement(false);
                  setSelectedCouponType('price');
                }}
                style={{
                  backgroundColor: '#747474',
                  color: 'white',
                  borderRadius: '16px',
                }}>
                <i className="close icon" style={{ color: 'white' }} />
                Close
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={isViewCouponOpen}
          onClose={() => setIsViewCouponOpen(false)}
          onOpen={() => setIsViewCouponOpen(true)}>
          <div
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '16px',
              width: '100%',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
              }}>
              <div
                style={{
                  color: '#202020',
                  fontSize: '24px',
                  gap: '10px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <span>Coupon Details</span>
                <span
                  style={{
                    fontSize: '16px',
                  }}>
                  Type :{' '}
                  <span style={{ textTransform: 'capitalize' }}>
                    {viewCouponData?.coupon?.type}
                  </span>
                </span>
              </div>
              <RxCross1
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 600,
                  strokeWidth: 2,
                }}
                onClick={() => {
                  setIsViewCouponOpen(false);
                }}
              />
            </div>

            <div
              style={{
                margin: '10px 0',
                padding: '10px 0',
              }}>
              <div className="coupon-grid">
                {viewCouponData?.coupon?.code ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Coupon code
                    </label>
                    <input
                      disabled={true}
                      value={viewCouponData?.coupon?.code || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.name ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Coupon name
                    </label>
                    <input
                      disabled={true}
                      value={viewCouponData?.coupon?.name || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.apply_to ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Apply to
                    </label>
                    <input
                      disabled={true}
                      value={viewCouponData?.coupon?.apply_to || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.apply_to == "minimum_order_subtotal" &&
                  viewCouponData?.coupon?.minimum_order_subtotal ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Minimum subtotal
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '4px',
                      }}>
                      <input
                        disabled={true}
                        value={
                          viewCouponData?.coupon?.minimum_order_subtotal || null
                        }
                        style={{
                          height: '36px',
                          opacity: '100%',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '12px',
                        }}>
                        £
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                 {viewCouponData?.coupon?.apply_to == "minimum_order_subtotal_shipping" &&
                  viewCouponData?.coupon?.minimum_order_subtotal_shipping ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',                      }}>
                      Minimum subtotal
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '4px',
                      }}>
                      <input
                        disabled={true}
                        value={
                          viewCouponData?.coupon?.minimum_order_subtotal_shipping || null
                        }
                        style={{
                          height: '36px',
                          opacity: '100%',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '12px',
                        }}>
                        £
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.discount_price ||
                  viewCouponData?.coupon?.discount_percentage ||
                  viewCouponData?.coupon?.sale_price ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Discount
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '4px',
                      }}>
                      <input
                        disabled={true}
                        value={
                          viewCouponData?.coupon?.discount_price ||
                          viewCouponData?.coupon?.discount_percentage ||
                          viewCouponData?.coupon?.sale_price ||
                          ''
                        }
                        style={{
                          height: '36px',
                          opacity: '100%',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '0 10px',
                        }}
                      />
                      {viewCouponData?.coupon?.type === 'price' ||
                        viewCouponData?.coupon?.type === 'automatic_discount' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '12px',
                          }}>
                          £
                        </span>
                      ) : viewCouponData?.coupon?.type === 'percentage' ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '12px',
                          }}>
                          %
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.specific_brand ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Brand
                    </label>
                    <input
                      disabled={true}
                      value={viewCouponData?.coupon?.specific_brand || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.apply_to == 'specific_products' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Product details
                    </label>
                    {viewCouponData?.productDetail?.length > 0 ? (
                      <div
                        style={{
                          backgroundColor: '#fafafa',
                          border: '2px solid #b9b9b9',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          marginTop: '4px',
                        }}>
                        {viewCouponData?.productDetail.map((item, i) => (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'start',
                              gap: '12px',
                              alignItems: 'center',
                              marginBottom: '8px',
                            }}>
                            <img src={item?.productImageUrl} width={40} />
                            <div style={{ fontSize: '14px' }}>
                              <div>{item?.name}</div>
                              <div style={{ marginTop: '4px' }}>
                                £{item?.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  ''
                )}
                <div>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}>
                    Valid between
                  </label>
                  <div
                    style={{
                      minHeight: '36px',
                      backgroundColor: '#fafafa',
                      border: '2px solid #b9b9b9',
                      width: '100%',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      marginTop: '4px',
                      fontSize: '14px',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                    {viewCouponData?.coupon?.start_date ? (
                      <span>
                        {moment(viewCouponData?.coupon?.start_date).format(
                          'llll'
                        )}
                      </span>
                    ) : (
                      ''
                    )}
                    {viewCouponData?.coupon?.expiry_date ? (
                      <span>
                        -{' '}
                        {moment(viewCouponData?.coupon?.expiry_date).format(
                          'llll'
                        )}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                {viewCouponData?.coupon?.max_uses ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Limit uses
                    </label>
                    <input
                      disabled={true}
                      value={viewCouponData?.coupon?.max_uses || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {viewCouponData?.coupon?.min_qty ? (
                  <div>
                    <label
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                      }}>
                      Minimum quantity to buy
                    </label>
                    <input
                      disabled={true}
                      value={viewCouponData?.coupon?.min_qty || ''}
                      style={{
                        height: '36px',
                        opacity: '100%',
                        width: '100%',
                        borderRadius: '8px',
                        padding: '0 10px',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                <div>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}>
                    Used count
                  </label>
                  <input
                    disabled={true}
                    value={viewCouponData?.coupon?.used_count}
                    style={{
                      height: '36px',
                      opacity: '100%',
                      width: '100%',
                      borderRadius: '8px',
                      padding: '0 10px',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                paddingTop: '10px',
                alignItems: 'center',
              }}>
              <Button
                className="btn-class"
                onClick={() => {
                  setIsViewCouponOpen(false);
                }}
                style={{
                  backgroundColor: '#747474',
                  color: 'white',
                }}>
                <i className="close icon" style={{ color: 'white' }} />
                Close
              </Button>
            </div>
          </div>
        </Modal>
        <div className="page-header">
          <div style={{ width: '100%' }}>
            <Breadcrumb
              size={'small'}
              style={{ fontSize: '14px', fontWeight: 600 }}>
              <BreadcrumbSection
                as={Link}
                to="/dashboard"
                style={{ color: '#0496FF' }}>
                Dashboard
              </BreadcrumbSection>
              <BreadcrumbDivider icon="right chevron" />
              <BreadcrumbSection active>Coupons</BreadcrumbSection>
            </Breadcrumb>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div
                    className=""
                    style={{ fontSize: '14px', marginTop: '10px' }}>
                    <span
                      style={{
                        fontSize: '28px',
                        fontWeight: 600,
                        color: '#000',
                        opacity: 90,
                      }}>
                      {TotalRows}
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        color: '#000',
                        opacity: 90,
                        marginLeft: '6px',
                        fontWeight: '600',
                      }}>
                      Coupons
                    </span>
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    List of all Coupons in application
                  </div>
                </div>
                <div
                  className="page-header searchdropBox"
                  style={{ flexWrap: 'wrap', border: 'none', gap: '10px' }}>
                  <Input
                    icon="search"
                    className="searchInput widthInputdropBox"
                    placeholder="Search names"
                    value={search || ''}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    style={{
                      height: '36px',
                    }}
                  />
                  <Dropdown
                    className="widthSearchdropBox"
                    placeholder="Coupons"
                    search
                    selection
                    options={couponOptions}
                    onChange={(e, d) => handleCouponType(e, d)}
                    style={{
                      border: '1px solid #D4D4D4',
                      width: '250px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      height: '36px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
              </div>
              <Button
                className="btn-class"
                onClick={() => {
                  setEditModal(true);
                }}
                style={{
                  backgroundColor: '#0496FF',
                  color: '#fff',
                }}>
                <FaPlus />
                Create Coupon
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {isDesktop ? (
          <div className="desktop-screen">
            <div style={{ padding: '0px 24px' }}>
              <TableWrapper
                columns={columns}
                data={allCoupons}
                progressPending={loading}
                paginationServer
                paginationTotalRows={TotalRows}
                onChangeRowsPerPage={(newLimit, newPage) => {
                  setLimit(newLimit);
                  setPage(newPage);
                }}
                paginationRowsPerPageOptions={[10, 20, 50, 100, TotalRows]}
                paginationPerPage={limit}
                onChangePage={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        ) : (
          <div className="mobile-screen">
            <div className="mobile-coupon">
              {!loading ? (
                <div>
                  {allCoupons.map((item) => (
                    <div key={item.id} className="coupun-container">
                      <div className="coupon-info">
                        <div style={{ gap: '5px' }} >
                          <div className='info' style={{ opacity: '70%' }}>Coupon Name</div>
                          <div className='info' style={{ opacity: '70%' }}>Coupon Code</div>
                          <div className='info' style={{ opacity: '70%' }}>Type</div>
                          <div className='info' style={{ opacity: '70%' }}>Start Date</div>
                          <div className='info' style={{ opacity: '70%' }}>Expire Date</div>
                          <div className='info' style={{ opacity: '70%' }}>Apllied To</div>
                          {/* <div style={{fontSize:'14px',fontWeight:'600'}}>{item?.name}</div>
                          <div style={{opacity:'70%',marginTop:'5px'}}>{item?.type}</div>
                          <div style={{opacity:'70%',marginTop:'5px'}}>{item?.apply_to}</div> */}
                        </div>
                      </div>
                      <div className="coupon-detail">
                        <div className='info'>{item?.name}</div>
                        <div className='info'>{item?.code ? item?.code : '--'}</div>
                        <div className='info'>{item?.type}</div>
                        <div className='info'>{item?.start_date ? moment(item?.start_date).format('LL') : '--'}</div>
                        <div className='info'>{item?.expiry_date ? moment(item?.expiry_date).format('LL') : '--'}</div>
                        <div className='info'>{item?.apply_to}</div>


                      </div>

                      <div className="couponAction-mobile">
                        <button
                          type="submit" onClick={() => {
                            openModal();
                            setCurrentCoupon(item);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                          }}>
                          <SlOptionsVertical />
                        </button>
                      </div>
                      <Modal
                        open={isModalOpen}
                        onClose={closeModal}
                        size="tiny"
                        closeOnDimmerClick={true}
                        dimmer={{ style: { background: 'rgba(0, 0, 0, 0.1)' } }}
                        style={{
                          boxShadow: 'none',
                          width: '300px',
                          border: '1px solid grey',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <div className="modal-btns">
                          <Button
                            className="ui red icon button basic"

                            style={{ marginRight: '6px' }}
                            onClick={() => {

                              confirmDelet(currentCoupon?._id)
                              closeModal();
                            }}>
                            Delete <i className="trash alternate icon"></i>
                          </Button>
                          <Button
                            className="ui blue icon button basic"
                            onClick={() => {
                              getCouponByid(currentCoupon?._id)
                              closeModal();
                            }}>
                            Preview <i class="eye icon"></i>
                          </Button>
                        </div>
                      </Modal>
                    </div>
                  ))}
                  <div className="paginationResponsive">
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          fontSize: '13px',
                        }}>
                        <span>Rows per page:</span>
                        <div class="select-container">
                        </div>
                        <select
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'rgba(0, 0, 0, 0.54)',
                          }}
                          value={limit}
                          onChange={handleChangeLimit}>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value={TotalRows}>{TotalRows}</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2px' }}>

                      <div className="" style={{ marginLeft: '5px', marginRight: '5px' }}>
                        {page} of {totalPage || 0}
                      </div>
                      <button
                        onClick={() => {
                          setPage(1);
                        }}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}>
                        {' '}
                        <Icon disabled name="angle double left" />
                      </button>
                      <button
                        onClick={() => {
                          handlePrevPage(page - 1);
                        }}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}>
                        <Icon disabled name="angle left" />
                      </button>

                      <button
                        onClick={() => {
                          handleNextPage(page + 1);
                        }}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}>
                        {' '}
                        <Icon disabled name="angle right" />
                      </button>
                      <button
                        onClick={() => {
                          setPage(totalPage || 1);
                        }}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}>
                        {' '}
                        <Icon disabled name="angle double right" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <h2>Loading ....</h2>
                </div>
              )}
            </div>
          </div>
        )}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default Coupons;
