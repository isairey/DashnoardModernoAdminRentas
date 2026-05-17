import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../slices/productSlice';
import { FiArrowLeft, FiPackage, FiDollarSign, FiToggleLeft, FiToggleRight, FiCheck, FiImage, FiUploadCloud, FiX, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

// ============================================================================
// VENDOR ADD PRODUCT - Clean Enterprise Form
// ============================================================================

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    totalQuantity: 1,
    condition: 'good', // Default to 'good' - matches backend enum
    pricing: {
      daily: '',
      weekly: '',
      monthly: '',
      securityDeposit: '',
    },
    availability: true,
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Handle image file selection
  const handleImageFiles = useCallback((files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 5;

    const newImages = [];
    
    for (const file of files) {
      if (images.length + newImages.length >= maxImages) {
        toast.warning(`Maximum ${maxImages} images allowed`);
        break;
      }
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        continue;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      // Create preview URL and store file
      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
    }
  }, [images.length]);

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleImageFiles(files);
  }, [handleImageFiles]);

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageFiles(files);
    e.target.value = ''; // Reset input
  };

  // Remove image
  const removeImage = (imageId) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  // Set image as primary (move to first position)
  const setAsPrimary = (imageId) => {
    setImages(prev => {
      const index = prev.findIndex(img => img.id === imageId);
      if (index > 0) {
        const newImages = [...prev];
        const [image] = newImages.splice(index, 1);
        newImages.unshift(image);
        return newImages;
      }
      return prev;
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle pricing changes
  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: value,
      },
    }));
    if (errors[`pricing.${name}`]) {
      setErrors(prev => ({ ...prev, [`pricing.${name}`]: '' }));
    }
  };

  // Toggle availability
  const toggleAvailability = () => {
    setFormData(prev => ({ ...prev, availability: !prev.availability }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.pricing.daily || parseFloat(formData.pricing.daily) <= 0) {
      newErrors['pricing.daily'] = 'Daily rent price is required';
    }
    if (formData.totalQuantity < 1) {
      newErrors.totalQuantity = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert images to base64 for upload
      const imageUrls = [];
      
      for (const image of images) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(image.file);
        });
        imageUrls.push(base64);
      }

      // Use default placeholder if no images uploaded
      const finalImages = imageUrls.length > 0 
        ? imageUrls 
        : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'];

      // Construct complete product object for API
      // Note: Backend expects totalQuantity at root level, it builds inventory object itself
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.toLowerCase(),
        condition: formData.condition, // Already lowercase from dropdown
        totalQuantity: parseInt(formData.totalQuantity, 10),
        isActive: true, // New products should be active
        pricing: {
          daily: parseFloat(formData.pricing.daily) || 0,
          weekly: parseFloat(formData.pricing.weekly) || parseFloat(formData.pricing.daily) * 6,
          monthly: parseFloat(formData.pricing.monthly) || parseFloat(formData.pricing.daily) * 25,
          securityDeposit: parseFloat(formData.pricing.securityDeposit) || parseFloat(formData.pricing.daily) * 3,
        },
        images: finalImages,
      };

      // Dispatch to backend API
      await dispatch(createProduct(productData)).unwrap();
      
      // Cleanup image preview URLs
      images.forEach(img => URL.revokeObjectURL(img.preview));
      
      setIsSubmitting(false);
      toast.success('Product added successfully!');
      navigate('/vendor/products');
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error || 'Failed to add product');
    }
  };

  // Format currency display
  const formatCurrency = (value) => {
    if (!value) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Conditions list - must match backend enum: ['new', 'like-new', 'good', 'fair']
  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/vendor/products')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new rental product listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
                <p className="text-xs text-gray-500">Product details and specifications</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sony A7 IV Camera"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product - features, specifications, what's included..."
                  rows={4}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              {/* Category & Condition Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="cameras">Cameras</option>
                    <option value="audio">Audio</option>
                    <option value="tools">Tools</option>
                    <option value="furniture">Furniture</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="transport">Transport</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="sports">Sports</option>
                    <option value="party">Party</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all"
                  >
                    {conditions.map((cond) => (
                      <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity & Availability Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity Available <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                      errors.totalQuantity ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.totalQuantity && <p className="mt-1 text-xs text-red-500">{errors.totalQuantity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Availability Status
                  </label>
                  <button
                    type="button"
                    onClick={toggleAvailability}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm border rounded-lg transition-all ${
                      formData.availability 
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}
                  >
                    <span>{formData.availability ? 'Available for Rent' : 'Not Available'}</span>
                    {formData.availability ? (
                      <FiToggleRight className="w-6 h-6" />
                    ) : (
                      <FiToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiImage className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Product Images</h2>
                <p className="text-xs text-gray-500">Upload up to 5 images (JPEG, PNG, WebP - max 5MB each)</p>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <FiUploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isDragging ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-gray-500">
                or <span className="text-blue-600 hover:underline">browse from your computer</span>
              </p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Images ({images.length}/5)
                  </p>
                  {images.length > 0 && (
                    <p className="text-xs text-gray-500">First image will be the primary image</p>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                        index === 0 ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Primary badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                          Primary
                        </div>
                      )}
                      {/* Hover overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAsPrimary(image.id);
                            }}
                            className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            title="Set as primary"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
                <p className="text-xs text-gray-500">Set your rental rates in INR</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Daily Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Daily <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="daily"
                    value={formData.pricing.daily}
                    onChange={handlePricingChange}
                    placeholder="0"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                      errors['pricing.daily'] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors['pricing.daily'] && <p className="mt-1 text-xs text-red-500">{errors['pricing.daily']}</p>}
              </div>

              {/* Weekly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Weekly
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="weekly"
                    value={formData.pricing.weekly}
                    onChange={handlePricingChange}
                    placeholder={formData.pricing.daily ? String(Math.round(formData.pricing.daily * 6)) : '0'}
                    min="0"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Monthly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Monthly
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="monthly"
                    value={formData.pricing.monthly}
                    onChange={handlePricingChange}
                    placeholder={formData.pricing.daily ? String(Math.round(formData.pricing.daily * 25)) : '0'}
                    min="0"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deposit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.pricing.securityDeposit}
                    onChange={handlePricingChange}
                    placeholder={formData.pricing.daily ? String(Math.round(formData.pricing.daily * 3)) : '0'}
                    min="0"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Price Preview */}
            {formData.pricing.daily && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Price Preview</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700">
                    {formatCurrency(formData.pricing.daily)}/day
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700">
                    {formatCurrency(formData.pricing.weekly || formData.pricing.daily * 6)}/week
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700">
                    {formatCurrency(formData.pricing.monthly || formData.pricing.daily * 25)}/month
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/vendor/products')}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
