import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiGET, objectToQueryParam } from '../utils/apiHelper';
import TableWrapper from '../utils/tableWrapper';
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Input } from 'semantic-ui-react';

const CategoryProductDetails = () => {
    const [loading, setLoading] = useState(false);
    const [CategoryproductByid, setCategoryproductByid] = useState();
    const [categoryname, setcategoryname] = useState([]);

    const [name, setName] = useState('');
    const { id } = useParams();


    const getCategoryproductByid = async () => {
      try {
          setLoading(true);
          const payload = {
            filter: {
              name: name,
            }
          }

          let url
          const queryParams = objectToQueryParam(payload)
          
           if(name){
            url = `/v1/order/get-products-by-category/${id}?${queryParams}`

           }else{

             url = `/v1/order/get-products-by-category/${id}`
           }
          
          let response = await apiGET(url)


          // const response = await apiGET(`/v1/order/get-products-by-category/${id}`);
    
          if (response?.data?.code === 200) {
            setLoading(false);

            setCategoryproductByid(response?.data?.data);
          }
        } catch (error) {
          console.error('Error fetching coupon by id:', error);
        }
      };

      
      const brandColumns = [
        {
          name: 'Image',
          selector: (item) => <img src={item?.productImage} height={60} width={60}/> ,
          width: '20%',
          },
        {
          name: 'Product Name',
          selector: (item) => item?.productName,
          width: '30%',
        },
        {
          name: 'Quantity',
          selector: (item) => item?.totalQuantity,
          width: '20%',
        },
        {
          name: 'Gross Sales',
          selector: (item) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0
          }).format(item?.totalSales),
          width: '30%',
        },
      ];

      
      useEffect(() => {
        getCategoryproductByid();
        }, [name]);

        // useEffect(() => {
          
        //   const names= CategoryproductByid?.map((item)=>
        //     item.categoryName ? item.categoryName.map(category => category.name) : []
        //   );
        //   setcategoryname(names);
        //   }, [name]);
          
  return<>
  <div className="fadeIn" style={{ overflow: 'auto', backgroundColor: '#F4F4F4' }}>
      <div className="page-header" style={{ border: 'none', flexWrap: 'wrap', gap: '16px' }}></div>
      <div className='itemSalesReportheader'>

          <Breadcrumb size={'small'} style={{ fontSize: '14px', fontWeight: 600 }}>
            <BreadcrumbSection to="/dashboard/" style={{ color: '#0496FF' }}>
              Dashboard
            </BreadcrumbSection>
            <BreadcrumbDivider icon="right chevron" />
            <BreadcrumbSection to="/dashboard/reports" style={{ color: '#0496FF' }}>
              Report
            </BreadcrumbSection>
            <BreadcrumbDivider icon="right chevron" />
            <BreadcrumbSection to="/dashboard/reports/sales-overview" style={{ color: '#0496FF' }}>
              Sales Overview
            </BreadcrumbSection>
            <BreadcrumbDivider icon="right chevron" />
            <BreadcrumbSection active>Sales by Brand</BreadcrumbSection>
          </Breadcrumb>
        </div>
      
        
        <div className='itemSalesReportheader'>
        <div>
          <div className="salesOverviewHeading" style={{paddingBottom:'10px'}}>
            <div style={{ fontSize: '24px' }}>
              <strong>Sales by Brand</strong>
            </div>
          
            <div>
                <Input
                style={{marginRight:'10px',marginLeft:'10px'}}
                  icon="search"
                  onChange={(e) => setName(e?.target?.value)}
                  placeholder="Search..."
                  className="searchInputSmalldevice"
                  type="search"
                />
              
              </div>
          </div>
        </div>
      
      </div>
          <TableWrapper
            columns={brandColumns}
            data={CategoryproductByid}
            progressPending={loading}
            paginationServer
            pagination={false}
            onRowClicked={(rowData) => {
              onClickViewDocuments(rowData);
            }}
            // onChangeRowsPerPage={(newLimit, newPage) => {
            //   setLimit(newLimit);
            //   setPage(newPage);
            // }}
            // paginationRowsPerPageOptions={[10, 20, 50, 100]}
            // paginationPerPage={limit}
            // onChangePage={(newPage) => {
            //   setPage(newPage);
            // }}
            highlightOnHover
          />
            </div>

  </>
}

export default CategoryProductDetails
