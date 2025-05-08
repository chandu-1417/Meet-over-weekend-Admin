import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, UsersIcon, CogIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ user, onLogout, closeMobileMenu }) => {
    return (
        <div className="flex flex-col w-64 h-full bg-gray-800">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-white text-xl font-bold">Admin Portal</h1>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    <NavLink
                        to="/"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                        }
                    >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        Bookings
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        end
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <HomeIcon className="mr-3 h-5 w-5" />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/settings"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                        }
                    >
                        <CogIcon className="mr-3 h-5 w-5" />
                        Settings
                    </NavLink>
                </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{user?.email}</p>
                        <button
                            onClick={onLogout}
                            className="text-xs font-medium text-gray-300 hover:text-white"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;