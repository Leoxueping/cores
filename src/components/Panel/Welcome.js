import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Menu, Dropdown, Icon } from 'antd';

const Welcome = (props) => {

  	return (
		<div>

			欢迎使用 Gospel IDE

		</div>
  	);

};

function mapSateToProps({ designer }) {
	return { designer };
}

export default connect(mapSateToProps)(Welcome);
