import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import style from './layout.module.css';

// Map path to select options dynamically
const getOptionsByPath = (path) => {
  if (path === '/admin/faculty/') {
    return [
      { label: 'More', value: '' },
      { label: 'Add Faculty', value: 'add-faculty' },
    ];
  } else if (path === '/admin/student') {
    return [
      { label: 'list', value: 'list' },
      { label: 'Add Student', value: 'add-student' },
    ];
  } else if (path === '/admin/subject') {
    return [
      { label: 'list', value: '' },
      { label: 'Add Subject', value: 'add' },
    ];
  } else if (path === '/admin/department') {
    return [
      { label: 'list', value: '' },
      { label: 'Add Subject', value: 'add' },
    ];
  } else {
    return null; // No dropdown for other paths
  }
};

export default function AdminLayout() {
  const [menu, setMenu] = useState(false);
  const [mode, setMode] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentPath = `/${pathnames.join('/')}`;

  // Get options for the current path
  const selectOptions = getOptionsByPath(currentPath);

  useEffect(() => {
    if (selectOptions && selectOptions.length > 0) {
      // Set the default option to the first option
      const defaultOption = selectOptions[0].value;
      setSelectedOption(defaultOption);

      // Navigate to the default option's path if not already there
      if (!location.pathname.includes(defaultOption)) {
        navigate(`${currentPath}/${defaultOption}`);
      }
    }
  }, [selectOptions, currentPath, location.pathname, navigate]);

  // Handle option selection
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    navigate(`${currentPath}/${selectedValue}`);
  };

  // Generate breadcrumb
  const breadcrumb = pathnames.map((path, index) => {
    const breadcrumbPath = `/${pathnames.slice(0, index + 1).join('/')}`;
    return {
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: breadcrumbPath,
    };
  });

  return (
    <div className={`${style.container} sidebar ${mode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar menu={menu} setMenu={setMenu} mode={mode} setMode={setMode} />

      {/* Header */}
      <div className={style.header}>
        <Header setMenu={setMenu} menu={menu} />
        <div className={style.mainContainer}>
          {/* Breadcrumb */}
          <div className={style.breadcrumbContainer}>
            <p>
              {breadcrumb.length > 0 ? (
                breadcrumb.map((crumb, index) => (
                  <span key={index}>
                    <a href={crumb.path}>{crumb.label}</a>
                    {index < breadcrumb.length - 1 && ' / '}
                  </span>
                ))
              ) : (
                <span>Home</span>
              )}
              {/* {selectOptions && (
                <>
                  {' / '}
                  <select
                    id="pathOp"
                    className={style.pathOp}
                    value={selectedOption || ''}
                    onChange={handleSelectChange}
                  >
                    {selectOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
              )} */}
            </p>
          </div>

          <hr />

          {/* Main Content */}
          <div className={style.mainContent}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
