import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import Header from 'Components/Admin/Header/Header';
import SidebarContent from 'Components/Admin/Sidebar';
import PreloadHeader from 'lib/admin/PreloadLayout/PreloadHeader';
import PreloadSidebar from 'lib/admin/PreloadLayout/PreloadSidebar';


// app config
import AppConfig from 'Constants/AppConfig';

// actions
import { collapsedSidebarAction } from 'Store/vendor/actions';

class MainApp extends Component {

	state = {
		loadingHeader: true,
		loadingSidebar: true
	}

	UNSAFE_componentWillMount() {
		this.updateDimensions();
	}

	componentDidMount() {
		const { windowWidth } = this.state;
		window.addEventListener("resize", this.updateDimensions);
		if (AppConfig.enableUserTour && windowWidth > 600) {
			setTimeout(() => {
				this.props.startUserTour();
			}, 2000);
		}
		setTimeout(() => {
			this.setState({ loadingHeader: false, loadingSidebar: false });
		}, 114);
   }
   
	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { windowWidth } = this.state;
		if (nextProps.location !== this.props.location) {
			if (windowWidth <= 1199) {
				this.props.collapsedSidebarAction(false);
			}
		}
	}

	updateDimensions = () => {
		this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			window.scrollTo(0, 0);
		}
	}

	renderPage() {
		const { pathname } = this.props.location;
		const { children } = this.props;
		if (pathname === '/app/chat' || pathname.startsWith('/app/mail') || pathname === '/app/todo') {
			return (
				<div className="rct-page-content p-0">
					{children}
				</div>
			);
		}
		return (
			<Scrollbars
				className="rct-scroll"
				autoHide
				autoHideDuration={100}
				style={this.getScrollBarStyle()}
			>
				<div className="rct-page-content">
					{children}
				
				</div>
			</Scrollbars>
		);
	}

	// render header
	renderHeader() {
		const { loadingHeader } = this.state;
		if (loadingHeader) {
			return <PreloadHeader />;
		}
		return <Header />
	}

	//render Sidebar
	renderSidebar() {
		const { loadingSidebar } = this.state;
		if (loadingSidebar) {
			return <PreloadSidebar />;
		}
		return <SidebarContent />
	}

	//Scrollbar height
	getScrollBarStyle() {
		return {
			height: 'calc(100vh - 50px)'
		}
	}

	render() {

		const { navCollapsed, rtlLayout, miniSidebar } = this.props.settings;
		const { windowWidth } = this.state;
		return (
			<div className="app">
				<div className="app-main-container">
					<Sidebar
						sidebar={this.renderSidebar()}
						open={windowWidth <= 375 ? navCollapsed : false}
						docked={windowWidth > 375 ? !navCollapsed : false}
						pullRight={rtlLayout}
						onSetOpen={() => this.props.collapsedSidebarAction(false)}
						styles={{ content: { overflowY: '' } }}
						contentClassName={classnames({ 'app-container-wrapper': miniSidebar })}
					>
						<div className="app-container">
							<div className="rct-app-content">
								<div className="app-header">
									{this.renderHeader()}
								</div>
								<div className="rct-page">
									{this.renderPage()}
								</div>
							</div>
						</div>
					</Sidebar>
				</div>
			</div>
		);
	}
}


const mapStateToProps = ({ settings }) => {
	return { settings }
}

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction,
})(MainApp));


