import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { Button, Icon, Image } from 'semantic-ui-react';
import { TbLogout } from "react-icons/tb";
import getMenus from './menu';
import ResponsiveSidebar from './responsiveSidebar';
import imgLogo from "../assets/images/MAYAENTERPRISE.png"
import { toast } from 'react-toastify';

function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDetails, setUserDetails] = useState();
  const authContext = useContext(AuthContext);
  const { collapseSidebar, collapsed } = useProSidebar();
  const [selectedComponent, setSelectedComponent] = useState('');

  const handleButtonClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const MenuData = getMenus(authContext.user);
  console.log("KKK",collapsed);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("user"));
    setUserDetails(users);
  }, []);

  const useCurrentPageTitle = () => {
    const currentPage = MenuData.find(menu => {
      // Check for an exact match for 'Dashboard' path
      if (menu.title === 'Dashboard') {
        return location.pathname === menu.path;
      }
      // For other paths, use includes
      return location.pathname.includes(menu.path);
    });

    return currentPage ? currentPage.title : "";
  };

  useEffect(() => {
    const handleResize = () => {
      const sidebarWrapper = document.querySelector('.sidebar-wrapper');
      if (sidebarWrapper) {
        sidebarWrapper.classList.toggle('hidden', window.innerWidth <= 768);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Call handleResize initially

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout-wrapper" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
          <Sidebar
            backgroundColor="white"
            width="270px"
            style={{ maxWidth: '270px', borderRight: '1px solid #D4D4D4', height: '100%' }}
          >
            <div
              className="sidebar-headerr sticky top-0 bg-white z-10"
              style={{
                alignItems: 'center',
                padding: '20px 20px',
              }}
            >
              {collapsed ? (
                <span className='font-bold text-2xl text-[#14967F]'>M</span>
              ) : (
                <img src={imgLogo} />
              )}
            </div>
            <Menu user={authContext.user}>
              {MenuData.map((aMenu, idx) =>
                aMenu.type === 'label' ? (
                  !collapsed ? (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 30px 5px 30px',
                        color: '#14967F',
                        fontWeight: 'bold',
                      }}
                    >
                      {aMenu.title}
                    </div>
                  ) : null
                ) : aMenu.type === 'menu' ? (
                  <MenuItem
                    key={idx}
                    style={{
                      background: (location.pathname.includes(aMenu.path) && aMenu.path !== '/dashboard') ||
                        (location.pathname === '/dashboard' && aMenu.path === location.pathname)
                        ? '#3098ff'
                        : '',
                      color: (location.pathname.includes(aMenu.path) && aMenu.path !== '/dashboard') ||
                        (location.pathname === '/dashboard' && aMenu.path === location.pathname)
                        ? 'white'
                        : 'black',
                    }}
                    onClick={() => {
                      if (
                        localStorage.getItem('orderDetail') ||
                        localStorage.getItem('orderNo') ||
                        localStorage.getItem('sort') ||
                        localStorage.getItem('productDetail') ||
                        localStorage.getItem('inventoryName') ||
                        localStorage.getItem('productName')
                      ) {
                        localStorage.removeItem('orderDetail');
                        localStorage.removeItem('orderNo');
                        localStorage.removeItem('productName');
                        localStorage.removeItem('productDetail');
                        localStorage.removeItem('inventoryName');
                        localStorage.removeItem('sort');
                      }
                      navigate(aMenu.path);
                    }}
                  >
                    <Icon
                      bordered={false}
                      name={aMenu.icon}
                      style={{
                        padding: '0 10px 0 0',
                        color: location.pathname.includes(aMenu.path) ? 'white' : '#969696',
                      }}
                    ></Icon>
                    {aMenu.title}
                  </MenuItem>
                ) : null
              )}
            </Menu>
          </Sidebar>
        </div>
        {userDetails && (
          <div className='border p-4'>
          <div className="flex items-center  space-x-2">
            <Icon name="user circle" size="large" />
            {collapsed?"":
            <div>
              <div className="font-semibold">{userDetails?.name}</div>
              <div className="text-gray-600">{userDetails?.email}</div>
            </div>}
          </div>
        </div>
        
        )}
      </div>
      <div
        style={{
          width: '100%',
          overflowY: 'auto',
          minHeight: '100%',
          position: 'relative',
          flex: '1',
        }}
      >
        <div
          className="header-content"
          style={{
            minHeight: 60,
            background: 'white',
            borderBottom: '1px solid #efefef',
            display: 'flex',
            padding: '12px 24px',
            gap: '12px',
            position: 'sticky',
            top: 0,
            flexWrap: 'wrap',
            alignItems: 'center',
            zIndex: 3,
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px 0 #969696',
          }}
        >
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              className="hamberger"
              onClick={() => {
                collapseSidebar();
              }}
            >
              <Icon name="bars" size="large"></Icon>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 600 }}>
              {MenuData?.length ? useCurrentPageTitle() : ''}
            </div>
          </div>
          <Button
            onClick={() => {
              authContext.signout(() => { });
              toast.success("Logout Successfully")
            }}
            basic
            style={{ color: 'red', backgroundColor: '#F4F4F4' }}
          >
            <Button.Content
              visible
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <TbLogout style={{ width: '2em', height: '1em' }} /> Logout
            </Button.Content>
            <Button.Content hidden>
              <Icon name="log out" />
            </Button.Content>
          </Button>
        </div>

        <ResponsiveSidebar />

        <Outlet
          id="appContent"
          className="appContent"
          style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
}

export default SidebarLayout;
