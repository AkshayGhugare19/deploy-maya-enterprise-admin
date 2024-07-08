import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Dropdown, Icon, Input, Sidebar } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import TableWrapper from '../utils/tableWrapper';
import { apiGET, apiPOST, objectToQueryParam } from '../utils/apiHelper';
import moment from 'moment/moment';
import Swal from 'sweetalert2';

function CouponDetails() {
    let { action } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [TotalRows, setTotalRows] = useState()
    const [product, setproduct] = useState([])
    const [loading, setLoading] = useState()
    const [search, setsearch] = useState('')
    const [isFeatured, setIsFeatured] = useState(false)
    const [visible, setVisible] = useState(true);
    const sections = [
        { key: 'Coupons', content: 'Coupons', link: true },
        { key: 'Coupon Details', content: 'Coupon Details', link: true },

    ];

    const StatusOptions = [
        { key: 'Pending', text: 'Pending', value: "0" },
        { key: 'Success', text: 'Success', value: 1 },
        { key: 'fail', text: 'fail', value: 2 },
        { key: 'Refund', text: 'Refund', value: 3 },
        { key: 'All', text: 'All', value: "All" },
    ]
    const paymentMode = [
        { key: "Bank", text: "Bank", value: "0" },
        { key: "Crypto", text: "Crypto", value: 1 }
    ]

    const getAllproducts = async () => {
        setLoading(true);
        try {
            const payload = {
                filter: {
                    name: search,
                    isFeatured: isFeatured
                }
            }
            let url
            const queryParams = objectToQueryParam(payload)
            if (search || isFeatured) {

                url = `/v1/products/admin-get-all-products?${queryParams}`
            } else {
                url = `/v1/products/admin-get-all-products?page=${page}&limit=${limit}`
            }

            let response = await apiGET(url)

            if (response.status === 200) {

                setproduct(response?.data?.data?.data);
                setTotalRows(response?.data?.data?.totalResults);
                setPage(response?.data?.data?.page)
                setLimit(response?.data?.data?.limit)
            } else if (response.status === 400) {
                Swal.fire({
                    title: "Error!",
                    text: response?.data?.data,
                    icon: "error",
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: response?.data?.data,
                    icon: "error",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllproducts()

    }, [page, limit, search, isFeatured])

    useEffect(() => {
        if (action == 'add' || action == 'edit') {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [action]);

   

   

    const handleIsfeatured = (e, d) => {
        setIsFeatured(d?.value)
      
    }

    const columns = [
       
        {
            name: 'Product Name',
            selector: (row) => row.name,
            width: '25%'

        },
        {
            name: 'Cost',
            selector: (row) => row.cost,
            width: '12%'

        },
        {
            name: 'Current Price',
            selector: (row) => `£${row.price}`,
            width: '20%'

        },
      
        {
            name: 'Image',
            selector: (row) =>
                <img src={row.productImageUrl} alt="" height={100} width={100} />,
            width: '20%'

        },
        {
            name: 'Inventory',
            selector: (row) => row.inventory,
            width: '15%'
        },
       
    ];
    return (
        <Sidebar.Pushable>


            <div className="page-header">
                <div>
                    <Breadcrumb icon="right angle" sections={sections} />
                    <div className="header-text"> Coupon Details  </div>
                    <div className="sub-text">List of  Coupon Details in application</div>
                </div>



            </div>
            <div >
                <div style={{ margin: "30px" }}>
                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "20px" }}>
                        <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>Coupon Name :-SDLC CORP </p>
                        <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>Coupon Code :- SDLC9900</p>
                        <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>Created To :- 10-11-2023</p>
                        <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>Expire Date :- 20-11-2023</p>

                    </div>
                    <div style={{ marginTop: "20px", display: "flex", gap: "40px" }}>
                        <p style={{ margin: "0", fontWeight: "bold" }}>Coupon Type :- DISCOUNT BY PRICE </p>
                        <p style={{ margin: "0", fontWeight: "bold" }}>Discount :- 100R </p>
                    </div>
                    <div style={{ margin: "30px 0 " }}>
                        <p>Applied To : </p>
                    </div>
                </div>
                <div style={{ overflowX: 'scroll', width: '100%', maxWidth: '100vw', whiteSpace: 'nowrap' }}>
                    <TableWrapper
                        columns={columns}
                        data={product}
                        progressPending={loading}
                        paginationServer
                        paginationTotalRows={TotalRows}
                        onChangeRowsPerPage={(newlimit, page) => {
                            setLimit(newlimit);
                        }}
                        paginationRowsPerPageOptions={
                            [10, 20, 50, 100]
                        }
                        paginationPerPage={limit}
                        onChangePage={(p) => setPage(p)}
                    />
                </div>

            </div>




        </Sidebar.Pushable >
    );
}

export default CouponDetails;
