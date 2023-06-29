import { Avatar } from 'baseui/avatar';
import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Clock, Folder, Menu, Watch } from 'react-feather';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { clearUserData, getFromStorage } from '../utils/storage';

export default function Root() {
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(true);
  const userObject = getFromStorage('user');

  const onLogout = () => {
    clearUserData(); // User credentials are cleared from localStorage to "logout" current user
    navigate('/logout'); // App navigates to root url to redirect to login page
  };

  // This useEffect makes the sidebar auto-collapse for screens less than 1024 pixels
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // This useEffect makes the sidebar auto-collapse when clicked outside the sidebar area for screens less than 768 pixels
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && menuRef.current.contains(event.target)) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setCollapsed(true);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between bg-blue-400 py-2 sticky top-0 z-40">
        <div className="flex items-center">
          <Button
            ref={menuRef}
            overrides={{
              BaseButton: {
                props: { className: 'rounded-none hover:bg-blue-600' },
              },
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            size="mini"
            shape="square"
            kind="tertiary"
            onClick={() => {
              setCollapsed((prev) => !prev);
            }}
          >
            <Menu size={24} />
          </Button>

          <div className="flex items-center ml-4">
            <h1 className="text-white font-bold mr-2">Time Tracker</h1>
            <Watch className="text-white" size={24} />
          </div>
        </div>

        <StatefulPopover
          content={() => (
            <ul className="bg-white rounded-md font-prompt overflow-hidden">
              <li>
                <Button
                  size="compact"
                  overrides={{
                    BaseButton: {
                      props: { className: 'bg-white text-black z-50' },
                    },
                  }}
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </li>
            </ul>
          )}
          returnFocus
          placement="bottomRight"
        >
          <div className="flex items-center" role="button">
            <Avatar
              name={`${userObject.first_name} ${userObject.last_name}`}
              size="2.5rem"
              overrides={{ Root: { props: { className: 'bg-blue-600' } } }}
            />
            <ChevronDown size={16} />
          </div>
        </StatefulPopover>
      </div>
      <div className="flex w-full h-screen overflow-hidden transition">
        <aside
          className={clsx(
            'flex flex-col h-screen flex-shrink-0 space-y-8 border-r border-b fixed md:static ease-in-out duration-300 bg-white z-50',
            {
              'w-1/2 md:w-1/5 lg:w-1/6': !collapsed,
              'w-px md:w-16': collapsed,
            },
          )}
        >
          <nav
            ref={sidebarRef}
            className="flex-1 flex flex-col overflow-y-auto"
          >
            <ul>
              {[
                {
                  name: 'Tracker',
                  link: '/home',
                  Icon: Clock,
                },
                {
                  name: 'Projects',
                  link: '/projects',
                  Icon: Folder,
                },
              ].map((item) => (
                <li key={item.link}>
                  <NavLink
                    title={item.name}
                    to={item.link}
                    // onClick={() => setCollapsed(true)}
                    className="flex items-center relative"
                  >
                    {({ isActive }) => (
                      <span
                        className={clsx(
                          'flex items-center space-x-4 py-2 px-4 w-full',
                          {
                            'bg-gray-200 text-blue-400': isActive,
                            'hover:text-blue-400': !isActive,
                          },
                        )}
                      >
                        <item.Icon />
                        <span
                          className={clsx('text-lg font-normal ', {
                            'sr-only': collapsed,
                          })}
                        >
                          {item.name}
                        </span>
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main
          className={clsx(
            'flex-1 flex flex-col overflow-y-scroll p-5 overflow-x-hidden',
            {
              'bg-black bg-opacity-40 blur-[1px] md:bg-[#F5F5F5] lg:bg-transparent lg:bg-opacity-100 lg:blur-0':
                !collapsed,
            },
          )}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}
