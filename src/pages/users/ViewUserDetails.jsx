import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGET } from '../../utils/apiHelper';
import {
  Card,
  Icon,
  Button,
  Segment,
  Header,
  List,
  Divider,
} from 'semantic-ui-react';

const ViewUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('address');
  const [isLoading, setIsLoading] = useState(true);
  const [prescription, setPrescription] = useState([]);
  const [address, setAddress] = useState([]);

  const getUserDetail = async () => {
    try {
      const response = await apiGET(`/v1/users/${id}`);
      setUserDetails(response?.data?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setIsLoading(false);
    }
  };

  const getAddressOfUser = async () => {
    try {
      const response = await apiGET(`/v1/address/getAddress/${id}`);
      setAddress(response?.data?.data);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const getPrescription = async () => {
    try {
      const response = await apiGET(
        `/v1/prescription/get-prescription-by-user/${id}`
      );
      setPrescription(response?.data?.data?.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  useEffect(() => {
    getUserDetail();
    getPrescription();
    getAddressOfUser();
  }, [id]);

  if (isLoading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="p-6">
      <Header as="h2" textAlign="left" className="mb-6">
        User Details
      </Header>
      <div className="flex flex-col gap-4">
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <div className="flex space-x-20 items-center">
            <img
              src={userDetails?.profilePic }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            
            <div>
            <div className="text-2xl font-semibold ">
              {userDetails?.name}
            </div>
            <div className="text-gray-600 ">
              Joined in{' '}
              {userDetails ? new Date(userDetails.createdAt).getFullYear() : '2023'}
            </div>
            <hr className='mt-1 border border-1'/>
            <List className="w-full text-left">
              <List.Item className="flex items-center ">
                <Icon name="mail" className="mr-2" />
                {userDetails?.email }
              </List.Item>
              <List.Item className="flex items-center ">
                <Icon name="phone" className="mr-2" />
                {userDetails?.phoneNo }
              </List.Item>
              <List.Item className="flex items-center ">
                <Icon name="user" className="mr-2" />
                {userDetails?.role }
              </List.Item>
            </List>
            </div>
            
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border">
          <div className="mb-4 border-b border-gray-200">
            <nav className="flex space-x-4">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'address' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('address')}
              >
                Address
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'prescription' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('prescription')}
              >
                Prescription
              </button>
            </nav>
          </div>

          {activeTab === 'address' && (
            <List>
              {address?.length === 0 ? (
                <List.Item>No address available</List.Item>
              ) : (
                address.map((addr) => (
                  <List.Item
                    key={addr?._id}
                    className="p-4 mb-4 bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center p-4">
                      <div>
                        <h3 className="text-lg font-semibold">{addr?.Name}</h3>
                        <p className="text-gray-600">
                          <strong>Country:</strong> {addr?.country}
                        </p>
                        <p className="text-gray-600">
                          <strong>Address Line 1:</strong> {addr?.addressLine1}
                        </p>
                        {addr?.addressLine2 && (
                          <p className="text-gray-600">
                            <strong>Address Line 2:</strong> {addr?.addressLine2}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <strong>City/State/Zip:</strong> {`${addr?.city}, ${addr?.state}, ${addr?.zip}`}
                        </p>
                        <p className="text-gray-600">
                          <strong>Created At:</strong> {new Date(addr?.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </List.Item>
                ))
              )}
            </List>
          )}

          {activeTab === 'prescription' && (
            <div className="flex flex-wrap gap-6">
              {prescription?.length === 0 ? (
                <p>No prescriptions available</p>
              ) : (
                prescription.map((presc) => (
                  <div key={presc?._id} className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{presc?.title}</h3>
                        <p className="text-gray-600">
                          <strong>Created At:</strong> {new Date(presc?.createdAt).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          <strong>Type:</strong> {presc?.type}
                        </p>
                        <p className="text-gray-600">
                          <strong>Duration:</strong> {presc?.durationUnit}
                        </p>
                        <p className="text-gray-600">
                          <strong>Duration Of Dosage:</strong> {presc?.durationOfDosage}
                        </p>
                        <p className="text-gray-600">
                          <strong>Prescription Image:</strong>
                          <a
                            href={presc?.prescriptionImgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline ml-1"
                          >
                            View Image
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;
