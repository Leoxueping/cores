import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Menu, Dropdown, Icon, Spin } from 'antd';

const Designer = (props) => {

	const designerProps = {

		onSelectDevice(val) {
			props.dispatch({
				type: 'designer/handleDeviceSelected',
				payload: val.key
			})
		}

	};

	const deviceMenuItem = props.designer.deviceList.map((device, index) => (
		<Menu.Item key={index}>{device.name}</Menu.Item>
	));

	const deviceSelectedMenu = (
	  	<Menu onSelect={designerProps.onSelectDevice}>
	    	{deviceMenuItem}
	  	</Menu>
	);

	const designerLoaded = () => {
		window.gospelDesigner = window.frames['gospel-designer'];
		gospelDesigner.postMessage({
			designerLoaded: {
				loaded: true
			}
		}, '*');

		props.dispatch({
			type: 'designer/handleLayoutLoaded'
		});
	}

	let splitType = props.devpanel.panels.splitType;
	let maxHeight = document.documentElement.clientHeight - 70;
	if (splitType == 'horizontal-dbl' || splitType == 'grid') {
		maxHeight = (maxHeight - 32) / 2;
	}

	const designerStyle = {
		height: 'auto'
	}

	const designerWrapperStyle = {
	    position: 'absolute',
    	width: '100%',
    	height: '100%'
	}

  	return (
  		<div style={designerWrapperStyle}>

			<div className="designer-header">
				<label className="bold">设备</label>

				<Dropdown overlay={deviceSelectedMenu} trigger={['click']}>
					<Button
						className="deviceSelectorBtn">
						{props.designer.deviceList[props.designer.defaultDevice].name} <Icon type="down" />
					</Button>
				</Dropdown>
			</div>

			<div className="designer-wrapper" style={{height: '100%'}}>
				<Spin spinning={!props.designer.loaded}>

					<div className="designer-body" style={designerStyle}>
						<iframe
							name="gospel-designer"
							width={props.designer.deviceList[props.designer.defaultDevice].width}
							height={props.designer.deviceList[props.designer.defaultDevice].height}
							className="designer"
							frameBorder="0"
							src="static/designer/weui/designer.html"
							onLoad={designerLoaded}
							>
						</iframe>
					</div>

				</Spin>

			</div>

  		</div>
  	);

};

function mapSateToProps({ designer, devpanel }) {
	return { designer,devpanel };
}

export default connect(mapSateToProps)(Designer);
