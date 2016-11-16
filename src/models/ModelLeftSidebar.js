import dva from 'dva';
import request from '../utils/request.js';

export default {
	namespace: 'sidebar',
	state: {
		modalNewAppVisible: false,
		modalSwitchAppVisible: false,
		modalModifyGitOriginVisible: false,

		modifyGitOriginInput: {
			value: '',
			isGit: false,
			pushValue: ''
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'isGitProject'
          		});
	      	});
		}
	},

	effects: {

		*isGitProject({payload: params}, {call, put, select}) {
      		var isGit = yield request('fs/git/', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: 'node-hello_ivydom'
      			})
      		});

      		if(isGit.data.fields) {
      			//获取origin源
      			var origin = yield request('fs/origin/git', {
	      			method: 'POST',
	      			body: JSON.stringify({
	      				dir: 'node-hello_ivydom'
	      			})
	      		});

	      		yield put({ type: 'setOriginValue', payload: {
	      			origin,
	      			isGit
	      		} })
      		}else {
	      		yield put({ type: 'setIsGit', payload: isGit });      			
      		}

		},

		*modifyGitOrigin({payload: params}, {call, put}) {
			var modifyResult = yield request('fs/origin/modify', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: 'node-hello_ivydom',
      				origin: state.modifyGitOriginInput.value
      			})
      		});
		},

		*pushGit({payload: params}, {call, put}) {
      		var pushResult = yield request('fs/push', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: 'node-hello_ivydom'
      			})
      		});
		},

		*pullGit({payload: params}, {call, put}) {
      		var pullResult = yield request('fs/pull', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: 'node-hello_ivydom'
      			})
      		});
		},

		*pushCommit({payload: params}, {call, put}) {
      		var commitResult = yield request('fs/commit', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: 'node-hello_ivydom'
      			})
      		});

      		console.log(commitResult);
		}

	},

	reducers: {

		showModalNewApp(state) {
			return {...state, modalNewAppVisible: true};
		},

		hideModalNewApp(state) {
			return {...state, modalNewAppVisible: false};
		},

		createApp(state) {
			
		},

		showModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: true};
		},

		hideModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: false};
		},

		switchApp(state) {

		},

		selectApp(state) {

		},

		showModalModifyGitOrgin(state) {
			return {...state, modalModifyGitOriginVisible: true};
		},

		hideModalModifyGitOrigin(state) {
			return {...state, modalModifyGitOriginVisible: false};
		},

		handleModifyGitOriginInputChange(state, {payload: val}) {
			return {...state, modifyGitOriginInput: {
				value: val,
				isGit: state.modifyGitOriginInput.isGit,
				pushValue: state.modifyGitOriginInput.pushValue
			}}
		},

		handleModifyGitPushOriginInputChange(state, {payload: val}) {
			return {...state, modifyGitOriginInput: {
				pushValue: val,
				isGit: state.modifyGitOriginInput.isGit,
				value: state.modifyGitOriginInput.value
			}}
		},

		setIsGit(state, {payload: flag}) {
			return {...state, modifyGitOriginInput: {
				isGit: flag.data.fields,
				value: state.modifyGitOriginInput.value,
				pushValue: state.modifyGitOriginInput.pushValue
			}}
		},

		setOriginValue(state, {payload: params}) {

			var split = params.origin.data.fields.split('	');

			var fetch = split[1],
				push = split[2];

			fetch = fetch.split(' (fetch)')[0];
			push = push.split(' (push)')[0];

			return {...state, modifyGitOriginInput: {
				value: fetch,
				isGit: params.isGit.data.fields,
				pushValue: push
			}}			
		}

	}

}