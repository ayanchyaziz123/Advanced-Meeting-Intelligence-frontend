'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout, selectIsAuthenticated, selectUser, selectAuthLoading } from '../../../redux/auth/authSlices';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Redux state
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const authLoading = useSelector(selectAuthLoading);

  // Ref for dropdown
  const dropdownRef = useRef(null);

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    // Set active path based on current URL
    setActivePath(window.location.pathname);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const isActive = (path) => {
    return activePath === path;
  };

  const handleSignOut = async () => {
    try {
      // Dispatch Redux logout action
      await dispatch(userLogout()).unwrap();
      
      // Close mobile menu and dropdown
      setMobileMenuOpen(false);
      setDropdownOpen(false);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setMobileMenuOpen(false);
      setDropdownOpen(false);
      window.location.href = '/';
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    if (user.email) {
      return user.email;
    }
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === 'User') return 'U';
    
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white ${scrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">NGI MS</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-1 md:space-x-4">
              {isAuthenticated ? (
                // Authenticated user menu
                <>
                  <NavLink href="/dashboard" isActive={isActive('/dashboard')}>
                    Dashboard
                  </NavLink>
            
                  {/* User profile dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50 px-3 py-2 transition-colors"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      {/* User avatar */}
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitials()}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {getUserDisplayName()}
                      </span>
                      {/* Dropdown arrow */}
                      <svg 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Link
                            href="/auth/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Profile
                          </Link>
                          <Link
                            href="/favorite-meetings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            Favorite Meetings
                          </Link>
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={handleSignOut}
                            disabled={authLoading}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            {authLoading ? 'Signing Out...' : 'Logout'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Unauthenticated user menu
                <>
                  <NavLink href="/auth/login" isActive={isActive('/auth/login')}>
                    Sign In
                  </NavLink>
                  <NavLink href="/auth/register" isActive={isActive('/auth/register')}>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`sm:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100 border-b border-gray-200' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isAuthenticated ? (
            // Authenticated mobile menu
            <>
              <div className="flex items-center px-3 py-2 text-sm text-gray-600 border-b border-gray-200 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium mr-3">
                  {getUserInitials()}
                </div>
                <span>Welcome, {getUserDisplayName()}</span>
              </div>
              <MobileNavLink href="/dashboard" isActive={isActive('/dashboard')}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink href="/auth/profile" isActive={isActive('/auth/profile')}>
                Profile
              </MobileNavLink>
              <MobileNavLink href="/favorite-meetings" isActive={isActive('/favorite-meetings')}>
                Favorite Meetings
              </MobileNavLink>
              <button 
                className="w-full text-left block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-md transition-colors border-l-4 border-transparent disabled:opacity-50"
                onClick={handleSignOut}
                disabled={authLoading}
              >
                {authLoading ? 'Signing Out...' : 'Logout'}
              </button>
            </>
          ) : (
            // Unauthenticated mobile menu
            <>
              <MobileNavLink href="/auth/login" isActive={isActive('/auth/login')}>
                Sign In
              </MobileNavLink>
              <MobileNavLink href="/auth/register" isActive={isActive('/auth/register')}>
                Sign Up
              </MobileNavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Desktop navigation link component
function NavLink({ href, children, isActive }) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'text-indigo-700 bg-indigo-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ href, children, isActive }) {
  return (
    <Link 
      href={href} 
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive 
          ? 'text-indigo-700 bg-indigo-50 border-l-4 border-indigo-500 pl-2' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-4 border-transparent'
      }`}
    >
      {children}
    </Link>
  );
}