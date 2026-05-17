import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../../slices/authSlice';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiSave,
  FiX,
  FiShield,
  FiCalendar,
  FiBriefcase,
} from 'react-icons/fi';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      setNotification({ show: true, type: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
      dispatch(reset());
    }
    if (isError) {
      setNotification({ show: true, type: 'error', message: message || 'Failed to update profile' });
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
    };
    dispatch(updateProfile(updateData));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || '',
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return 'bg-purple-100 text-purple-700';
      case 'vendor':
        return 'bg-blue-100 text-blue-700';
      case 'customer':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`p-4 rounded-lg ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-gray-600">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                <FiShield className="w-3.5 h-3.5" />
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {formatDate(user?.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiMail className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>
            </div>
            {user?.role === 'vendor' && user?.vendorInfo && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FiBriefcase className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Business Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.vendorInfo?.businessName || 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiEdit3 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-2.5">{user?.name || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-2.5">{user?.phone || 'N/A'}</p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <p className="text-gray-900 py-2.5">{user?.address?.street || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="City"
                    />
                  ) : (
                    <p className="text-gray-900 py-2.5">{user?.address?.city || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">State/Province</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="State"
                    />
                  ) : (
                    <p className="text-gray-900 py-2.5">{user?.address?.state || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">ZIP/Postal Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="ZIP Code"
                    />
                  ) : (
                    <p className="text-gray-900 py-2.5">{user?.address?.zipCode || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Country"
                    />
                  ) : (
                    <p className="text-gray-900 py-2.5">{user?.address?.country || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Vendor-specific Info */}
      {user?.role === 'vendor' && user?.vendorInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Business Name</p>
              <p className="text-gray-900 font-medium">{user?.vendorInfo?.businessName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Approval Status</p>
              <p className="text-gray-900">
                {user?.vendorInfo?.isApproved ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pending Approval
                  </span>
                )}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs text-gray-500 mb-1">Business Description</p>
              <p className="text-gray-900">{user?.vendorInfo?.businessDescription || 'No description provided'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
