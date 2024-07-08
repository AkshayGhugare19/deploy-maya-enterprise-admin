import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Button,
  Dropdown,
  Form,
  Icon,
  Input,
  Modal,
  Sidebar,
} from 'semantic-ui-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TableWrapper from '../../utils/tableWrapper';
import { apiGET, apiPOST } from '../../utils/apiHelper';
import moment from 'moment';
import { SlArrowRight, SlOptionsVertical } from 'react-icons/sl';
import { useContext } from 'react';
import { AuthContext } from '../../contexts';
import Swal from 'sweetalert2';
import { FaFileExport } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import './listUsersReplica.css';
import { RxCross2 } from 'react-icons/rx';

const options = [
  { key: 2, text: 'Admin', value: 'admin' },
  { key: 3, text: 'Employee', value: 'employee' },
];
function listUsersReplica() {
  const navigate = useNavigate();
  let { action } = useParams();
  const [users, setUsers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [exportData, setExportData] = useState([]);
  const [userData, setUserData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
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
  let authContext = useContext(AuthContext);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let responce = await apiGET(
        `/v1/user/get-All-users/?page=${page}&limit=${limit}`
      );
      if (responce.status === 200) {
        setUsers(responce.data.data.data);
        setTotalRows(responce.data.data.totalResults);
        setTotalPage(responce?.data?.data?.totalPages);
      } else if (responce.status === 400) {
        console.log(responce.data.data.message);
      } else {
        console.log(responce.data.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const ExportAllEmails = async () => {
    setLoading(true);
    try {
      let response = await apiGET(`/v1/user/export-email?page=${page}&limit=${limit}`);

      if (response.status === 200) {
        let emailData = response?.data?.data?.data;

        if (Array.isArray(emailData) && emailData.length > 0) {
          let expData = emailData.map((element) => ({ email: element?.email }));
          setExportData(expData);
        } else {
          setExportData([]);
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: response?.data?.data,
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });
      if (confirmResult.isConfirmed) {
        const response = await apiPOST(`/v1/user/admin-delete-user/${id}`);
        if (response.status === 200) {
          Swal.fire('Success', 'User Deleted Successfully', 'success');

          //   setVisible(false);
          getAllUsers();
        } else if (response.status === 400) {
          Swal.fire({
            title: 'Error!',
            text: response?.data?.data,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response?.data?.data,
            icon: 'error',
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [page, limit]);

  useEffect(() => {
    let userLocal = JSON.parse(localStorage.getItem('user'));
    if (userLocal) {
      setUserData(userLocal);
    }
    ExportAllEmails();
  }, [limit, page]);

  const sections = [
    { key: 'Dashboard', content: 'Dashboard', link: true },
    { key: 'User List', content: 'User List', active: true },
  ];
  const columns = [
    // {
    //   name: 'Profile',
    //   selector: (row) => (
    //     <img
    //       style={{ marginTop: '5px' }}
    //       src={row.profilePic}
    //       alt=""
    //       height={35}
    //       width={35}
    //     />
    //   ),
    // },
    {
      name: 'Name',
      selector: (row) => (
        <div>
          {row.fName || '-'} {row.lName || '-'}
        </div>
      ),
    },
    {
      name: 'Phone No.',
      selector: (row) => row.phoneNo || '--',
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'CreatedAt',
      selector: (row) => moment(row.createdAt).format('lll'),
    },
    {
      name: 'Action',
      selector: (row) => (
        <>
          <div>
            <button
              onClick={() => handleDeleteUser(row?._id)}
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

  function exampleReducer(state, action) {
    switch (action.type) {
      case 'close':
        return { open: false };
      case 'open':
        return { open: true, size: action.size };
      default:
        throw new Error('Unsupported action...');
    }
  }

  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
  });

  const { open, size } = state;

  const [addUser, setaddUser] = useState({
    fName: '',
    lName: '',
    email: '',
    password: '',
    role: '',
  });

  const Handlechange = (e, { value }) => {
    setaddUser({ ...addUser, role: value });
  };

  const onClickaddUserbyAdmin = async () => {
    try {
      if (!addUser?.email) {
        Toast.fire({
          title: 'Error!',
          text: 'Please enter email',
          icon: 'error',
        });
        return;
      } else if (addUser?.email) {
        const emailRE =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRE.test(addUser?.email)) {
          Toast.fire({
            title: 'Error!',
            text: 'Please enter valid mail',
            icon: 'error',
          });
          return;
        }
      }
      let pass = addUser.password.trim();
      if (!addUser.password || pass.length == 0) {
        Toast.fire({
          title: 'Error!',
          text: 'Please enter password',
          icon: 'error',
        });
        return;
      }
      if (!addUser?.role) {
        Toast.fire({
          title: 'Error!',
          text: 'Please select role',
          icon: 'error',
        });
        return;
      }
      let payload = {
        fName: addUser.fName,
        lName: addUser.lName,
        email: addUser.email,
        password: addUser.password,
        role: addUser.role,
      };
      setLoading(true);
      const response = await apiPOST('/v1/user/admin-signup-user', payload);

      if (response.status === 200) {
        dispatch({ type: 'close' });
        setaddUser({
          fName: '',
          lName: '',
          email: '',
          password: '',
          role: '',
        });

        Swal.fire('Success!', 'Employee added Successfully', 'success');
        getAllUsers();
      } else {
        dispatch({ type: 'close' });
        Swal.fire(
          'Error!',
          response?.data?.data || 'Something went wrong!',
          'error'
        );
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error',
      });
      dispatch({ type: 'close' });
    } finally {
      setLoading(false);
      dispatch({ type: 'close' });
    }
    setaddUser({
      fName: '',
      lName: '',
      email: '',
      password: '',
      role: '',
    });
  };
  const handleChangeLimit = (event) => {
    setLimit(event.target.value); // Update the selected value when the selection changes
    setPage(1);
  };

  return (
    <>
      {isDesktop ? (
        <div className="desktop-Screen">
          <Modal
            open={open}
            style={{ borderRadius: '15px', maxWidth: '450px' }}
            onClose={() => dispatch({ type: 'close' })}>
            <div style={{ margin: '25px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <strong style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  Add User
                </strong>
                <div>
                  <RxCross2
                    onClick={() => {
                      dispatch({ type: 'close' });
                      setaddUser({
                        fName: '',
                        lName: '',
                        email: '',
                        password: '',
                        role: '',
                      });
                    }}
                    size={25}
                  />
                </div>
              </div>

              <div>
                <div
                  className="page-body"
                  style={{
                    backgroundColor: 'white',
                    justifyContent: 'space-around',
                  }}>
                  <Form style={{ width: '100%' }}>
                    <Form.Field
                      id="form-input-control-first-name"
                      control={Input}
                      label="First name"
                      value={addUser?.fName || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          fName: e.target.value,
                        })
                      }
                      placeholder="First name"
                      style={{ width: '100%' }}
                    />
                    <Form.Field
                      id="form-input-control-last-name"
                      control={Input}
                      label="Last name"
                      placeholder="Last name"
                      value={addUser?.lName || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          lName: e.target.value,
                        })
                      }
                      style={{ width: '100%' }}
                    />

                    <Form.Field
                      id="form-input-control-error-email"
                      control={Input}
                      label="Email"
                      placeholder="joe@schmoe.com"
                      value={addUser?.email || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          email: e.target.value,
                        })
                      }
                      style={{ width: '100%' }}
                    />
                    <Form.Field
                      id="form-input-control-first-name"
                      control={Input}
                      type="password"
                      label="Password"
                      value={addUser?.password || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter password"
                      style={{ width: '100%' }}
                    />
                    <Form.Field
                      id="form-input-control-dropdown"
                      control={Dropdown}
                      fluid
                      selection
                      clearable
                      placeholder="Admin"
                      options={options}
                      label="Select Role"
                      value={addUser?.role}
                      onChange={Handlechange}
                      style={{ width: '100%' }}
                    />

                    <Button
                      onClick={onClickaddUserbyAdmin}
                      style={{
                        backgroundColor: 'rgb(4, 150, 255)',
                        borderRadius: '20px',
                        marginTop: '10px',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'white',
                        }}>
                        <i className="plus icon" />
                        <Button.Content>Create User</Button.Content>
                      </div>
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch({ type: 'close' });
                        setaddUser({
                          fName: '',
                          lName: '',
                          email: '',
                          password: '',
                          role: '',
                        });
                      }}
                      circular
                      style={{ backgroundColor: '#747474', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i class="close icon"></i>
                        Close
                      </div>
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </Modal>
          <div style={{ backgroundColor: '#F4F4F4' }}>
            <Sidebar.Pushable>
              <Sidebar
                style={{
                  width: 700,
                }}
                as={'div'}
                animation="overlay"
                icon="labeled"
                direction="right"
                onHidden={() => navigate('/dashboard/users')}
                vertical={'vertical'}></Sidebar>
              <Sidebar.Pusher className="fadeIn">
                <div className="page-header">
                  <div>
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
                      <BreadcrumbSection active>User List</BreadcrumbSection>
                    </Breadcrumb>
                    <div
                      className="header"
                      style={{ margin: '10px', marginLeft: '0px' }}>
                      <div>
                        <span
                          style={{
                            fontSize: '28px',
                            fontWeight: 600,
                            color: '#000',
                            opacity: 90,
                          }}>
                          {totalRows || 0}
                        </span>
                        <span
                          style={{
                            fontSize: '16px',
                            color: '#000',
                            opacity: 90,
                            marginLeft: '8px',
                            fontWeight: '600',
                          }}>
                          Users
                        </span>
                      </div>
                      <span style={{ fontSize: '14px' }}>
                        List of all Users in application
                      </span>
                    </div>
                  </div>

                  <div className="page-header-actions ">
                    <CSVLink
                      data={exportData}
                      filename={`orders - ${moment().format('lll')}.csv`}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '20px',
                          backgroundColor: 'white',
                        }}
                        className="buttonUi black basic button">
                        <FaFileExport />
                        <div>Export Emails</div>
                      </div>
                    </CSVLink>

                    {userData?.role == 'admin' && (
                      <div className="button-container">
                        <button
                          className="add-product-buttons"
                          style={{ marginTop: '0px' }}
                          onClick={() => {
                            dispatch({ type: 'open', size: 'tiny' });
                            navigate('/dashboard/users/add');
                          }}>
                          <i className="plus icon" />
                          <span className="button-text">Add User</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    overflowX: 'scroll',
                    width: '100%',
                    maxWidth: '100vw',
                    whiteSpace: 'nowrap',
                    borderRadius: '16px 16px 0px 0px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                  }}>
                  <TableWrapper
                    columns={columns}
                    data={users}
                    progressPending={loading}
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={(newlimit, page) => {
                      setLimit(newlimit);
                    }}
                    paginationRowsPerPageOptions={[100, 500, 1000, 10000, totalRows]}
                    paginationPerPage={limit}
                    onChangePage={(p) => setPage(p)}
                  />
                </div>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </div>
        </div>
      ) : (
        <div
          className="mobile-Screen"
          style={{ backgroundColor: '#F4F4F4', minHeight: '100%' }}>
          <Modal
            open={open}
            style={{ borderRadius: '15px', maxWidth: '350px' }}
            onClose={() => dispatch({ type: 'close' })}>
            <div style={{ margin: '25px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <strong style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  Add User
                </strong>
                <div>
                  <RxCross2
                    onClick={() => {
                      dispatch({ type: 'close' });
                      setaddUser({
                        fName: '',
                        lName: '',
                        email: '',
                        password: '',
                        role: '',
                      });
                    }}
                    size={25}
                  />
                </div>
              </div>

              <div>
                <div
                  className="page-body"
                  style={{
                    backgroundColor: 'white',
                    justifyContent: 'space-around',
                  }}>
                  <Form style={{ width: '100%' }}>
                    <Form.Field
                      id="form-input-control-first-name"
                      control={Input}
                      label="First name"
                      value={addUser?.fName || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          fName: e.target.value,
                        })
                      }
                      placeholder="First name"
                      style={{ width: '100%' }}
                    />
                    <Form.Field
                      id="form-input-control-last-name"
                      control={Input}
                      label="Last name"
                      placeholder="Last name"
                      value={addUser?.lName || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          lName: e.target.value,
                        })
                      }
                      style={{ width: '100%' }}
                    />

                    <Form.Field
                      id="form-input-control-error-email"
                      control={Input}
                      label="Email"
                      placeholder="joe@schmoe.com"
                      value={addUser?.email || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          email: e.target.value,
                        })
                      }
                      style={{ width: '100%' }}
                    />
                    <Form.Field
                      id="form-input-control-first-name"
                      control={Input}
                      type="password"
                      label="Password"
                      value={addUser?.password || ''}
                      onChange={(e) =>
                        setaddUser({
                          ...addUser,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter password"
                      style={{ width: '100%' }}
                    />
                    <Form.Field
                      id="form-input-control-dropdown"
                      control={Dropdown}
                      fluid
                      selection
                      clearable
                      placeholder="Admin"
                      options={options}
                      label="Select Role"
                      value={addUser?.role}
                      onChange={Handlechange}
                      style={{ width: '100%' }}
                    />

                    <Button
                      onClick={onClickaddUserbyAdmin}
                      style={{
                        backgroundColor: 'rgb(4, 150, 255)',
                        borderRadius: '20px',
                        marginTop: '10px',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'white',
                        }}>
                        <i className="plus icon" />
                        <Button.Content>Create User</Button.Content>
                      </div>
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch({ type: 'close' });
                        setaddUser({
                          fName: '',
                          lName: '',
                          email: '',
                          password: '',
                          role: '',
                        });
                      }}
                      circular
                      style={{ backgroundColor: '#747474', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i class="close icon"></i>
                        Close
                      </div>
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </Modal>

          <div className="mobile-navigator">
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
              <BreadcrumbSection active>User List</BreadcrumbSection>
            </Breadcrumb>
          </div>
          <div className="header-mobile">
            <div className="totalRows-mobile">
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#000',
                  opacity: 90,
                  minWidth: '10px',
                }}>
                {totalRows || 0}
                <span style={{ fontSize: '14px', opacity: '80%' }}> Users</span>
              </span>
              <span
                style={{ fontSize: '12px', fontWeight: 600, opacity: '70%' }}>
                List of all Users in application
              </span>
            </div>
            <div className="exportEmail-mobile">
              <CSVLink
                data={exportData}
                filename={`orders - ${moment().format('lll')}.csv`}>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    backgroundColor: 'white',
                  }}
                  className="buttonUi black basic button">
                  <FaFileExport />
                  <div>Export Emails</div>
                </div>
              </CSVLink>
            </div>
            <div className="addUser-mobile">
              {userData?.role == 'admin' && (
                <div className="button-container">
                  <button
                    className="add-product-buttons"
                    style={{ marginTop: '0px' }}
                    onClick={() => {
                      dispatch({ type: 'open', size: 'tiny' });
                      navigate('/dashboard/users/add');
                    }}>
                    <i className="plus icon" />
                    <span className="button-text">Add User</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mobile-user">
            {!loading ? (
              <div>
                {users.map((item) => (
                  <div key={item.id} className="user-container">
                    {/* <div className="user-info">
                      <img
                        src={item.profilePic}
                        alt=""
                        height={35}
                        width={35}
                      />
                    </div> */}
                    <div className="user-detail">
                      <div>
                        <span
                          style={{
                            fontWeight: '600',
                            fontSize: '14px',
                            opacity: '80%',
                          }}>
                          {item.email}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: '500',
                            fontSize: '12px',
                            opacity: '70%',
                          }}>
                          {moment(item.createdAt).format('lll')}
                        </span>
                      </div>
                    </div>
                    <div className="userAction-mobile">
                      <button
                        onClick={() => {
                          openModal();
                          setCurrentUser(item);
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
                        width: '150px',
                        border: '1px solid grey',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <div className="modal-btns">
                        <Button
                          className="ui red icon button basic"
                          onClick={() => {
                            handleDeleteUser(currentUser?._id);
                            closeModal();
                          }}>
                          Delete <i className="trash alternate icon"></i>
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
                      <div class="select-container"></div>
                      <select
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                        value={limit}
                        onChange={handleChangeLimit}>
                      <option value="100">100</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                      <option value="10000">10000</option>
                      <option value={totalRows}>{totalRows}</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    <div
                      className=""
                      style={{ marginLeft: '5px', marginRight: '5px' }}>
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
    </>
  );
}
export default listUsersReplica;
