/**
 * Redux App Settings Actions
 */
import {
    COLLAPSED_SIDEBAR,
    RTL_LAYOUT,
    TOGGLE_MENU,
    SEARCH_FORM_ENABLE,
    TOGGLE_SIDEBAR_IMAGE,
    SET_LANGUAGE,
} from './types';

/**
 * Redux Action To Emit Collapse Sidebar
 * @param {*boolean} isCollapsed 
 */
export const collapsedSidebarAction = (isCollapsed) => ({
    type: COLLAPSED_SIDEBAR,
    isCollapsed
});


/**
 * Redux Action To Emit Rtl Layout
 *  @param {*boolean} isRtlLayout
 */
export const rtlLayoutAction = (isRtlLayout) => ({
    type: RTL_LAYOUT,
    payload: isRtlLayout
});

/**
 * Redux Action To Toggle Sidebar Menus
 */
export const onToggleMenu = (selectedMenu) => ({
    type: TOGGLE_MENU,
    payload: selectedMenu
});


/**
 * Redux Action To Enable/Disable The Search Form
 */
export const toggleSearchForm = () => ({
    type: SEARCH_FORM_ENABLE
});


/**
 * Redux Action To Enable/Disable Sidebar Background Image
 */
export const toggleSidebarImage = () => ({
    type: TOGGLE_SIDEBAR_IMAGE
});

/**
 * Redux Action To Set Language
 */
export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    payload: language
});
