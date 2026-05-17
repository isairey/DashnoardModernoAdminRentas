import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getCategories } from '../../slices/productSlice';
import {
  FiSearch,
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiShield,
  FiClock,
  FiStar,
  FiHeart,
  FiGrid,
  FiBox,
  FiCamera,
  FiTool,
  FiMusic,
  FiMonitor,
  FiHome as FiHomeIcon,
  FiZap,
} from 'react-icons/fi';

// ============================================================================
// ENTERPRISE HOME PAGE - Clean SaaS Design
// ============================================================================

// Skeleton Components
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-100 rounded animate-pulse w-20" />
        <div className="h-8 bg-gray-100 rounded animate-pulse w-16" />
      </div>
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-lg">
    <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" />
    <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
  </div>
);

// Category Icons Mapping
const categoryIcons = {
  electronics: FiMonitor,
  tools: FiTool,
  cameras: FiCamera,
  audio: FiMusic,
  furniture: FiHomeIcon,
  sports: FiZap,
  party: FiBox,
  default: FiGrid,
};

// Stats Data
const stats = [
  { value: '10K+', label: 'Products' },
  { value: '50K+', label: 'Customers' },
  { value: '100K+', label: 'Rentals' },
  { value: '4.9', label: 'Rating' },
];

// Features Data
const features = [
  {
    icon: FiShield,
    title: 'Secure Payments',
    description: 'All transactions protected with enterprise-grade security',
  },
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Same-day delivery available in select locations',
  },
  {
    icon: FiClock,
    title: 'Flexible Duration',
    description: 'Rent for a day, week, or month — your choice',
  },
  {
    icon: FiStar,
    title: 'Quality Assured',
    description: 'Every product verified and maintained to standards',
  },
];

// Dummy Categories (fallback) - matching Products.jsx categories
const defaultCategories = [
  { id: 'Electronics', name: 'Electronics', icon: 'electronics' },
  { id: 'Cameras', name: 'Cameras', icon: 'cameras' },
  { id: 'Tools', name: 'Tools', icon: 'tools' },
  { id: 'Audio', name: 'Audio', icon: 'audio' },
  { id: 'Furniture', name: 'Furniture', icon: 'furniture' },
  { id: 'Outdoor', name: 'Outdoor', icon: 'sports' },
  { id: 'Transport', name: 'Transport', icon: 'default' },
  { id: 'Other', name: 'Other', icon: 'default' },
];

// Dummy Products (fallback)
const dummyProducts = [
  {
    _id: '1',
    name: 'Sony A7 IV Camera',
    description: 'Professional mirrorless camera with 33MP full-frame sensor',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    pricing: { daily: 2500 },
    ratings: { average: 4.9, count: 128 },
    category: 'cameras',
  },
  {
    _id: '2',
    name: 'MacBook Pro 16"',
    description: 'M3 Pro chip, 18GB RAM, 512GB SSD',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    pricing: { daily: 3500 },
    ratings: { average: 4.8, count: 96 },
    category: 'electronics',
  },
  {
    _id: '3',
    name: 'DJI Mavic 3 Pro',
    description: 'Professional drone with 4/3 CMOS Hasselblad camera',
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    pricing: { daily: 4500 },
    ratings: { average: 4.9, count: 74 },
    category: 'electronics',
  },
  {
    _id: '4',
    name: 'Canon RF 70-200mm',
    description: 'Professional telephoto lens f/2.8L IS USM',
    images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400'],
    pricing: { daily: 1800 },
    ratings: { average: 4.7, count: 52 },
    category: 'cameras',
  },
  {
    _id: '5',
    name: 'JBL PartyBox 710',
    description: 'Powerful party speaker with 800W output and lights',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'],
    pricing: { daily: 2000 },
    ratings: { average: 4.6, count: 89 },
    category: 'audio',
  },
  {
    _id: '6',
    name: 'Bosch Power Drill Set',
    description: 'Professional cordless drill with 50+ accessories',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'],
    pricing: { daily: 500 },
    ratings: { average: 4.5, count: 145 },
    category: 'tools',
  },
  {
    _id: '7',
    name: 'Herman Miller Aeron',
    description: 'Ergonomic office chair with full adjustability',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400'],
    pricing: { daily: 800 },
    ratings: { average: 4.8, count: 67 },
    category: 'furniture',
  },
  {
    _id: '8',
    name: 'GoPro Hero 12 Black',
    description: 'Waterproof action camera with 5.3K video',
    images: ['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400'],
    pricing: { daily: 1200 },
    ratings: { average: 4.7, count: 203 },
    category: 'cameras',
  },
];

