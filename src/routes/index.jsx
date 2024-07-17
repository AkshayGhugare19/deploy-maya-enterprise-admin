import '../styles/loader.css';
import React from 'react';
import { lazy, Suspense } from 'react';
import UserList from '../pages/users/UserList';
import ProductList from '../pages/products/ProductList';
import ProdutEditOrAddInformation from '../pages/products/ProdutEditOrAddInformation';
import CategoriesList from '../pages/categories/CategoriesList';
import BrandLists from '../pages/brands/BrandsList';
import GlobalConfigPage from '../pages/globalConfig/GlobalConfigPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import SlidersPage from '../pages/sliders/SlidersPage';
import BannerPage from '../pages/banner/BannerPage';
import ViewUserDetails from '../pages/users/ViewUserDetails'
import OrderList from '../pages/orders/OrderList';
import OrderDetailsPage from '../pages/orders/OrderDetailsPage';
import EnquiriesList from '../pages/Enquiries/EnquiriesList';
import EnquiriesDetailAndEditPage from '../pages/Enquiries/EnquiriesDetailAndEditPage';
import SubscriberList from '../pages/emailSubscribes/SubscriberList';
import PaymentHistoryList from '../pages/paymentHistory/PaymentHistoryList';

const Login = lazy(() => import('../modules/login'));


const authProtectedRoutes = [
  { path: '/dashboard', component: <DashboardPage /> },
  { path: '/dashboard/users', component: <UserList /> },
  { path: '/dashboard/user/:id', component: <ViewUserDetails /> },
  { path: '/dashboard/products', component: <ProductList /> },
  { path: '/dashboard/product/:id', component: <ProdutEditOrAddInformation /> },
  { path: '/dashboard/categories', component: <CategoriesList /> },
  { path: '/dashboard/brands', component: <BrandLists /> },
  { path: '/dashboard/orders', component: <OrderList /> },
  { path: '/dashboard/enquiries', component: <EnquiriesList /> },
  { path: '/dashboard/subscribers', component: <SubscriberList /> },
  { path: '/dashboard/payment-history', component: <PaymentHistoryList /> },
  { path: '/dashboard/enquiry/:id', component: <EnquiriesDetailAndEditPage /> },
  { path: '/dashboard/order/:id', component: <OrderDetailsPage /> },
  { path: '/dashboard/slider', component: <SlidersPage /> },
  { path: '/dashboard/banner', component: <BannerPage /> },
  { path: '/dashboard/global-config', component: <GlobalConfigPage /> },

];

const publicRoutes = [
  { path: '/login', component: <Login /> },
  { path: '/', component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
