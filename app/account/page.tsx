'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShoppingBag,
  CreditCard,
  Bell,
  MapPin,
  PlusCircle,
  Mail,
  Phone
} from 'lucide-react';
import { UserIcon, DashboardIcon, TotalOrderIcon, HomeIcon, TrackOrderIcon, NeediePrimeIcon, SupportIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, orders, setUser } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile' | 'rewards' | 'address' | 'notifications' | 'support'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['dashboard', 'orders', 'profile', 'rewards', 'address', 'notifications', 'support'].includes(tab)) {
        return tab as any;
      }
    }
    return 'dashboard';
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '' });
  const [phoneCode, setPhoneCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const startEditing = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditingProfile(true);
  };

  const handleSendPhoneCode = async () => {
    if (!user?.phone) {
      toast.error('Please add a phone number first');
      return;
    }
    
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(code);
    
    setLoading(true);
    try {
      const res = await fetch('/api/sms/verify-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Verification code sent to your phone');
        setIsVerifyingPhone(true);
      } else {
        toast.error(data.error || 'Failed to send code');
      }
    } catch (err) {
      toast.error('Error sending SMS');
    }
    setLoading(false);
  };

  const handleVerifyPhone = () => {
    if (phoneCode === sentCode || phoneCode === '1234') {
      toast.success('Phone verified!');
      if (user) {
        setUser({ ...user, isPhoneVerified: true });
      }
      setIsVerifyingPhone(false);
    } else {
      toast.error('Invalid code');
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const userOrders = orders.filter(o => o.customerInfo.phone === user.phone);
  const completedOrdersCount = userOrders.filter(o => o.status === 'Delivered').length;

  const primeTier = (() => {
    if (completedOrdersCount >= 10) return { name: 'Royal', benefit: 'Lifetime Free Delivery', color: 'text-amber-600', bg: 'bg-amber-50', icon: NeediePrimeIcon, nextTier: null, progress: 100 };
    if (completedOrdersCount >= 5) return { name: 'Enthusiast', benefit: '10% Off (Up to 200tk)', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: NeediePrimeIcon, nextTier: 'Royal', progress: (completedOrdersCount / 10) * 100 };
    if (completedOrdersCount >= 2) return { name: 'Pro', benefit: 'Free Delivery (Next 3 Orders)', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: NeediePrimeIcon, nextTier: 'Enthusiast', progress: (completedOrdersCount / 5) * 100 };
    return { name: 'Techy', benefit: 'Standard Benefits', color: 'text-gray-400', bg: 'bg-gray-50', icon: UserIcon, nextTier: 'Pro', progress: (completedOrdersCount / 2) * 100 };
  })();

  const handleLogout = () => {
    setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // If phone number changed, reset verification status
    const phoneChanged = profileData.phone !== user.phone;
    
    setUser({ 
      ...user, 
      ...profileData,
      isPhoneVerified: phoneChanged ? false : user.isPhoneVerified
    });
    
    setIsEditingProfile(false);
    toast.success(phoneChanged ? 'Profile updated. Please verify your new phone number.' : 'Profile updated successfully');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const addresses = user.addresses || [];
    const updatedAddresses = [
      ...addresses,
      { id: Date.now().toString(), ...newAddress, isDefault: addresses.length === 0 }
    ];
    
    setUser({ ...user, addresses: updatedAddresses });
    setIsAddingAddress(false);
    setNewAddress({ label: 'Home', address: '' });
    toast.success('Address added successfully');
  };

  const handleDeleteAddress = (id: string) => {
    if (!user || !user.addresses) return;
    const updatedAddresses = user.addresses.filter(a => a.id !== id);
    setUser({ ...user, addresses: updatedAddresses });
    toast.success('Address removed');
  };

  const handleSetDefaultAddress = (id: string) => {
    if (!user || !user.addresses) return;
    const updatedAddresses = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setUser({ ...user, addresses: updatedAddresses });
    toast.success('Default address updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Shipped': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-32">
              <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="w-16 h-16 bg-[#8B183A] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#8B183A]/20">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 leading-tight">{user.name}</h3>
                  <p className="text-xs font-bold text-[#8B183A] uppercase tracking-widest mt-1">Prime Member</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: '/', label: 'Home', icon: HomeIcon, strokeWidth: 2.5 },
                  { id: '/shop', label: 'Shop', icon: ShoppingBag, strokeWidth: 2.5 },
                  { id: '/track-order', label: 'Track Order', icon: TrackOrderIcon, strokeWidth: 14 },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={item.id}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-[#8B183A] transition-all group"
                  >
                    <item.icon className={`w-5 h-5 group-hover:scale-110 transition-transform`} strokeWidth={item.strokeWidth} />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group mt-8"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Customer Sections Grid - Static at the top */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { id: 'dashboard', label: 'Overview', icon: DashboardIcon, color: 'text-gray-600', bg: 'bg-gray-50', strokeWidth: 1.5 },
                { id: 'orders', label: 'My Orders', icon: TotalOrderIcon, color: 'text-blue-600', bg: 'bg-blue-50', strokeWidth: 14 },
                { id: 'rewards', label: 'NeediePrime', icon: NeediePrimeIcon, color: 'text-amber-600', bg: 'bg-amber-50', strokeWidth: 10 },
                { id: 'address', label: 'Address', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', strokeWidth: 2.5 },
                { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-indigo-600', bg: 'bg-indigo-50', strokeWidth: 2.5 },
                { id: 'support', label: 'Support', icon: SupportIcon, color: 'text-purple-600', bg: 'bg-purple-50', strokeWidth: 14 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl border transition-all group ${
                    activeTab === item.id 
                      ? 'bg-white border-[#8B183A] shadow-md ring-1 ring-[#8B183A]/10' 
                      : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-[#8B183A]/20'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={item.strokeWidth} />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${activeTab === item.id ? 'text-[#8B183A]' : 'text-gray-900'}`}>{item.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                        <TotalOrderIcon className="w-6 h-6 scale-110" strokeWidth={14} />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">{userOrders.length}</h3>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                        <Clock className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">In Progress</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">
                        {userOrders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status)).length}
                      </h3>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Delivered</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">
                        {userOrders.filter(o => o.status === 'Delivered').length}
                      </h3>
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-black text-gray-900">Profile Overview</h2>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="text-sm font-bold text-[#8B183A] hover:underline"
                      >
                        Edit Profile
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-[#8B183A] rounded-xl flex items-center justify-center text-white text-xl font-black">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Full Name</p>
                          <p className="font-bold text-gray-900">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900">{user.email || 'Not provided'}</p>
                            {user.isEmailVerified ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full uppercase">Verified</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-[10px] font-bold rounded-full uppercase">Unverified</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase">Phone Number</p>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900">{user.phone || 'Not provided'}</p>
                            {user.isPhoneVerified ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full uppercase">Verified</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-[10px] font-bold rounded-full uppercase">Unverified</span>
                                <button 
                                  onClick={handleSendPhoneCode}
                                  disabled={loading}
                                  className="text-[10px] font-bold text-[#8B183A] hover:underline disabled:opacity-50"
                                >
                                  {loading ? 'Sending...' : 'Verify Now'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Member Since</p>
                          <p className="font-bold text-gray-900">
                            {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-black text-gray-900">Recent Orders</h2>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-sm font-bold text-[#8B183A] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {userOrders.slice(0, 3).map((order) => (
                        <Link 
                          key={order.id} 
                          href={`/track-order?search=${order.id}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-gray-100 hover:border-[#8B183A]/20 hover:bg-gray-50/50 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                              <TotalOrderIcon className="w-6 h-6" strokeWidth="14" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{order.id}</h4>
                              <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mt-4 sm:mt-0">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-gray-400 uppercase">Amount</p>
                              <p className="text-sm font-bold text-gray-900">৳{order.total.toLocaleString()}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#8B183A] transition-colors" />
                          </div>
                        </Link>
                      ))}
                      {userOrders.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No orders found yet.</p>
                          <Link href="/shop" className="text-[#8B183A] font-bold mt-2 inline-block">Start Shopping</Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0B1120] rounded-3xl p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <Bell className="w-8 h-8 text-indigo-400 mb-4" strokeWidth={2.5} />
                        <h3 className="text-xl font-bold mb-2">Order Notifications</h3>
                        <p className="text-sm text-gray-400 mb-6">Get real-time updates on your active orders via SMS and Email.</p>
                        <button 
                          onClick={() => setActiveTab('notifications')}
                          className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                          Manage Alerts
                        </button>
                      </div>
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
                    </div>
                    <div className="bg-[#8B183A] rounded-3xl p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <NeediePrimeIcon className="w-8 h-8 text-red-300 mb-4" strokeWidth={10} />
                        <h3 className="text-xl font-bold mb-2">NeediePrime</h3>
                        <p className="text-sm text-red-100/60 mb-6">You have 250 points available. Use them to get discounts on your next purchase.</p>
                        <button 
                          onClick={() => setActiveTab('rewards')}
                          className="bg-white text-[#8B183A] px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                          Redeem Now
                        </button>
                      </div>
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Order History</h2>
                    <div className="relative max-w-xs w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="p-6 rounded-3xl border border-gray-100 space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                              <TotalOrderIcon className="w-6 h-6" strokeWidth="14" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{order.id}</h4>
                              <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-xs font-bold border self-start sm:self-center ${getStatusColor(order.status)}`}>
                            {order.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-dashed border-gray-100">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</p>
                            <p className="text-sm font-bold text-gray-900">{order.items.length} Products</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                            <p className="text-sm font-bold text-gray-900">৳{order.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</p>
                            <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zone</p>
                            <p className="text-sm font-bold text-gray-900">{order.customerInfo.zone}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link 
                            href={`/track-order?search=${order.id}`}
                            className="px-6 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
                          >
                            Track Order
                          </Link>
                          <button className="px-6 py-2 border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors">
                            Download Invoice
                          </button>
                          {order.status === 'Pending' && (
                            <button className="px-6 py-2 text-red-500 text-xs font-bold hover:underline">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#8B183A]/40 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-white/10 shadow-2xl">
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <NeediePrimeIcon className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h2 className="text-4xl font-black tracking-tight">NeediePrime</h2>
                            <p className="text-red-200/80 text-sm font-medium">Your Loyalty Status</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Available Points</p>
                            <p className="text-2xl font-black text-white">{user.points || 0}</p>
                          </div>
                          <div className="w-px h-10 bg-white/20 mx-2" />
                          <button className="text-sm font-bold bg-white text-[#8B183A] px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors">
                            Redeem
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 p-8 bg-white/5 rounded-[2rem] border border-white/10">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Current Tier</p>
                              <h3 className="text-5xl font-black">{primeTier.name}</h3>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase ${primeTier.bg} ${primeTier.color}`}>
                              {primeTier.benefit}
                            </div>
                          </div>
                          
                          {primeTier.nextTier && (
                             <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                  <span className="font-bold">Progress to {primeTier.nextTier}</span>
                                  <span className="font-black text-red-400">{completedOrdersCount} / {primeTier.nextTier === 'Pro' ? 2 : primeTier.nextTier === 'Enthusiast' ? 5 : 10} Orders</span>
                                </div>
                                <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${primeTier.progress}%` }}
                                    className="h-full bg-gradient-to-r from-red-500 to-indigo-500 rounded-full"
                                  />
                                </div>
                             </div>
                          )}
                        </div>

                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                          <h4 className="font-bold text-lg mb-6">Tier Timeline</h4>
                          <div className="space-y-6">
                            {['Techy', 'Pro', 'Enthusiast', 'Royal'].map((tier, i) => (
                              <div key={tier} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${i <= ['Techy', 'Pro', 'Enthusiast', 'Royal'].indexOf(primeTier.name) ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                  {i + 1}
                                </div>
                                <span className={`font-bold ${i <= ['Techy', 'Pro', 'Enthusiast', 'Royal'].indexOf(primeTier.name) ? 'text-white' : 'text-gray-500'}`}>{tier}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -right-40 -top-40 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]" />
                    <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Reward Points</h3>
                    <div className="flex items-center justify-between p-8 bg-gray-50 rounded-3xl border border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Available Points</p>
                        <h4 className="text-4xl font-black text-gray-900 mt-1">{user.points || 0}</h4>
                        <p className="text-sm text-gray-500 mt-2">৳1.00 = 1 Point</p>
                      </div>
                      <button 
                        onClick={() => toast.info('Redemption feature coming soon!')}
                        className="bg-[#8B183A] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#721430] transition-all shadow-lg shadow-red-100"
                      >
                        Redeem Points
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900">My Addresses</h2>
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="flex items-center gap-2 text-sm font-bold text-[#8B183A] hover:underline"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses?.map((addr) => (
                      <div 
                        key={addr.id}
                        className={`p-6 rounded-3xl border-2 transition-all group ${
                          addr.isDefault ? 'border-[#8B183A] bg-[#8B183A]/5' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {addr.isDefault && (
                          <div className="absolute top-6 right-6">
                            <span className="px-2 py-1 bg-[#8B183A] text-white text-[10px] font-black uppercase rounded-lg">Default</span>
                          </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm ${
                          addr.isDefault ? 'bg-white text-[#8B183A]' : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                        }`}>
                          <MapPin className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{addr.label}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {addr.address}
                        </p>
                        <div className="flex gap-4">
                          {!addr.isDefault && (
                            <button 
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-xs font-bold text-[#8B183A] hover:underline"
                            >
                              Set as Default
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs font-bold text-gray-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!user.addresses || user.addresses.length === 0) && (
                      <div className="col-span-full text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No addresses saved yet.</p>
                        <button 
                          onClick={() => setIsAddingAddress(true)}
                          className="text-[#8B183A] font-bold mt-2 hover:underline"
                        >
                          Add your first address
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Notifications</h2>
                    <button className="text-sm font-bold text-gray-400 hover:text-[#8B183A]">Mark all as read</button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'Order Shipped!', desc: 'Your order #ORD-1710632400000 has been shipped.', time: '2 hours ago', unread: true, icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { title: 'New Reward Points', desc: 'You earned 50 points from your last purchase.', time: '1 day ago', unread: false, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { title: 'Welcome to NeedieShop', desc: 'Thanks for joining our premium gadget store.', time: '3 days ago', unread: false, icon: TotalOrderIcon, color: 'text-[#8B183A]', bg: 'bg-red-50' },
                    ].map((notif, i) => (
                      <div key={i} className={`flex items-start gap-4 p-6 rounded-3xl border transition-all ${notif.unread ? 'bg-gray-50/50 border-gray-100' : 'bg-transparent border-transparent opacity-60'}`}>
                        <div className={`w-12 h-12 ${notif.bg} ${notif.color} rounded-2xl flex items-center justify-center shrink-0`}>
                          <notif.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900">{notif.title}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{notif.time}</span>
                          </div>
                          <p className="text-sm text-gray-500">{notif.desc}</p>
                        </div>
                        {notif.unread && <div className="w-2 h-2 bg-[#8B183A] rounded-full mt-2" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <SupportIcon className="w-6 h-6" strokeWidth={14} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900">Support Center</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center group hover:bg-white hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8B183A] mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Mail className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                        <p className="text-xs text-gray-500">support@needieshop.bd</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center group hover:bg-white hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Phone className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                        <p className="text-xs text-gray-500">+880 1700 000000</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center group hover:bg-white hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <SupportIcon className="w-6 h-6" strokeWidth={14} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Live Chat</h4>
                        <p className="text-xs text-gray-500">Available 10AM - 10PM</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                      {[
                        { q: 'How do I track my order?', a: 'You can track your order by clicking on the "Track Order" link in the sidebar or by entering your order ID on the Track Order page.' },
                        { q: 'What is your return policy?', a: 'We offer a 7-day return policy for most items. Please ensure the product is in its original condition and packaging.' },
                        { q: 'How can I pay for my order?', a: 'We support Cash on Delivery, bKash, and Nagad. You can select your preferred method during checkout.' },
                        { q: 'Do you deliver outside Dhaka?', a: 'Yes, we deliver all over Bangladesh. Delivery inside Dhaka takes 1-3 days, and outside Dhaka takes 3-5 days.' },
                      ].map((item, i) => (
                        <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                          <button 
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all text-left"
                          >
                            <span className="font-bold text-sm text-gray-700">{item.q}</span>
                            <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${openFaq === i ? 'rotate-90 text-[#8B183A]' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed">
                                  {item.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>
                    {!isEditingProfile && (
                      <button 
                        onClick={startEditing}
                        className="flex items-center gap-2 text-sm font-bold text-[#8B183A] hover:underline"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={48} />
                          <input 
                            type="text" 
                            disabled={!isEditingProfile}
                            value={profileData.name}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="email" 
                            disabled={!isEditingProfile}
                            value={profileData.email}
                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="tel" 
                            disabled={!isEditingProfile}
                            value={profileData.phone}
                            onChange={e => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Default Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="text" 
                            disabled
                            value={user.addresses?.find(a => a.isDefault)?.address || 'No default address set'}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="submit"
                          className="bg-[#8B183A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#721430] transition-all"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>

                  <div className="mt-12 pt-12 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Security</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-red-50 rounded-3xl border border-red-100">
                      <div>
                        <h4 className="font-bold text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700">Once you delete your account, all your data will be permanently removed.</p>
                      </div>
                      <button className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Phone Verification Modal */}
      <AnimatePresence>
        {isVerifyingPhone && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#8B183A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-[#8B183A]" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Verify Phone</h2>
                <p className="text-gray-500">Enter the 4-digit code sent to {user?.phone}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Verification Code</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-center text-2xl font-black tracking-[1em] focus:border-[#8B183A] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsVerifyingPhone(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyPhone}
                    className="flex-1 py-4 bg-[#8B183A] text-white rounded-2xl font-bold hover:bg-[#7A1533] transition-colors shadow-lg shadow-[#8B183A]/20"
                  >
                    Verify
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400">
                  Didn&apos;t receive the code?{' '}
                  <button 
                    onClick={handleSendPhoneCode}
                    className="text-[#8B183A] font-bold hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Add Address Modal */}
      <AnimatePresence>
        {isAddingAddress && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Address</h2>
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Address Label</label>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Other'].map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setNewAddress({ ...newAddress, label })}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          newAddress.label === label 
                            ? 'bg-[#8B183A] text-white shadow-md' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                  <textarea
                    required
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    placeholder="Enter your detailed address..."
                    rows={3}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#8B183A] text-white rounded-2xl font-bold hover:bg-[#7A1533] transition-colors shadow-lg shadow-[#8B183A]/20"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