// Format currency in INR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Product Card Component
const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {!imageError && product.images?.[0] ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-50">
            <FiPackage className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded">
            {product.category || 'General'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <FiStar className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {product.ratings?.average?.toFixed(1) || '4.5'}
          </span>
          <span className="text-xs text-gray-400">
            ({product.ratings?.count || 0})
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(product.pricing?.daily || 0)}
            </span>
            <span className="text-xs text-gray-500">/day</span>
          </div>
          <Link
            to={`/customer/products/${product._id}`}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Home Component
const Home = () => {
  const dispatch = useDispatch();
  const { products, categories, isLoading } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getProducts({ search, category: selectedCategory || undefined }));
  };

  const displayProducts = products?.length > 0 ? products : dummyProducts;
  const displayCategories = categories?.length > 0 ? categories : defaultCategories;

  return (
    <div className="space-y-12">
      {/* ================================================================
          HERO SECTION - Clean, minimal enterprise style
          ================================================================ */}
      <section className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-12 lg:px-12 lg:py-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Trusted by 50,000+ customers
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Rent Premium Equipment
              <br />
              <span className="text-gray-500">Without the Premium Price</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-base text-gray-600 max-w-lg">
              Access thousands of high-quality products for rent. From professional cameras to power tools — get what you need, when you need it.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                      placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                    text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white"
                >
                  <option value="">All Categories</option>
                  {displayCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-12 px-6 bg-gray-900 text-white text-sm font-medium rounded-lg 
                    hover:bg-gray-800 active:bg-gray-950 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-100">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="hidden lg:block absolute top-0 right-0 w-2/5 h-full">
          <div className="relative w-full h-full">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            
            {/* Main hero image */}
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Premium rental equipment"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Floating product cards */}
            <div className="absolute z-20 top-1/4 right-8 bg-white rounded-lg shadow-lg p-3 border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100"
                  alt="Camera"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Sony A7 IV</p>
                  <p className="text-xs text-gray-500">₹2,500/day</p>
                </div>
              </div>
            </div>
            
            <div className="absolute z-20 bottom-1/3 right-16 bg-white rounded-lg shadow-lg p-3 border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100"
                  alt="MacBook"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">MacBook Pro</p>
                  <p className="text-xs text-gray-500">₹3,500/day</p>
                </div>
              </div>
            </div>
            
            {/* Rating badge */}
            <div className="absolute z-20 bottom-1/4 right-8 bg-white rounded-full shadow-lg px-4 py-2 border border-gray-100 flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <FiStar key={star} className="w-3 h-3 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700">4.9 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CATEGORIES SECTION
          ================================================================ */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Browse Categories</h2>
            <p className="text-sm text-gray-500 mt-0.5">Find what you need by category</p>
          </div>
          <Link
            to="/customer/products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {isLoading
            ? Array(8).fill(0).map((_, i) => <CategorySkeleton key={i} />)
            : displayCategories.map((category) => {
                const IconComponent = categoryIcons[category.icon] || categoryIcons.default;
                return (
                  <Link
                    key={category.id}
                    to={`/customer/products?category=${category.id}`}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-lg 
                      hover:border-gray-300 hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
        </div>
      </section>

      {/* ================================================================
          FEATURED PRODUCTS SECTION
          ================================================================ */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-0.5">Most popular rentals this week</p>
          </div>
          <Link
            to="/customer/products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : displayProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </section>

      {/* ================================================================
          FEATURES SECTION
          ================================================================ */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Why Choose RentalHub</h2>
          <p className="text-sm text-gray-500 mt-1">Everything you need for a seamless rental experience</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS SECTION
          ================================================================ */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900">How It Works</h2>
          <p className="text-sm text-gray-500 mt-1">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Browse & Select',
              description: 'Search through our catalog and find the perfect equipment for your needs.',
            },
            {
              step: '02',
              title: 'Book & Pay',
              description: 'Choose your rental dates, add to cart, and complete secure checkout.',
            },
            {
              step: '03',
              title: 'Receive & Return',
              description: 'Get doorstep delivery, use your rental, and return when done.',
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="relative bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            >
              {/* Step Number */}
              <div className="text-3xl font-bold text-gray-100 absolute top-4 right-4">
                {item.step}
              </div>

              {/* Content */}
              <div className="relative">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>

              {/* Connector Line (hidden on mobile) */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="bg-gray-900 rounded-lg p-8 lg:p-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to Start Renting?
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Join thousands of customers who save money by renting instead of buying.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/customer/products"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            Browse Catalog
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-transparent text-white text-sm font-medium rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
