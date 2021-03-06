import React , {PropTypes} from 'react';
import dva from 'dva';
import { Form } from 'antd';
const FormItem = Form.Item;

export default {
	namespace: 'attr',
	state: {
		formItems: [],

		activeFormItem: 0,

		activeElem: {},

		theKey: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'setFormItemsByDefault'
          		});
	      	});
		}
	},

	effects: {

      	*setFormItemsByType({payload: params}, {call, put, select}) {
      		var controllersList = yield select(state => state.designer.controllersList);
      		var currentControllerKey = params.key;
      		var layouts = yield select(state => state.designer.layout);

      		var activeCtrl;

      		if(params.type == 'page') {
      			if(layouts[0].key !== params.key){
      				for (var i = 0; i < layouts[0].children.length; i++) {
      					var page = layouts[0].children[i];
      					if(page.key == params.key) {
      						activeCtrl = page;
      						break;
      					}
      				};
      			}else {
      				activeCtrl = layouts[0];
      			}
      		}else {
	      		var activePage = yield select(state => state.designer.layoutState.activePage);
	      		if(activePage.level == 1) {
	      			activePage = layouts[0];
	      		}else {
	      			activePage = layouts[0].children[activePage.index];
	      		}

	      		const loopChildren = (page) => {
	      			var ct;
	      			for (var i = 0; i < page.length; i++) {
	      				var ctrl = page[i];

	      				if(ctrl.children) {
	      					ct = loopChildren(ctrl.children);
	      				}

	      				if(ctrl.key == params.key) {
	      					ct = ctrl;
	      					window.currentMultLvlCtrl = ctrl;
			      			return ct;
	      				}
	      			};
	      		};

	      		const findParentPageByKey = (pages) => {

	      			var obj = {
	      				page: {},
	      				ctrl: {}
	      			};

	      			for (var i = 0; i < pages.length; i++) {
	      				var currentPage = pages[i],
	      					controllersList = currentPage.children;

	      				obj.ctrl = loopChildren(controllersList);

	      				if(obj.ctrl) {
	      					obj.page = currentPage;
	      					break;
	      				}

	      			};
	      			return obj;
	      		}

	      		activeCtrl = loopChildren(activePage.children);

	      		activeCtrl = activeCtrl || window.currentMultLvlCtrl;

	      		var parentPageAndCtrl = findParentPageByKey(layouts[0].children);

	      		if(!activeCtrl) {
	      			activeCtrl = parentPageAndCtrl.ctrl;
	      		}

      			if(parentPageAndCtrl.page.key) {

	      			//置上级page为当前活跃page
				    yield put({
				        type: 'designer/handleTreeChanged',
				        payload: {
				          	key: parentPageAndCtrl.page.key,
				          	type: 'page'
				        }
				    });

      			}
      		}

      		if(!activeCtrl) {
      			return false;
      		}

      		yield put({
      			type: 'setActiveElem',
      			payload: activeCtrl
      		})

      		yield put({
      			type: 'setFormItems',
      			payload: {
      				attr: activeCtrl.attr,
      				key: params.key
      			}
      		});
      	},

      	*setFormItemsByDefault({payload: key}, {call, put, select}) {
      		var activeKey = yield select(state => state.designer.layoutState.activeKey);
      		var activePage = yield select(state => state.designer.layoutState.activePage);
      		var activeController = yield select(state => state.designer.layoutState.activeController);

      		var elemType = 'page';

      		if(activeKey == activePage.key) {
      			elemType = 'page';
      		}else {
      			elemType = 'controller';
      		}

      		yield put({
      			type: 'setFormItemsByType',
      			payload: {
      				key: activeKey,
      				type: elemType
      			}
      		})
      	},

	},

	reducers: {
		handleClick (state, { payload: key }) {
			return {...state, current: key};
		},

		setActiveFormItem(state, { payload: index }) {
			return {...state};
		},

		readFormItems (state, { payload: index }) {
			state.activeFormItem = index;
			return {...state};
		},

		setActiveElem (state, { payload: activeCtrl }) {
			state.activeElem = activeCtrl;
			return {...state};
		},

		setFormItems (state, { payload: params }) {
			var tmpAttr = [];
			let attr = params.attr;

			for(var att in attr) {
				try {
					attr[att]['attrName'] = att;
					tmpAttr.push(attr[att]);
				} catch(e) {
					console.log(e.message)
				}
			}

			state.theKey = params.key;
			state.formItems = tmpAttr;
			return {...state};
		},

		hideVisual(state) {
			state.visible = false;
			return {...state};
		}
	}

}
