export default function getMenus(user={}) {


const Menus = [

  {
    type: 'menu',
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
  },
  {
    type: 'menu',
    title: 'Users',
    path: '/dashboard/users',
    icon: 'users',
  },
  {
    type: 'menu',
    title: 'Products',
    path: '/dashboard/products',
    icon: 'box',
  },
  {
    type: 'menu',
    title: 'Category',
    path: '/dashboard/categories',
    icon: 'calendar alternate',
  },
  {
    type: 'menu',
    title: 'Brands',
    path: '/dashboard/brands',
    icon: 'tags',
  },
  {
    type: 'menu',
    title: 'Orders',
    path: '/dashboard/orders',
    icon: 'shoping cart',
  },
  {
    type: 'menu',
    title: 'Enquiries',
    path: '/dashboard/enquiries',
    icon: 'envelope',
  },
  {
    type: 'menu',
    title: 'Subscribers',
    path: '/dashboard/subscribers',
    icon: 'users',
  },
  {
    type: 'menu',
    title: 'Payment History',
    path: '/dashboard/payment-history',
    icon: 'users',
  },
  {
    type: 'menu',
    title: 'Slider',
    path: '/dashboard/slider',
    icon: 'images icon',
  },
  {
    type: 'menu',
    title: 'Banner',
    path: '/dashboard/banner',
    icon: 'image',
  },
  {
    type:'menu',
    title:'Global Config',
    path:'/dashboard/global-config',
    icon:'settings'
  },
];

const employeeMenu = [

  
  {
    type: 'menu',
    title: 'Products',
    path: '/dashboard/products',
    icon: 'money bill alternate outline',
  },
  

  {
    type: 'menu',
    title: 'Category',
    path: '/dashboard/categories',
    icon: 'calendar alternate',
  },
 

 
  {
    type: 'menu',
    title: 'Users',
    path: '/dashboard/users',
    icon: 'user circle',
  },
  // {
  //   type: 'menu',
  //   title: 'Sales Overview',
  //   path: '/dashboard/sales-Overview',
  //   icon: 'first order',
  // },
  // {
  //   type: 'menu',
  //   title: 'Traffic Overview',
  //   path: '/dashboard/traffic-Overview',
  //   icon: 'first order',
  // },
  {
    type:'menu',
    title:'Settings',
    path:'/dashboard/setting',
    icon:'setting'
  }
];

if (user.role == "admin") {
  return Menus
}
else{
  return employeeMenu
}

}
