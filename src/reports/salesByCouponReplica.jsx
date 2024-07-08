import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Button, Card, CardContent, CardDescription, CardMeta, Input, Sidebar } from 'semantic-ui-react';
import { SlArrowRight } from "react-icons/sl";
import moment from 'moment';
import { apiGET } from '../utils/apiHelper';
import DateRangePickerCop from '../modules/salesoverview/datePickerInput';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

import TableWrapper from '../utils/tableWrapper';

import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const CouponByDetails = () => {
  const [fromDate, setFromDate] = useState(moment().subtract(30, 'days'))
  const [endDate, setEndDate] = useState(moment())
  const [data, setData] = useState([]);
  const [sort, setSort] = useState(1)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [TotalRows, setTotalRows] = useState(0)
  const [loading, setLoading] = useState()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)


  const sections = [
    { key: 'Dashboard', content: 'Dashboard', link: true },
    { key: 'report', content: 'Reports', link: true },
    { key: 'CouponByDetails', content: 'Coupon Details ', link: true },
  ];

  const getSalesByCoupon = async () => {
    setLoading(true);
    try {
      let url = `/v1/order/sales-by-coupon?sort[couponType]=${sort}`;
      let response
      if (fromDate) {
        response = await apiGET(`${url}&filter={"fromdate":"${fromDate}","todate":"${endDate}"}`);
      } else {
        response = await apiGET(`${url}`);
      }
      console.log(response);
      if (response.status) {
        setData(response?.data?.data?.data)
        setTotalRows(response?.data?.data?.totalResults);
        setPage(response?.data?.data?.page)
        setLimit(response?.data?.data?.limit)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setLoading(false);
    }
  }


  const columns = [
    // {
    //   name: 'seqId',
    //   selector: (row) => row.seqId,
    //   width: '9%'
    // },
    // {
    //   name: <div style={{display:"flex",justifyContent:"space-between", gap:"42px"}} onClick={()=>sort == 1 ? setSort(-1) : setSort(1)}>Coupon Name <span> {sort == -1 ? <FaArrowUp /> :<FaArrowDown />}</span></div>,
    //   selector: (row) => row?.couponName,
    //   width: '18%',
    // },
    {
      name: <div>Coupon Name </div>,
      selector: (row) => row?.couponName,
      width: '18%',
    },
    {
      name: 'Total Orders',
      selector: (row) => (row?.totalOrders ? `${row?.totalOrders}` : '--'),
      width: '12%'

    },
    {
      name: 'Coupon Type',
      selector: (row) => <div style={{ textTransform: "capitalize" }}>{row?.couponType}</div>,
      width: '15%'

    },
    // {
    //   name: 'DiscountMode',
    //   selector: (row) => row.discountMode,
    // },
    {
      name: 'Avrage Order Value',
      selector: (row) => (<div>£{row?.averageOrderValue}</div>),

      width: '20%'

    },
    {
      name: 'Discount',
      selector: (row) => (<div>£{row?.totalCouponDiscount}</div>),
      width: '12%'
    },
    {
      name: 'Total Sales',
      selector: (row) => (`${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0
      }).format(row?.totalSales)}`),
      width: "18%",
    },
  ];




  const HandleOpenSalesChart = () => {
    setShowSalesChart(true)
    setShowOrdersChart(false);
    setShowAvrValueChart(false)

  }
  const HandleOpenOrdersChart = () => {
    setShowOrdersChart(true);
    setShowSalesChart(false);
    setShowAvrValueChart(false)
  }
  const handleOpenAvgValChart = () => {
    setShowOrdersChart(false);
    setShowSalesChart(false);
    setShowAvrValueChart(true)
  }
  const handleGetDatePickar = (startDate, endDate) => {

    setFromDate(startDate)
    setEndDate(endDate)
    setShowDatePicker(false)
  }
  const handlePriviesDate = (startDate, endDAte) => {

    setShowDatePicker(false)

  }
  useEffect(() => {
    getSalesByCoupon()
  }, [fromDate, endDate, sort]);

  return <>
    <div style={{ backgroundColor: "#F4F4F4" }}>
      <div className="fadeIn" style={{ overflow: "auto" }}>
        <div className="page-header" style={{ flexWrap: "wrap", gap: "16px",border:'none' }}>

          <div>
            <Breadcrumb size={"small"} style={{ fontSize: "14px", fontWeight: 600 }}>
            <BreadcrumbSection as={Link} to="/dashboard/" style={{ color: "#0496FF" }}>Dashboard</BreadcrumbSection>
            <BreadcrumbDivider style={{color:'black'}} icon='right chevron' />
              <BreadcrumbSection as={Link} to="/dashboard/reports" style={{ color: "#0496FF" }}>Report</BreadcrumbSection>
              <BreadcrumbDivider icon='right chevron' style={{color:'black'}} />
              <BreadcrumbSection active>Coupon Details</BreadcrumbSection>
            </Breadcrumb>
          </div>
        </div>
        <div className='sideMargin' style={{marginBottom:"2rem"}}>
          <div className="salesOverviewHeading">
            <div style={{ fontSize: "25px" }}><strong>Sales By Coupon</strong></div>
            <div onClick={() => setShowDatePicker(!showDatePicker)} className='salesoverviewHoverDate ' style={{ border: "1px solid rgb(239, 239, 239) ", display: "flex", margin: "5px",  borderRadius: "8px", padding:'5px', backgroundColor: "white", marginLeft: "1rem" }}>
              <span><i class="calendar alternate outline icon"></i></span>{fromDate && endDate ? <p> {fromDate.toString().substring(4, 11)} - {endDate.toString().substring(4, 10)}, {endDate.toString().substring(11, 15)}</p> : <p>Last 30 Day's</p>}
            </div>
          </div>
          {showDatePicker && <div style={{ position: "absolute", zIndex: "100" }} >
            <DateRangePickerCop handleGetDatePickar={handleGetDatePickar} handlePriviesDate={handlePriviesDate} />
          </div>}
        </div>
        <div className='salesBycoupon'>
        <div style={{ overflowX: 'scroll', width: '100%', maxWidth: '100vw', whiteSpace: 'nowrap', borderRadius: "16px 16px 0px 0px", padding: '20px' }}>
          <TableWrapper
            columns={columns}
            data={data}
            progressPending={loading}
            paginationServer
            paginationTotalRows={TotalRows}
            onChangeRowsPerPage={(newlimit, page) => {
              setLimit(newlimit);
            }}
            paginationRowsPerPageOptions={
              [10, 20, 50, 100, TotalRows]
            }
            width={"100%"}
            paginationPerPage={limit}
            onChangePage={(p) => setPage(p)}
          />
        </div>
        </div>
        

        <div>
       
        </div>
      </div>
        </div>
        <div className='name-container-mobile' style={{padding:'20px'}}>
          {data.map((item)=><>
           
          <div style={{display:'flex',justifyContent:'space-between',margin:'10px',lineHeight:'1.7rem'}}>
          <div style={{gap:'10px',color:'#747474'}}>
        <div>Coupon Name</div>
        <div>Total Orders</div>
        <div>Coupon Type</div>
        <div>Average Order Value</div>
        <div>Discount</div>
        <div>Total Sales</div>
        </div>
        <div style={{fontWeight:'600'}}>
        <div>{item.couponName}</div>
        <div>{item?.totalOrders ? `${item?.totalOrders}` : '--'}</div>
        <div>{item.couponType}</div>
        <div>£{item?.averageOrderValue}</div>
        <div>£{item?.totalCouponDiscount}</div>
        <div>£{item?.totalSales}</div>
        </div>
        </div>
      <hr />
             
          
          </>)}
        
        
    </div>

        </>
}

export default CouponByDetails
