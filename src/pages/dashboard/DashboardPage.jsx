import React, { useEffect, useState } from 'react';
import { Card, Statistic, Grid, Container, Divider, Segment } from 'semantic-ui-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiGET } from '../../utils/apiHelper';
import Loader from '../../components/loader/Loader';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null);
  const [loading,setLoading] = useState(false);

  const getDashboardData = async () => {
    setLoading(true)
    try {
      const response = await apiGET(`/v1/dashboard/all-collection-count`);
      if (response?.data?.status) {
        setDashboardData(response?.data?.data);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false)
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) return <Loader/>

  return (
    <Container fluid style={{ marginTop: '20px', padding: '0 20px' }}>
      <Grid columns={4} stackable divided>
        <Grid.Row>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content onClick={()=>navigate("/dashboard/users")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.userCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#8884d8' }}>Users</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content onClick={()=>navigate("/dashboard/products")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.productCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#ffc658' }}>Products</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content onClick={()=>navigate("/dashboard/categories")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.categoryCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#0088FE' }}>Category</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content  onClick={()=>navigate("/dashboard/brands")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.brandCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#00C49F' }}>Brands</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content  onClick={()=>navigate("/dashboard/orders")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.orderCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#82ca9d' }}>Orders</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content onClick={()=>navigate("/dashboard/slider")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.sliderCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#FFBB28' }}>Sliders</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          <Grid.Column>
            {dashboardData && (
              <Card className='shadow-lg' fluid>
                <Card.Content  onClick={()=>navigate("/dashboard/banner")} className='cursor-pointer'>
                  <Statistic>
                    <Statistic.Value>{dashboardData.bannerCount}</Statistic.Value>
                    <Statistic.Label style={{ color: '#ff7300' }}>Banner</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
          {/* <Grid.Column>
            <Card className='shadow-lg' fluid>
              <Card.Content>
                <Statistic>
                  <Statistic.Value>10</Statistic.Value>
                  <Statistic.Label style={{ color: '#FF8042' }}>Invoice</Statistic.Label>
                </Statistic>
              </Card.Content>
            </Card>
          </Grid.Column> */}
        </Grid.Row>
      </Grid>
      <Divider section />
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column>
            {dashboardData && <MonthlyDataInfoChart dashboardData={dashboardData} />}
          </Grid.Column>
          <Grid.Column>
            <MonthlyEarnings />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider section />
    </Container>
  );
};

const MonthlyEarnings = () => {
  const earnings = {
    weeklyEarning: 29.5,
    percentageChange: -31.08,
    first15Days: -40.56,
    last15Days: -30.56,
  };

  return (
    <Segment className='w-full'>
      <h3 className='text-xl mb-4'>Monthly Earning</h3>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Monthly Earning</h2>
          <div className="flex space-x-2">
            <button className="px-2 py-1 bg-blue-500 text-white rounded">Weekly</button>
            <button className="px-2 py-1 bg-gray-200 rounded">Monthly</button>
          </div>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-md">This Week</h3>
          <h1 className="text-2xl font-bold">${earnings.weeklyEarning}</h1>
          <p className={`text-md ${earnings.percentageChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {earnings.percentageChange}% From Previous week
          </p>
        </div>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-lg">{earnings.first15Days}%</p>
            <p className="text-gray-500">1st 15 days Analytics</p>
          </div>
          <div className="text-center">
            <p className="text-lg">{earnings.last15Days}%</p>
            <p className="text-gray-500">Last 15 days Analytics</p>
          </div>
        </div>
      </div>
    </Segment>
  );
};
const camelCaseToWords = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
};

const MonthlyDataInfoChart = ({ dashboardData }) => {
  const colors = {
    userCount: '#8884d8',
    orderCount: '#82ca9d',
    productCount: '#ffc658',
    bannerCount: '#ff7300',
    categoryCount: '#0088FE',
    brandCount: '#00C49F',
    sliderCount: '#FFBB28',
    prescriptionCount: '#FF8042',
  };

  const data = Object.keys(dashboardData).map(key => ({
    name: camelCaseToWords(key),
    count: dashboardData[key],
    fill: colors[key] || '#8884d8',
  }));

  return (
    <Segment className='w-full'>
      <h3 className='text-xl mb-4'>Monthly Summary</h3>
      <div style={{ width: '100%' }}>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {data.map((entry, index) => (
              <Bar key={index} dataKey="count" fill={entry.fill} name={entry.name} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Segment>
  );
};

export default DashboardPage;
