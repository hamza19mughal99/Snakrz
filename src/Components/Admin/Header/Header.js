import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, AppBar, Toolbar, Tooltip } from '@material-ui/core';
import screenfull from 'screenfull';
import MenuIcon from '@material-ui/icons/Menu';
import { collapsedSidebarAction } from 'Store/vendor/actions';

const Header = () => {

   const dispatch = useDispatch();
   const settings = useSelector(state => state.settings);

   const onToggleNavCollapsed = () => {
      const val = settings.navCollapsed ? false : true;
      dispatch(collapsedSidebarAction(val));
   }

   const logoutAdmin = () => {
      localStorage.removeItem("adminToken")
      window.location.href = "/"
   }
   const toggleScreenFull = () => { screenfull.toggle(); }

   return (
      <AppBar position="static" className="rct-header">
         <Toolbar className="d-flex justify-content-between w-100 pl-0">
            <div className="d-inline-flex align-items-center">
               <ul className="list-inline mb-0 navbar-left">
                  <li className="list-inline-item" onClick={(e) => onToggleNavCollapsed(e)}>
                     <Tooltip title="Sidebar Toggle" placement="bottom">
                        <IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
                           <MenuIcon />
                        </IconButton>
                     </Tooltip>
                  </li>
               </ul>
            </div>
            <ul className="navbar-right list-inline mb-0">
               <li className="list-inline-item">
                  <IconButton aria-label="settings" onClick={() => logoutAdmin()}>
                     <i className="zmdi zmdi-power" />
                  </IconButton>
               </li>
               <li className="list-inline-item">
                  <Tooltip title="Full Screen" placement="bottom">
                     <IconButton aria-label="settings" onClick={() => toggleScreenFull()}>
                        <i className="zmdi zmdi-crop-free"></i>
                     </IconButton>
                  </Tooltip>
               </li>
            </ul>
         </Toolbar>
      </AppBar>
   );
}
export default Header;
