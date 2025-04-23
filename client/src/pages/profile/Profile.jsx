import React, { useState, useEffect } from 'react';
import { Form, Card, Row, Col, Typography, Button, message, Avatar } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import ProfileEditForm from './ProfileEditForm';

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user: currentUser } = useAuth();

  // Country code and ISD code options
  const countryCodeOptions = [
    { value: 'IN', label: 'India (+91)' },
    { value: 'US', label: 'USA (+1)' },
    { value: 'GB', label: 'UK (+44)' },
    { value: 'JP', label: 'Japan (+81)' },
    { value: 'CN', label: 'China (+86)' },
    { value: 'DE', label: 'Germany (+49)' },
    { value: 'FR', label: 'France (+33)' },
    { value: 'IT', label: 'Italy (+39)' },
    { value: 'ES', label: 'Spain (+34)' },
    { value: 'BR', label: 'Brazil (+55)' },
    { value: 'RU', label: 'Russia (+7)' },
    { value: 'AU', label: 'Australia (+61)' },
    { value: 'CA', label: 'Canada (+1)' },
    { value: 'MX', label: 'Mexico (+52)' },
    { value: 'ZA', label: 'South Africa (+27)' },
  ];

  const isdCodeOptions = [
    { value: '91', label: '+91' },
    { value: '1', label: '+1' },
    { value: '44', label: '+44' },
    { value: '81', label: '+81' },
    { value: '86', label: '+86' },
    { value: '49', label: '+49' },
    { value: '33', label: '+33' },
    { value: '39', label: '+39' },
    { value: '34', label: '+34' },
    { value: '55', label: '+55' },
    { value: '7', label: '+7' },
    { value: '61', label: '+61' },
    { value: '52', label: '+52' },
    { value: '27', label: '+27' },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.auth.getTenants();
      // Find the current user's data from the tenants list using tenant_id
      const currentUserData = response.data.find(
        tenant => tenant.tenant_id === currentUser.tenant_id
      );

      if (currentUserData) {
        setUserData(currentUserData);
        form.setFieldsValue({
          name: currentUserData.name,
          email: currentUserData.root_email,
          logo_url: currentUserData.logo_url,
          address_line_1: currentUserData.address?.address_line_1 || '',
          address_line_2: currentUserData.address?.address_line_2 || '',
          city: currentUserData.address?.city || '',
          state: currentUserData.address?.state || '',
          country: currentUserData.address?.country || '',
          zip_code: currentUserData.address?.zip_code || '',
          country_code: currentUserData.contact_number?.country_code || '',
          isd_code: currentUserData.contact_number?.isd_code || '',
          number: currentUserData.contact_number?.number || '',
        });
        if (currentUserData.logo_url) {
          setProfileImage(currentUserData.logo_url);
        }
      } else {
        message.error('User data not found');
      }
    } catch (error) {
      message.error('Failed to fetch profile data');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      message.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error setting profile picture:', error);
      message.error('Failed to set profile picture. Please try again.');
      // Revert to previous image if setting fails
      if (userData?.logo_url) {
        setProfileImage(userData.logo_url);
      }
    }
    return false; // Prevent default upload behavior
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare the payload according to the API structure
      const payload = {
        name: values.name,
        logo_url: values.logo_url,
        address: {
          address_line_1: values.address_line_1,
          address_line_2: values.address_line_2,
          city: values.city,
          state: values.state,
          country: values.country,
          zip_code: values.zip_code
        },
        contact_number: {
          country_code: values.country_code,
          isd_code: values.isd_code,
          number: values.number
        }
      };

      // Make the API call
      const response = await apiService.auth.updateTenant(payload);

      if (response.success) {
        message.success('Profile updated successfully');
        setIsEditing(false);
        fetchUserProfile(); // Refresh the data
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileView = () => (
    <div className="space-y-6 sm:p-4">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <UserOutlined className="text-4xl sm:text-5xl text-gray-400" />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <Title level={2} className="text-2xl sm:text-3xl">{userData?.name}</Title>
          <Text type="secondary" className="text-base sm:text-lg">{userData?.root_email}</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <Card title="Basic Information" className="h-full">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Text strong className="text-base sm:text-lg">Name:</Text>
              <Text className="text-base sm:text-lg break-all">{userData?.name}</Text>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Text strong className="text-base sm:text-lg">Email:</Text>
              <Text className="text-base sm:text-lg break-all">{userData?.root_email}</Text>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Text strong className="text-base sm:text-lg">Logo:</Text>
              {userData?.logo_url ? (
                <Avatar
                  src={userData.logo_url}
                  size={72} 
                  shape="circle"
                  className="mt-2 sm:mt-0"
                />
              ) : (
                <Text className="text-base sm:text-lg text-gray-500 mt-2 sm:mt-0">No logo</Text>
              )}
            </div>
          </div>
        </Card>

        <Card title="Contact Information" className="h-full">
          <div className="space-y-3 sm:space-y-4">
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Text strong className="text-base sm:text-lg">Country Code:</Text>
              <Text className="text-base sm:text-lg">{userData?.contact_number?.country_code || 'N/A'}</Text>
            </div> */}
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Text strong className="text-base sm:text-lg">ISD Code:</Text>
              <Text className="text-base sm:text-lg">{userData?.contact_number?.isd_code ? `+${userData.contact_number.isd_code}` : 'N/A'}</Text>
            </div> */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Text strong className="text-base sm:text-lg">Phone Number:</Text>
              <Text className="text-base sm:text-lg">{userData?.contact_number?.number}</Text>
            </div>
          </div>
        </Card>

        <Card title="Address" className="h-full lg:col-span-2">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Text strong className="text-base sm:text-lg min-w-[120px]">Address Line 1:</Text>
              <Text className="text-base sm:text-lg break-all">{userData?.address?.address_line_1}</Text>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Text strong className="text-base sm:text-lg min-w-[120px]">Address Line 2:</Text>
              <Text className="text-base sm:text-lg break-all">{userData?.address?.address_line_2}</Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Text strong className="text-base sm:text-lg min-w-[120px]">City:</Text>
                <Text className="text-base sm:text-lg">{userData?.address?.city}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Text strong className="text-base sm:text-lg min-w-[120px]">State:</Text>
                <Text className="text-base sm:text-lg">{userData?.address?.state}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Text strong className="text-base sm:text-lg min-w-[120px]">Country:</Text>
                <Text className="text-base sm:text-lg">{userData?.address?.country}</Text>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Text strong className="text-base sm:text-lg min-w-[120px]">ZIP Code:</Text>
                <Text className="text-base sm:text-lg">{userData?.address?.zip_code}</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-8 min-h-screen">
      <Card
        title="Profile"
        className="max-w-8xl mx-auto w-full"
        bodyStyle={{ padding: '16px' }}
        extra={
          !isEditing ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              Edit Profile
            </Button>
          ) : null
        }
      >
        {isEditing ? (
          <ProfileEditForm
            form={form}
            loading={loading}
            profileImage={profileImage}
            handleImageUpload={handleImageUpload}
            onFinish={onFinish}
            setIsEditing={setIsEditing}
            countryCodeOptions={countryCodeOptions}
            isdCodeOptions={isdCodeOptions}
          />
        ) : (
          renderProfileView()
        )}
      </Card>
    </div>
  );
};

export default Profile; 