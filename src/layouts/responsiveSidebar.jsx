import { useContext, useState } from 'react';

import { AuthContext } from '../contexts';
import getMenus from './menu';
import { Icon } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResponsiveSidebar() {
  let authContext = useContext(AuthContext);
  const MenuData = getMenus(authContext.user);
  console.log('MenuData', MenuData);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div
        className="display-sidebar invisibleScrollBar"
        style={{ whiteSpace: 'nowrap', width: '100%', overflowX: 'auto',backgroundColor:'#F4F4F4' }}>
        <div style={{ display: 'flex',  flexWrap: 'nowrap' }}>
          {MenuData.map((aMenu, idx) =>
            aMenu.type === 'menu' ? (
              <div
                key={idx}
                className="sidebar-buttons"   
                onClick={() => {
                  if (
                    localStorage.getItem('orderDetail') ||
                    localStorage.getItem('orderNo') || localStorage.getItem('sort') ||   localStorage.removeItem('productDetail') || localStorage.removeItem('inventoryName') || localStorage.removeItem('productName')
                  ) {
                    localStorage.removeItem('orderDetail');
                    localStorage.removeItem('orderNo');
                    localStorage.removeItem('productName');
                    localStorage.removeItem('producDetail');
                    localStorage.removeItem('inventoryName');
                    localStorage.removeItem('sort');
                  }
                  navigate(aMenu.path);
                }}
                style={{
                  backgroundColor:
                    (location.pathname.includes(aMenu.path) &&
                      aMenu.path !== '/dashboard') ||
                    (location.pathname === '/dashboard' &&
                      aMenu.path === location.pathname)
                      ? '#0496FF'
                      : 'white',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '5px',
                  }}>
                  <Icon
                    bordered={false}
                    name={aMenu.icon}
                    style={{
                      padding: '0 10px 20px 10px',
                      color:
                        location.pathname === aMenu.path ||
                        (location.pathname === '/dashboard' &&
                          aMenu.path === location.pathname)
                          ? 'white'
                          : '#969696',
                    }}
                  />
                  <span
                    style={{
                      marginLeft: '8px',
                      color:
                        location.pathname === aMenu.path ||
                        (location.pathname === '/dashboard' &&
                          aMenu.path === location.pathname)
                          ? 'white'
                          : '#969696',
                    }}>
                    {aMenu.title}
                  </span>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}

export default ResponsiveSidebar;
