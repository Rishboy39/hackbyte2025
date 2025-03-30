
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings, ShoppingCart, School, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import authService from '@/lib/authService';
import { toast } from 'sonner';

type NavItem = {
  label: string;
  path: string;
  active?: boolean;
  icon?: React.ReactNode;
  showTextInDesktop?: boolean;
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | 'staff' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          // Get profile data from profiles table
          const { data: profileData } = await authService.getProfile(currentUser.id);
          
          setUser({
            id: currentUser.id,
            name: profileData?.name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            grade: profileData?.grade || '',
            avatar: null
          });
          
          // Get user role
          const role = await authService.getUserRole(currentUser.id);
          setUserRole(role);
          console.log("Navigation component user role:", role); // Debug log
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  // Determine active nav item based on current path
  const navItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      active: location.pathname === '/dashboard',
      showTextInDesktop: true
    },
    { 
      label: 'Pre-Order', 
      path: '/pre-order', 
      active: location.pathname === '/pre-order',
      showTextInDesktop: true
    },
    { 
      label: 'Order Management', 
      path: '/order-management', 
      active: location.pathname === '/order-management',
      showTextInDesktop: true
    },
    { 
      label: 'Voting', 
      path: '/voting', 
      active: location.pathname === '/voting',
      showTextInDesktop: true
    },
    { 
      label: 'Teacher Portal', 
      path: '/teacher', 
      active: location.pathname === '/teacher',
      icon: <School size={16} />,
      showTextInDesktop: false
    },
    { 
      label: 'Admin Portal', 
      path: '/admin', 
      active: location.pathname === '/admin',
      icon: <ShieldCheck size={16} />,
      showTextInDesktop: false
    },
  ];

  return (
    <nav className="bg-white shadow-sm py-3 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-gray-700 hover:text-cafeteria-primary font-medium transition ${
                  item.active ? 'text-cafeteria-primary' : ''
                } ${
                  item.showTextInDesktop === false ? 'w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100' : ''
                }`}
                title={item.showTextInDesktop === false ? item.label : undefined}
              >
                {item.icon && (
                  <span className={item.showTextInDesktop === false ? '' : 'mr-1'}>
                    {item.icon}
                  </span>
                )}
                {(item.showTextInDesktop !== false) && item.label}
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="hidden md:block">
            {loading ? (
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="hidden lg:block w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name} />}
                      <AvatarFallback className="bg-cafeteria-accent text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user?.name}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-bold">{user?.name}</span>
                      {user?.grade && <span className="text-sm text-gray-500">{user?.grade}</span>}
                      <span className="text-xs text-gray-400">{user?.email}</span>
                      {userRole && <span className="text-xs text-cafeteria-primary mt-1 capitalize">Role: {userRole}</span>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/order-management" className="w-full cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/teacher" className="w-full cursor-pointer">
                      <School className="mr-2 h-4 w-4" />
                      <span>Teacher Portal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Portal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-cafeteria-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-2 border-t pt-2 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-gray-700 hover:text-cafeteria-primary font-medium py-2 transition ${
                    item.active ? 'text-cafeteria-primary' : ''
                  } flex items-center gap-2`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t pt-3 mt-2">
                {loading ? (
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex flex-col space-y-1">
                      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="w-8 h-8">
                      {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name} />}
                      <AvatarFallback className="bg-cafeteria-accent text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      {user?.grade && <span className="text-xs text-gray-500">{user?.grade}</span>}
                      {userRole && <span className="text-xs text-cafeteria-primary capitalize">Role: {userRole}</span>}
                    </div>
                  </div>
                )}
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-cafeteria-primary" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <Link to="/order-management" className="block py-2 text-gray-700 hover:text-cafeteria-primary" onClick={() => setIsOpen(false)}>
                  My Orders
                </Link>
                <Link to="/settings" className="block py-2 text-gray-700 hover:text-cafeteria-primary" onClick={() => setIsOpen(false)}>
                  Settings
                </Link>
                <button 
                  className="block py-2 text-gray-700 hover:text-cafeteria-primary w-full text-left"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
