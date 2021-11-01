/**
 * App Settings Reducers
 */

import {
	COLLAPSED_SIDEBAR,
	RTL_LAYOUT,
	SEARCH_FORM_ENABLE,
	TOGGLE_SIDEBAR_IMAGE,
	SET_SIDEBAR_IMAGE,
	SET_LANGUAGE,
} from 'Store/vendor/actions/types';

// app config
import AppConfig from 'Constants/AppConfig';

/**
 * initial app settings
 */
const INIT_STATE = {
	navCollapsed: AppConfig.navCollapsed,
	rtlLayout: AppConfig.rtlLayout,
	searchFormOpen: false, // search form by default false
	activeTheme: {
		id: 1,
		name: 'primary'
	},
	enableSidebarBackgroundImage: AppConfig.enableSidebarBackgroundImage, // default enable sidebar background
	selectedSidebarImage: AppConfig.sidebarImage, // default sidebar background image
	locale: AppConfig.locale,
	languages: [
		{
			languageId: 'english',
			locale: 'en',
			name: 'English',
			icon: 'en',
		},
		{
			languageId: 'saudi-arabia',
			locale: 'ar',
			name: 'Arabic',
			icon: 'ar',
		},
	],
};

let  settings = (state = INIT_STATE, action) => {
	switch (action.type) {

		// collapse sidebar
		case COLLAPSED_SIDEBAR:
			return { ...state, navCollapsed: action.isCollapsed };

		// rtl layout
		case RTL_LAYOUT:
			return { ...state, rtlLayout: action.payload };


		// search form
		case SEARCH_FORM_ENABLE:
			document.body.classList.toggle('search-active', !state.searchFormOpen);
			return { ...state, searchFormOpen: !state.searchFormOpen };

		// togglw sidebar image
		case TOGGLE_SIDEBAR_IMAGE:
			return { ...state, enableSidebarBackgroundImage: !state.enableSidebarBackgroundImage };

		// set sidebar image
		case SET_SIDEBAR_IMAGE:
			return { ...state, selectedSidebarImage: action.payload };

		// set language
		case SET_LANGUAGE:
			return { ...state, locale: action.payload };

		default: return { ...state };
	}
}

export default settings;