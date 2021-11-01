import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import NavMenuItem from './NavMenuItem';
import { onToggleMenu } from 'Store/vendor/actions';
import adminsidebarMenu from "./NavLinks"

function SidebarContent() {
   const dispatch = useDispatch();
   const sidebar = useSelector(state => state.sidebar);
   const { sidebarMenus } = sidebar;

   const toggleMenu = (menu, stateCategory) => {
      let data = { menu, stateCategory }
      dispatch(onToggleMenu(data));
   }
   console.log(sidebarMenus)

   return (
      <div className="rct-sidebar-nav">
         <nav className="navigation" style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            paddingTop: '2rem'
         }}>
            <List
               className="rct-mainMenu p-0 m-0 list-unstyled"
            >
               {adminsidebarMenu.category1 && adminsidebarMenu.category1.map((menu, key) => {

                  return (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category1')}
                     />
                  )
               })}
            </List>
         </nav>
      </div>
   );
}


export default withRouter(SidebarContent);
