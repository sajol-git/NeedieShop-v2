'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  Package, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail,
  ShoppingBag,
  CreditCard,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, orders, setUser } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile'>('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const userOrders = orders.filter(o => o.customerInfo.phone === user.phone);

  const handleLogout = () => {
    setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, ...profileData });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
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
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#8B183A] rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: ShoppingBag },
                  { id: 'orders', label: 'My Orders', icon: Package },
                  { id: 'profile', label: 'Profile Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-[#8B183A] text-white shadow-lg shadow-red-100' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-8"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">{userOrders.length}</h3>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                        <Clock className="w-6 h-6" />
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
                              <Package className="w-6 h-6" />
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
                        <Bell className="w-8 h-8 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Order Notifications</h3>
                        <p className="text-sm text-gray-400 mb-6">Get real-time updates on your active orders via SMS and Email.</p>
                        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                          Manage Alerts
                        </button>
                      </div>
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
                    </div>
                    <div className="bg-[#8B183A] rounded-3xl p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <CreditCard className="w-8 h-8 text-red-300 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Needie Rewards</h3>
                        <p className="text-sm text-red-100/60 mb-6">You have 250 points available. Use them to get discounts on your next purchase.</p>
                        <button className="bg-white text-[#8B183A] px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
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
                              <Package className="w-6 h-6" />
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
                        onClick={() => setIsEditingProfile(true)}
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
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                            disabled={!isEditingProfile}
                            placeholder="Add your address"
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
    </div>
  );
}
