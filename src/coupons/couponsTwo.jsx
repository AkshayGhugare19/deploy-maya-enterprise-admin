import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Button,
  Dropdown,
  Form,
  FormCheckbox,
  FormGroup,
  FormInput,
  Icon,
  Input,
  Sidebar,
} from 'semantic-ui-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TableWrapper from '../utils/tableWrapper';
import { apiGET, apiPOST, objectToQueryParam } from '../utils/apiHelper';
import { RxCross1, RxCross2 } from 'react-icons/rx';

import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { Modal } from 'semantic-ui-react';

import useDebounce from '../utils/useDebounce';
import { SlArrowRight } from 'react-icons/sl';
import { FaPlus } from 'react-icons/fa';

// import CollectionActionButtons from '../../../components/avatar/collectionActionButtons';
const transactionUrl = import.meta.env.VITE_TRANSACTION_DEVEOPLEMENT_URL_HASH;

const couponsTwo = () => {
  let { action } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [TotalRows, setTotalRows] = useState();
  const [open, setOpen] = useState(false);
  const [openCouponDetails, setOpenCouponDetails] = useState(false);
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  const [noShowenddate, setNoShowenddate] = useState(true);
  const [LimitNuUsescoupon, setLimitNuUsescoupon] = useState(false);
  // const [LimitOnUsePercostomer, setLimitOnUsePercostomer] = useState(false)
  const [SelectProductType, setSelectProductType] = useState('');
  const [SelectDiscounTypeAutomatic, setSelectDiscounTypeAutomatic] =
    useState('');

  const [SelectDiscountType, setSelectDiscountType] = useState('price');
  const [allCoupons, setallCoupons] = useState([]);

  const [ProductData, setProductData] = useState();
  const [specificProduct, setspecificProduct] = useState(null);
  const [specificProductAutomatic, setspecificProductAutomatic] = useState([]);

  const [CatogryData, setProductCatogryData] = useState();
  const [specificCatogry, setspecificCatogry] = useState();
  const [couponByid, setcouponByid] = useState();
  const [productById, setproductByid] = useState();

  const [inputValue, setInputValue] = useState({
    code: null,
    name: null,
    discount_price: null,
    discount_percentage: null,
    start_date: null,
    expiry_date: null,
    max_uses: null,
    min_qty: null,
    sale_price: null,
  });
  const [errorFild, seterrorFild] = useState('');

  const [product, setproduct] = useState([]);
  const [loading, setLoading] = useState();
  const [search, setsearch] = useState('');
  const [isFeatured, setIsFeatured] = useState('');
  const sections = [
    { key: 'Dashboard', content: 'Dashboard', link: true },
    { key: 'Coupons', content: 'Coupons', link: true },
  ];

  const getProducts = async () => {
    try {
      let response;

      if (SelectProductType == 'specific_products') {
        response = await apiGET('/v1/products/get-all-Products-admin/');

        if (response?.data?.code == 200) {
          console.log(response);
          setProductData(response?.data?.data);
          setProductCatogryData();
        }
      }

      if (SelectProductType == 'specific_brand') {
        response = await apiGET('/v1/category/get-category');

        if (response?.data?.code == 200) {
          setProductCatogryData(response?.data?.data);
          setProductData();
        }
      }
    } catch (error) {
      Toast.error(error?.message);
    }
  };

  let productCatogry = [];
  if (SelectProductType == 'specific_products') {
    for (let i = 0; i < ProductData?.length; i++) {
      productCatogry.push({
        key: ProductData[i]?.id,
        text: `${ProductData[i]?.name} ${
          SelectDiscountType == 'automatic_discount'
            ? `£${ProductData[i]?.price}`
            : ''
        } `,
        value: ProductData[i]?.id,
      });
    }
  } else if (SelectProductType == 'specific_brand') {
    for (let i = 0; i < CatogryData?.length; i++) {
      productCatogry.push({
        key: CatogryData[i]?.name,
        text: CatogryData[i]?.name,
        value: CatogryData[i]?._id,
      });
    }
  }

  const dropDownOptions = [
    { key: 1, text: 'All Coupons', value: '' },
    { key: 2, text: 'Discount By Price (£)', value: 'price' },
    { key: 3, text: 'Discount By Percentage (%)', value: 'percentage' },
    { key: 3, text: 'Automatic Discount (£)', value: 'automatic_discount' },
  ];
  const dropDownOptionsModale = [
    { key: 1, text: 'All Product', value: 'all_products' },
    { key: 2, text: 'Specific Products', value: 'specific_products' },
    { key: 3, text: 'Specific Brand', value: 'specific_brand' },
    // { key: 6, text: 'Minimum order subtotal', value: 'Minimum order subtotal' },
  ];
  const dropDownOptionsAutomaticdropdown = [
    // { key: 1, text: 'All Product', value: 'all_products' },
    { key: 2, text: 'Specific Products', value: 'specific_products' },
    // { key: 3, text: 'Specific Brand', value: 'specific_brand' },
    // { key: 6, text: 'Minimum order subtotal', value: 'Minimum order subtotal' },
  ];
  const discountAutomaticDropdowntype = [
    { key: 1, text: 'Sale price', value: 'sale_price' },
    // { key: 2, text: 'Amount off', value: 'amount_off' },
    // { key: 3, text: 'Percentage off', value: 'percentage_off' },
  ];

  const handleIsfeatured = (e, d) => {
    setIsFeatured(d?.value);
    console.log(e?.value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Apply general updating logic for other input fields
    setInputValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Special handling for discount_percentage
    if (name === 'discount_percentage') {
      const numericValue = parseInt(value.replace(/\D/g, ''), 10);
      const sanitizedValue = isNaN(numericValue)
        ? ''
        : Math.min(numericValue, 100).toString();

      setInputValue((prevValues) => ({
        ...prevValues,
        discount_percentage: sanitizedValue,
      }));
    }
  };
  const handleInputDropdownChange = (e, d) => {
    if (
      (SelectProductType == 'specific_products' &&
        SelectDiscountType == 'price') ||
      (SelectDiscountType == 'percentage' &&
        SelectProductType == 'specific_products')
    ) {
      setspecificProduct(d?.value);
      getproductByid(d?.value);
    } else if (
      (SelectDiscountType == 'percentage' &&
        SelectProductType == 'specific_brand') ||
      (SelectDiscountType == 'price' && SelectProductType == 'specific_brand')
    ) {
      setspecificCatogry(d?.value);
      console.log('hell', SelectProductType);
    } else if (
      SelectDiscountType == 'automatic_discount' &&
      SelectProductType == 'specific_products'
    ) {
      setspecificProductAutomatic(d?.value);
    }
    console.log(specificCatogry);
  };

  const validationOfCoupons = (payload) => {
    if (!payload?.specific_products_automatic.length) {
      if (
        payload?.apply_to == 'specific_products' &&
        payload?.specific_products == null
      ) {
        Toast.fire({
          title: 'Error!',
          text: 'You have to choose at least one product to apply specific products coupon',
          icon: 'error', // Corrected typo in "success"
        });
        return false;
      }
    }
    if (payload?.apply_to == 'specific_brand' && !payload?.specific_brand) {
      Toast.fire({
        title: 'Error!',
        text: 'You have to choose at least one brand to apply specific brand coupon',
        icon: 'error', // Corrected typo in "success"
      });
      return false;
    }
    return true;
  };
  const addCoupons = async () => {
    try {
      const payload = {
        type: SelectDiscountType,
        apply_to:
          SelectDiscountType == 'free_shipping'
            ? 'all_products'
            : SelectProductType,
        specific_products: specificProduct,
        specific_products_automatic: specificProductAutomatic,
        specific_brand: specificCatogry,
        is_expiry_date: inputValue?.expiry_date ? noShowenddate : false,
        one_use_per_customer: false,
        code: inputValue?.code,
        name: inputValue?.name,
        discount_percentage: inputValue?.discount_percentage,
        discount_price: inputValue?.discount_price,
        start_date: inputValue?.start_date,
        expiry_date: inputValue?.expiry_date,
        max_uses: inputValue?.max_uses,
        sale_price: inputValue?.sale_price,
        min_qty: inputValue?.min_qty,
      };

      const validate = validationOfCoupons(payload);
      if (!validate) {
        return;
      }

      const response = await apiPOST('/v1/coupon/add-coupon', payload);

      if (response?.data?.code == 200) {
        setOpen(false);
        Swal.fire({
          title: 'Success!',
          text: 'Coupon Added Successfully!',
          icon: 'success',
        });
        getAllCoupons();
        setInputValue({});
        seterrorFild('');
        setNoShowenddate(true);
        setproductByid();
        setLimitNuUsescoupon(false);
        setspecificProduct(null);
        setspecificProductAutomatic([]);
        setspecificCatogry();
      } else if (response?.data?.code == 400) {
        // Swal.fire({
        //     title: 'Error!',
        //     text: response?.data?.data,
        //     icon: 'error',

        // });
        seterrorFild(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCoupons = async () => {
    try {
      const response = await apiGET(
        `/v1/coupon/get-all-coupons?page=${page}&limit=${limit}&filter[query]={type:${isFeatured},search:${search}}`
      );
      console.log(response?.data?.data);
      if (response?.data?.code == 200)
        setallCoupons(response?.data?.data?.data);
      setTotalRows(response?.data?.data?.totalResults);
    } catch (error) {}
  };

  const getcouponByid = async (id) => {
    try {
      const response = await apiGET(`/v1/coupon/get-couponBy-id/${id}`);

      if (response?.data?.code === 200) {
        setOpenCouponDetails(true);
        setcouponByid(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching coupon by id:', error);
    }
  };
  const getproductByid = async (id) => {
    try {
      const response = await apiGET(`/v1/products/getproductbyid/${id}`);
      console.log('single produt', response?.data?.data);

      if (response?.data?.code === 200) {
        setproductByid(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching coupon by id:', error);
    }
  };

  const deleteCouponByid = async (id) => {
    try {
      const response = await apiPOST(`/v1/coupon/delete-coupons/${id}`);
      console.log(response?.data?.data);

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
  const CloseCreateCoupon = () => {
    setOpen(false);
    setInputValue({});
    seterrorFild('');
    setproductByid();
    setNoShowenddate(true);
    setLimitNuUsescoupon(false);
    setspecificProduct(null);
    setspecificProductAutomatic([]);
  };

  const clearFields = () => {
    // console.log("setSelectProductType",SelectProductType);
    setInputValue({});
    seterrorFild('');
    setproductByid();
    setNoShowenddate(true);
    setLimitNuUsescoupon(false);
    setspecificProduct(null);
    setSelectProductType('');

    setcouponByid();
    setspecificCatogry('');
    setspecificProductAutomatic([]);
  };
  const columns = [
    // {
    //   name: 'seqId',
    //   selector: (row) => row.seqId,
    //   width: '9%'
    // },
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
    // {
    //   name: 'DiscountMode',
    //   selector: (row) => row.discountMode,
    // },
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
    // {
    //   name: 'Created On',
    //   selector: (row) => row.createdAt,
    // },
    {
      name: 'Action',
      selector: (row) => (
        <>
          <div>
            {/* <AvatarSeriesActionButtons
            // progressStatus={row.progressStatus}
            onClickEditButton={() => onClickEditButton(row._id)}
          /> */}
            <button
              onClick={() => getcouponByid(row?._id)}
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
  useDebounce(getAllCoupons, 2000, [search]);
  useEffect(() => {
    getProducts();
    getAllCoupons();
  }, [SelectProductType, isFeatured, page, limit]);
  console.log(errorFild);
  useEffect(() => {
    setInputValue({});
  }, [SelectDiscountType]);
  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher style={{ backgroundColor: '#F4F4F4' }} className="fadeIn">
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
                  <div className="sub-text">
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
                      setsearch(e.target.value);
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
                    options={dropDownOptions}
                    onChange={(e, d) => handleIsfeatured(e, d)}
                    style={{
                      borderRadius: '8px',
                      height: '36px',
                      maxWidth: '100% !important',
                    }}
                  />
                </div>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  style={{
                    borderRadius: '28px',
                    backgroundColor: '#0496FF',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '14px',
                    gap: '8px',
                    lineHeight: '22px',
                  }}>
                  <FaPlus style={{ marginTop: '2px' }} />{' '}
                  Create Coupon
                </Button>
              </div>
            </div>
          </div>

          {/*   <div className="page-header-actions">
            <div>
              <div style={{ marginBottom: '20px' }}>
                <Button
                  primary
                  onClick={() => {
                    setOpen(true);
                  }}>
                  Create Coupon
                </Button>
              </div>
              <div></div>
            </div>
          </div> */}
        </div>

        <div>
          {/* <div style={{  position: "absolute",display:"flex",justifyContent:"center" }}>
                <div style={{}} >

                    <CouponDetails />
                </div>
            </div> */}
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
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              paginationPerPage={limit}
              onChangePage={(newPage) => setPage(newPage)}
            />
          </div>
          <div style={{ padding: '10px' }}>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '28px',
                  padding: '1.5rem',
                }}>
                <div>New Coupon</div>
                <div onClick={() => CloseCreateCoupon()}>
                  <RxCross1 />
                </div>
              </div>
              <Modal.Content>
                <p style={{ margin: '10px 20px' }}>
                  Select the type of coupon you want to offer :
                </p>
                <Modal.Description>
                  <div>
                    <div style={{ margin: '0 10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'start',
                          gap: '20px',
                          margin: '20px 0',
                        }}>
                        <div
                          className=""
                          onClick={() => {
                            clearFields(), setSelectDiscountType('price');
                          }}
                          style={{
                            width: '130px',
                            height: '130px',
                            padding: '3px',
                            flex: '0 0 130px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            backgroundColor:
                              SelectDiscountType === 'price'
                                ? '#0496FF'
                                : '#D4D4D4',
                          }}>
                          <div
                            className=""
                            style={{
                              borderRadius: '10px',
                              padding: '10px 10px',
                              textAlign: 'center',
                              color:
                                SelectDiscountType === 'price'
                                  ? 'white'
                                  : 'black',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '128px',
                              height: '128px',
                            }}>
                            <p
                              style={{
                                fontSize: '19px',
                                fontWeight: 'lighter',
                                backgroundColor:
                                  SelectDiscountType === 'price'
                                    ? '#FFFFFF'
                                    : '#D9D9D9',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                color:
                                  SelectDiscountType === 'price'
                                    ? '#0496FF'
                                    : '#747474',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              £
                            </p>
                            <p
                              style={{
                                color:
                                  SelectDiscountType === 'price'
                                    ? 'white'
                                    : '#000000DE',
                              }}>
                              Price
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            clearFields(), setSelectDiscountType('percentage');
                          }}
                          style={{
                            padding: '3px',
                            borderRadius: '5px',
                            width: '130px',
                            height: '130px',
                            flex: '0 0 130px', // Fixed size for the card
                            cursor: 'pointer',
                            backgroundColor:
                              SelectDiscountType === 'percentage'
                                ? '#0496FF'
                                : '#D4D4D4',
                          }}>
                          <div
                            style={{
                              borderRadius: '10px',
                              padding: '22px 10px',
                              textAlign: 'center',
                              color:
                                SelectDiscountType === 'percentage'
                                  ? 'white'
                                  : 'black',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '128px',
                              height: '128px',
                            }}>
                            <p
                              style={{
                                fontSize: '19px',
                                fontWeight: 'lighter',
                                backgroundColor:
                                  SelectDiscountType === 'percentage'
                                    ? '#FFFFFF'
                                    : '#D9D9D9',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                color:
                                  SelectDiscountType === 'percentage'
                                    ? '#0496FF'
                                    : '#747474',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {' '}
                              %{' '}
                            </p>
                            <p style={{ color: '#000000DE' }}> Discount</p>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            clearFields(),
                              setSelectDiscountType('automatic_discount');
                          }}
                          style={{
                            cursor: 'pointer',
                            padding: '3px',
                            borderRadius: '5px',
                            height: '130px',
                            flex: '0 0 130px', // Fixed size for the card
                            width: '130px',
                            backgroundColor:
                              SelectDiscountType === 'automatic_discount'
                                ? '#0496FF'
                                : '#D4D4D4',
                          }}>
                          <div
                            style={{
                              borderRadius: '10px',
                              padding: '20px 10px',
                              textAlign: 'center',
                              color:
                                SelectDiscountType === 'automatic_discount'
                                  ? 'white'
                                  : 'black',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '128px',
                              height: '128px',
                            }}>
                            <p
                              style={{
                                fontSize: '19px',
                                fontWeight: 'lighter',
                                backgroundColor:
                                  SelectDiscountType === 'automatic_discount'
                                    ? '#FFFFFF'
                                    : '#D9D9D9',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                color:
                                  SelectDiscountType === 'automatic_discount'
                                    ? '#0496FF'
                                    : '#747474',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {' '}
                              <i class="autoprefixer icon "></i>{' '}
                            </p>
                            <p
                              style={{
                                color:
                                  SelectDiscountType === 'automatic_discount'
                                    ? 'white'
                                    : '#000000DE',
                              }}>
                              Automatic Discount
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            clearFields(),
                              setSelectDiscountType('free_shipping');
                          }}
                          style={{
                            cursor: 'pointer',
                            padding: '3px',
                            borderRadius: '5px',
                            height: '130px',
                            flex: '0 0 130px', // Fixed size for the card
                            width: '130px',
                            backgroundColor:
                              SelectDiscountType === 'free_shipping'
                                ? '#0496FF'
                                : '#D4D4D4',
                          }}>
                          <div
                            style={{
                              borderRadius: '10px',
                              padding: '10px 10px',
                              textAlign: 'center',
                              color:
                                SelectDiscountType === 'free_shipping'
                                  ? 'white'
                                  : 'black',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '128px',
                              height: '128px',
                            }}>
                            <p
                              style={{
                                fontSize: '19px',
                                fontWeight: 'lighter',
                                backgroundColor:
                                  SelectDiscountType === 'free_shipping'
                                    ? '#FFFFFF'
                                    : '#D9D9D9',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                color:
                                  SelectDiscountType === 'free_shipping'
                                    ? '#0496FF'
                                    : '#747474',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Icon name="shipping fast" />{' '}
                            </p>
                            <p
                              style={{
                                color:
                                  SelectDiscountType === 'free_shipping'
                                    ? 'white'
                                    : '#000000DE',
                              }}>
                              Free shipping
                            </p>
                          </div>
                        </div>{' '}
                        {/*
                                        <div onClick={() => setSelectDiscountType("by x get y free discount")} style={{ cursor: "pointer", padding: "3px", border: "1px solid #3899EC", borderRadius: "5px", width: "130px" }}>
                                            <div style={{ backgroundColor: "#8FCA8F", borderRadius: "5px", padding: "22px 10px", textAlign: "center", color: "white" }}>
                                                <p style={{ fontSize: "19px", fontWeight: "lighter" }}> <i class="opencart icon "></i>  </p>
                                                <p>By X Get Y Free</p>
                                            </div>
                                        </div> */}
                      </div>
                      <hr></hr>
                      <div style={{ margin: ' 20px  0' }}>
                        <Form>
                          <FormGroup widths="equal">
                            <FormInput
                              fluid
                              id="form-subcomponent-shorthand-input-first-name"
                              label="coupon code"
                              name="code"
                              style={{ fontSize: '16px' }}
                              onChange={handleChange}
                              value={inputValue?.code}
                              type="text"
                              placeholder="e.g., SUMMERSALE112"
                            />
                            <FormInput
                              fluid
                              id="form-subcomponent-shorthand-input-last-name"
                              label="coupon name"
                              onChange={handleChange}
                              value={inputValue?.name}
                              name="name"
                              placeholder="e.g., SUMMERSALE"
                              type="text"
                            />
                          </FormGroup>

                          {/* <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}>
                          {SelectDiscountType == 'automatic_discount' ? (
                            ''
                          ) : (
                            <div style={{ width: '50%', margin: '0px 0' }}>
                              <label style={{ fontSize: '16px' }}>
                                Coupon code
                              </label>
                              <br />
                              <input
                                name="code"
                                onChange={handleChange}
                                value={inputValue?.code}
                                style={{
                                  border: '1px solid #DEDEDF',
                                  outline: '#DEDEDF',
                                  // padding: '10px',
                                  width: '90%',
                                  borderRadius: '5px',
                                  // margin: '5px 0',
                                }}
                                type="text"
                                placeholder="e.g., SUMMERSALE112"
                              />
                            </div>
                          )}
                          <div style={{ width: '50%', margin: '0px 0' }}>
                            <label style={{ fontSize: '16px' }}>
                              Coupon name
                            </label>
                            <br />
                            <input
                              name="name"
                              onChange={handleChange}
                              value={inputValue?.name}
                              style={{
                                border: '1px solid #DEDEDF',
                                outline: '#DEDEDF',
                                // padding: '10px',
                                width: '90%',
                                borderRadius: '5px',
                                margin: '5px 0',
                              }}
                              type="text"
                              placeholder="e.g., SUMMERSALE"
                            />
                          </div>
                        </div> */}

                          {SelectDiscountType == 'free_shipping' ? (
                            ''
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                margin: '10px 0',
                                alignItems: 'center',
                                gap: '65px',
                              }}>
                              {SelectDiscountType == 'automatic_discount' ? (
                                <>
                                  <div style={{ width: '100%' }}>
                                    <label style={{ fontSize: '14px' }}>
                                      Discount
                                    </label>
                                    <br />
                                    <Dropdown
                                      style={{ width: '100%', margin: '0px 0' }}
                                      placeholder="Select"
                                      search
                                      selection
                                      options={discountAutomaticDropdowntype}
                                      onChange={(e, d) =>
                                        setSelectDiscounTypeAutomatic(d?.value)
                                      }
                                    />
                                  </div>
                                  <div style={{ width: '100%' }}>
                                    <label style={{ fontSize: '14px' }}>
                                      {(SelectDiscounTypeAutomatic ==
                                        'sale_price' &&
                                        'Sale Price') ||
                                        (SelectDiscounTypeAutomatic ==
                                          'amount_off' &&
                                          'Amount Discount') ||
                                        (SelectDiscounTypeAutomatic ==
                                          'percentage_off' &&
                                          'Percentage Discount')}
                                    </label>
                                    {SelectDiscounTypeAutomatic == '' ? (
                                      ''
                                    ) : (
                                      <div
                                        style={{
                                          border: '1px solid #DEDEDF',
                                          outline: '#DEDEDF',
                                          width: '90%',
                                          borderRadius: '5px',
                                          margin: '7px 0',
                                        }}>
                                        {SelectDiscounTypeAutomatic ==
                                          'sale_price' ||
                                        SelectDiscounTypeAutomatic == '' ||
                                        SelectDiscounTypeAutomatic ==
                                          'amount_off'
                                          ? '£'
                                          : ''}
                                        <input
                                          value={inputValue?.sale_price}
                                          name={'sale_price'}
                                          onChange={handleChange}
                                          style={{
                                            width: '92%',
                                            border: 'none',
                                            outline: 'none',
                                          }}
                                          type="text"
                                          placeholder=""
                                        />
                                        {SelectDiscounTypeAutomatic ==
                                        'percentage_off'
                                          ? '%'
                                          : ''}
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div style={{ width: '50%', marginTop: '5px' }}>
                                  <label style={{ fontSize: '14px' }}>
                                    Discount
                                  </label>

                                  <div
                                    style={{
                                      border: '1px solid #DEDEDF',
                                      outline: '#DEDEDF',
                                      // width: '600px',
                                      // height:'56px',
                                      borderRadius: '5px',
                                      margin: '10px 10px 0px 0px',
                                    }}>
                                    {(SelectDiscountType == 'price' ||
                                      SelectDiscountType == '' ||
                                      SelectDiscountType ==
                                        'automatic_discount') &&
                                      '£'}
                                    <input
                                      value={
                                        SelectDiscountType == 'price' ||
                                        SelectDiscountType == ''
                                          ? inputValue?.discount_price
                                          : inputValue?.discount_percentage
                                      }
                                      name={
                                        SelectDiscountType == 'price' ||
                                        SelectDiscountType == ''
                                          ? 'discount_price'
                                          : 'discount_percentage'
                                      }
                                      onChange={handleChange}
                                      style={{
                                        width: '100%',
                                        border: 'none',
                                        outline: 'none',
                                      }}
                                      type="text"
                                      placeholder=""
                                    />

                                    {SelectDiscountType == 'percentage' && '%'}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '10px 0',
                              alignItems: 'center',
                            }}>
                            {SelectDiscountType == 'free_shipping' ? (
                              ''
                            ) : (
                              <div style={{ width: '50%', margin: '5px 0' }}>
                                <label style={{ fontSize: '14px' }}>
                                  Apply to
                                </label>
                                <Dropdown
                                  style={{ width: '100%', margin: '5px 0' }}
                                  placeholder="Select"
                                  search
                                  selection
                                  options={
                                    SelectDiscountType == 'automatic_discount'
                                      ? dropDownOptionsAutomaticdropdown
                                      : dropDownOptionsModale
                                  }
                                  onChange={(e, d) =>
                                    setSelectProductType(d?.value)
                                  }
                                />
                              </div>
                            )}
                            {(SelectProductType == 'specific_products' ||
                              SelectProductType == 'specific_brand') && (
                              <div style={{ width: '50%', margin: '5px 0' }}>
                                {SelectDiscountType == 'automatic_discount' ? (
                                  <div>
                                    <label style={{ fontSize: '14px' }}>
                                      {SelectProductType == 'specific_brand'
                                        ? 'Category'
                                        : 'Product'}{' '}
                                    </label>
                                    <Dropdown
                                      placeholder="Product"
                                      fluid
                                      multiple
                                      search
                                      selection
                                      onChange={(e, d) =>
                                        handleInputDropdownChange(e, d)
                                      }
                                      options={productCatogry}
                                    />{' '}
                                  </div>
                                ) : (
                                  <>
                                    <label style={{ fontSize: '14px' }}>
                                      {SelectProductType == 'specific_brand'
                                        ? 'Category'
                                        : 'Product'}{' '}
                                    </label>
                                    <Dropdown
                                      style={{ width: '90%', margin: '5px 0' }}
                                      placeholder={
                                        SelectProductType == 'specific_brand'
                                          ? 'Category'
                                          : 'Product'
                                      }
                                      search
                                      selection
                                      options={productCatogry}
                                      onChange={(e, d) =>
                                        handleInputDropdownChange(e, d)
                                      }
                                    />
                                    {productById?.price &&
                                      SelectProductType ==
                                        'specific_products' && (
                                        <p>
                                          {' '}
                                          Current price : £{productById?.price}
                                        </p>
                                      )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </Form>
                        {/* {SelectProductType == "Minimum order subtotal" ? '' :
                                            <div style={{ margin: "10px 0", padding: "10px 0" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
                                                    <input type="checkbox" checked />
                                                    <span style={{ fontSize: "17px" }}>Apply once per order (to the lowest priced item)</span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
                                                    <input type="checkbox" />
                                                    <span style={{ fontSize: "17px" }}>Apply to each eligible item in the order</span>
                                                </div>
                                            </div>} */}
                        <hr style={{ marginTop: '10px' }}></hr>

                        <div style={{ margin: '20px 0' }}>
                          <div>
                            <div style={{ margin: '10px 0' }}>
                              <p style={{ fontSize: '14px' }}>Valid between</p>
                            </div>
                            {/* <div>
                             
                              <input
                                onChange={handleChange}
                                value={inputValue?.start_date}
                                name="start_date"
                                style={{ width: '25%', padding: '10px' }}
                                type="date"
                              />
                            
                            
                             <input
                                onChange={handleChange}
                                value={inputValue?.expiry_date}
                                name="expiry_date"
                                style={{ width: '25%', padding: '10px' }}
                                type="date"
                                disabled={noShowenddate == false}
                                
                              />
                              <div>
                                <input
                                  id="enddate"
                                  onClick={() =>
                                    setNoShowenddate(!noShowenddate)
                                  }
                                  style={{ margin: '10px' }}
                                  type="checkbox"
                                  checked={noShowenddate == false}></input>
                                <label
                                  htmlFor="#enddate"
                                  style={{ fontSize: '18px' }}>
                                  Don't Show end date
                                </label>
                              </div>

                            
                             
                            </div> */}
                            <Form>
                              <FormGroup unstackable widths={2}>
                                <FormInput
                                  placeholder="First name"
                                  onChange={handleChange}
                                  value={inputValue?.start_date}
                                  name="start_date"
                                  type="date"
                                />
                                <FormInput
                                  placeholder="Last name"
                                  onChange={handleChange}
                                  value={inputValue?.expiry_date}
                                  name="expiry_date"
                                  type="date"
                                  disabled={noShowenddate == false}
                                />
                              </FormGroup>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                }}>
                                <input
                                  id="enddate"
                                  onClick={() =>
                                    setNoShowenddate(!noShowenddate)
                                  }
                                  type="checkbox"
                                  className="input-max-width"
                                  checked={noShowenddate == false}></input>
                                <label
                                  htmlFor="#enddate"
                                  style={{ fontSize: '15px', margin: '5px' }}>
                                  Don't Show end date
                                </label>
                              </div>
                            </Form>
                          </div>
                          {SelectDiscountType == 'automatic_discount' ? (
                            <div style={{ width: '100%' }}>
                              <p style={{ fontSize: '18px' }}>
                                Are there any requirements?{' '}
                              </p>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  // gap: '10px',
                                  // margin: '10px 0',
                                }}>
                                <div style={{ marginRight: 10 }}>
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      setLimitNuUsescoupon(!LimitNuUsescoupon)
                                    }
                                  />
                                </div>
                                <div>
                                  <span style={{ fontSize: '17px' }}>
                                    Minimum quantity of items
                                  </span>
                                </div>
                              </div>
                              {LimitNuUsescoupon && (
                                <div
                                  style={{
                                    margin: '0 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}>
                                  <p>Only includes the selected items </p>
                                  <input
                                    name="min_qty"
                                    onChange={handleChange}
                                    value={inputValue?.min_qty}
                                    style={{
                                      border: '1px solid #DEDEDF',
                                      outline: '#DEDEDF',
                                      width: '30%',
                                      borderRadius: '5px',
                                      marginTop: '-20px',
                                    }}
                                    type="number"
                                    min={0}
                                    placeholder="Enter Number"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{}}>
                              <p
                                style={{
                                  fontSize: '16px',
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                }}>
                                Limit uses{' '}
                              </p>

                              <div
                                style={{
                                  display: 'flex',
                                }}>
                                <input
                                  type="checkbox"
                                  className="input-max-width"
                                  style={{ margin: '5px' }}
                                  onChange={() =>
                                    setLimitNuUsescoupon(!LimitNuUsescoupon)
                                  }
                                />
                                <span style={{ fontSize: '17px' }}>
                                  Limit the total number of uses for this coupon
                                </span>
                              </div>
                              {LimitNuUsescoupon && (
                                <div
                                  style={{
                                    margin: '0 20px',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                  }}>
                                  <input
                                    name="max_uses"
                                    onChange={handleChange}
                                    value={inputValue?.max_uses}
                                    style={{
                                      border: '1px solid #DEDEDF',
                                      outline: '#DEDEDF',
                                      padding: '10px',
                                      width: '30%',
                                      borderRadius: '5px',
                                      margin: '5px 0',
                                    }}
                                    type="text"
                                    placeholder="Enter Number"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          color: 'red',
                          fontWeight: 'bold',
                        }}>
                        {errorFild}
                      </p>
                    </div>
                  </div>
                </Modal.Description>
              </Modal.Content>

              <Button
                onClick={() => addCoupons()}
                primary
                style={{
                  borderRadius: '28px',
                  backgroundColor: '#0496FF',
                  color: '#FFFFFF',
                  margin: '0  1.5rem 1.5rem',
                  fontWeight: '400',
                  fontSize: '14px',
                  lineHeight: '14px',
                }}>
                + Create Coupon
              </Button>
              <Button
                onClick={() => CloseCreateCoupon()}
                secondary
                style={{
                  borderRadius: '28px',
                  backgroundColor: '#747474',
                  color: '#FFFFFF',
                  fontWeight: '400',
                  fontSize: '14px',
                  lineHeight: '14px',
                  marginTop: '10px',
                }}>
                <RxCross2 /> Close
              </Button>
            </Modal>

            <Modal
              open={openCouponDetails}
              onClose={() => setOpenCouponDetails(false)}
              onOpen={() => setOpenCouponDetails(true)}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '28px',
                  padding: '1.5rem',
                }}>
                <div style={{ display: 'flex' }}>
                  <div>Coupon Details</div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 300,
                      margin: '8px',
                    }}>
                    Type: {couponByid?.coupon?.type}
                  </div>
                </div>
                <div onClick={() => setOpenCouponDetails(false)}>
                  <RxCross1 style={{ cursor: 'pointer' }} />
                </div>
              </div>{' '}
              <Modal.Description>
                <div>
                  <div style={{ margin: '0 20px' }}>
                    <div style={{ margin: '0 20px  0' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}>
                        {couponByid?.coupon?.code && (
                          <>
                            <div style={{ width: '50%', margin: '5px 0' }}>
                              <label style={{ fontSize: '14px' }}>
                                Coupon code
                              </label>
                              <input
                                disabled
                                name="code"
                                onChange={handleChange}
                                value={couponByid?.coupon?.code}
                                style={{
                                  border: '1px solid #DEDEDF',
                                  outline: '#DEDEDF',
                                  width: '90%',
                                  borderRadius: '5px',
                                  padding: '10px',
                                  margin: '5px 0',
                                }}
                                type="text"
                                placeholder="e.g., SUMMERSALE112"
                              />
                            </div>
                          </>
                        )}
                        <div style={{ width: '50%', margin: '5px 0' }}>
                          <label style={{ fontSize: '14px' }}>
                            Coupon name
                          </label>
                          <input
                            disabled
                            value={couponByid?.coupon?.name}
                            style={{
                              border: '1px solid #DEDEDF',
                              outline: '#DEDEDF',
                              width: '90%',
                              borderRadius: '5px',
                              padding: '10px',
                              margin: '5px 0',
                            }}
                            type="text"
                            placeholder="e.g., SUMMERSALE"
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          margin: '10px 0',
                        }}>
                        <div style={{ width: '50%', margin: '5px 0' }}>
                          <label style={{ fontSize: '14px' }}>Apply to</label>
                          <input
                            disabled
                            value={couponByid?.coupon?.apply_to}
                            style={{
                              border: '1px solid #DEDEDF',
                              outline: '#DEDEDF',
                              width: '90%',
                              borderRadius: '5px',
                              padding: '10px',
                              margin: '5px 0',
                            }}
                            type="text"
                            placeholder="e.g., SUMMERSALE"
                          />
                        </div>
                        {couponByid?.coupon?.type == 'free_shipping' ? (
                          ''
                        ) : (
                          <div style={{ width: '50%', margin: '5px 0' }}>
                            <label style={{ fontSize: '14px' }}>Discount</label>
                            <div
                              style={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginRight: '130px',
                              }}>
                              <input
                                value={
                                  couponByid?.coupon?.discount_price ||
                                  couponByid?.coupon?.discount_percentage ||
                                  couponByid?.coupon?.sale_price
                                }
                                name={
                                  SelectDiscountType === 'price' ||
                                  SelectDiscountType === 'automatic_discount'
                                    ? 'discount_price'
                                    : 'discount_percentage'
                                }
                                onChange={handleChange}
                                style={{
                                  border: '1px solid #DEDEDF',
                                  outline: '#DEDEDF',
                                  padding: '10px',
                                  width: '100%',
                                  borderRadius: '5px',
                                  paddingRight: '30px',
                                  marginRight: '20px',
                                  marginTop: '5px',
                                }}
                                type="text"
                                placeholder=""
                              />
                              {couponByid?.coupon?.type === 'price' ||
                              couponByid?.coupon?.type ===
                                'automatic_discount' ? (
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '25px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                  }}>
                                  £
                                </span>
                              ) : (
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '25px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                  }}>
                                  %
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {couponByid?.coupon?.apply_to == 'specific_brand' && (
                          <div style={{ width: '50%', margin: '5px 0' }}>
                            <label style={{ fontSize: '14px' }}>
                              {couponByid?.coupon?.apply_to ==
                                'specific_brand' && 'Brand'}{' '}
                            </label>
                            <input
                              name="name"
                              onChange={handleChange}
                              value={
                                couponByid?.coupon?.apply_to ==
                                  'specific_brand' &&
                                couponByid?.coupon?.specific_brand
                              }
                              style={{
                                border: '1px solid #DEDEDF',
                                outline: '#DEDEDF',
                                padding: '10px',
                                width: '90%',
                                borderRadius: '5px',
                                margin: '5px 0',
                              }}
                              type="text"
                              placeholder="e.g., SUMMERSALE"
                            />
                          </div>
                        )}
                      </div>
                      {couponByid?.coupon?.type == 'free_shipping' ? (
                        ''
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            margin: '10px 0',
                          }}></div>
                      )}

                      {couponByid?.coupon?.apply_to == 'specific_products' && (
                        <div>
                          <div>
                            <h4>Product Details:</h4>
                            <div>
                              {couponByid?.productDetail.map((item, i) => (
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    gap: '10px',
                                  }}>
                                  <div>
                                    <img
                                      src={item?.productImageUrl}
                                      width={90}></img>
                                  </div>
                                  <div>
                                    <h4 style={{ margin: '10px' }}>
                                      {item?.name}
                                    </h4>
                                    {item?.price && (
                                      <h5 style={{ margin: '10px' }}>
                                        £{item?.price}
                                      </h5>
                                    )}
                                    {item?.discountValue?.length && (
                                      <h4 style={{ margin: '10px' }}>
                                        Discount : {item?.discountValue}
                                      </h4>
                                    )}
                                  </div>
                                  <div style={{ margin: '10px' }}>
                                    {item?.brand && (
                                      <h5>Brand: {item?.brand}</h5>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <hr style={{ marginTop: '10px' }}></hr>
                      <div style={{ margin: '20px 0' }}>
                        <div>
                          <div style={{ margin: '10px 0' }}>
                            <p style={{ fontSize: '18px' }}>Valid between</p>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'center',
                            }}>
                            <label>
                              Start Date :
                              {couponByid?.coupon?.start_date
                                ? (couponByid?.coupon?.start_date).slice(0, 10)
                                : ''}
                            </label>
                            {couponByid?.coupon?.expiry_date ? (
                              <label>
                                Expire Date :{' '}
                                {couponByid?.coupon?.expiry_date
                                  ? (couponByid?.coupon?.expiry_date).slice(
                                      0,
                                      10
                                    )
                                  : ''}
                              </label>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                        <div></div>
                        {couponByid?.coupon?.min_qty ? (
                          <div
                            style={{
                              margin: '10px 0',
                              padding: '10px 0',
                              display: 'flex',
                            }}>
                            <div>
                              <p style={{ fontSize: '16px' }}>Limit uses</p>
                              <div>
                                <input
                                  disabled
                                  value={couponByid?.coupon?.min_qty}
                                  style={{
                                    border: '1px solid #DEDEDF',
                                    outline: '#DEDEDF',
                                    padding: '10px',
                                    width: '100%',
                                    borderRadius: '5px',
                                    marginTop: '5px',
                                  }}
                                  type="text"
                                  placeholder="Enter Number"
                                />
                              </div>
                            </div>

                            <div>
                              <p style={{ marginLeft: '30px' }}>Used Count :</p>
                              <input
                                disabled
                                value={couponByid?.coupon?.used_count}
                                style={{
                                  border: '1px solid #DEDEDF',
                                  outline: '#DEDEDF',
                                  padding: '10px',
                                  width: '100%',
                                  borderRadius: '5px',
                                  marginLeft: '30px',
                                  marginTop: '10px',
                                }}
                                type="text"
                                placeholder="Enter Number"
                              />
                            </div>
                          </div>
                        ) : (
                          <div style={{ margin: '10px 0', padding: '10px 0' }}>
                            <div
                              style={{
                                // margin: '0 20px',
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                gap: '20px',
                              }}>
                              <div>
                                <label style={{ fontSize: '16px' }}>
                                  Limit uses
                                </label>
                                <input
                                  disabled
                                  value={couponByid?.coupon?.max_uses}
                                  style={{
                                    border: '1px solid #DEDEDF',
                                    outline: '#DEDEDF',
                                    padding: '10px',
                                    width: '100%',
                                    borderRadius: '5px',
                                    margin: '5px 0',
                                  }}
                                  type="text"
                                  placeholder="Enter Number"
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '16px' }}>
                                  Used Count :
                                </label>
                                <input
                                  disabled
                                  value={couponByid?.coupon?.used_count}
                                  style={{
                                    border: '1px solid #DEDEDF',
                                    outline: '#DEDEDF',
                                    padding: '10px',
                                    width: '100%',
                                    borderRadius: '5px',
                                    margin: '5px 0',
                                  }}
                                  type="text"
                                  placeholder="Enter Number"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </Modal.Description>
              <Modal.Actions>
                <Button onClick={() => setOpenCouponDetails(false)} secondary>
                  Close
                </Button>
              </Modal.Actions>
            </Modal>
          </div>
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default couponsTwo;
