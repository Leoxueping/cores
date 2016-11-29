import dva from 'dva';
import request from '../../utils/request.js';
import randomWord from '../../utils/randomString.js'

const findParentNode = (treeData, parentDirName, lvl) => {
	var parentNode;
	for (var i = 0; i < treeData.length; i++) {
		var node = treeData[i];

		if(node.key + '/' == parentDirName || node.key == parentDirName) {
			parentNode = {
				node: node,
				index: i,
				lvl: lvl
			};
			return parentNode;
		}

		if(node.children) {
			parentNode = findParentNode(node.children, parentDirName, lvl + 1);
			if(parentNode) {
				return parentNode;
			}
		}
	};
}

export default {
	namespace: 'file',
	state: {
		treeData: [],

		focus: false,

		newFileInput: {
			value: '未命名',
			visible: false
		},

		newFolderInput: {
			value: '未命名',
			visible: false
		},

		uploadInput: {
			value: '',
			visible: false
		},

		searchInput: {
			value: '',
			visible: false
		},

		contextMenuStyles: {
		    position: 'fixed',
		    top: '',
		    left: '',
		    display: 'none'
		},

		renameModal: {
			visible: false,
			value: ''
		},
		saveModal: {
			visible: false,
			title: ''
		},
		newFileNameModal: {
			visible: false,
			value: '',
			title: ''
		},
		searchFilePane: {
			visible: false,
			files: [
				{name: 'index.js',key: 0},
				{name: 'readme.md',key: 1},
				{name: 'require.js',key: 2},
			],
			inputValue: ''
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'fetchFileList',
          		});
	      	});
		}
	},

	effects: {
		*fetchFileList(payload, {call, put}) {
      		var fileList = yield request('fs/list/file/?id=node-hello_ivydom');
	      	yield put({ type: 'list', payload: fileList });
      	},

      	// *fetchLastChildFile(payload: dirName,{call, put}) {
      	// 	var fileList = yield request('fs/list/file/?id=' + dirName);
      	// 	yield put({ type: 'handleLastChildFile', payload: {
      	// 		fileList
      	// 	}
      	// });
      	// },

      	*fetchFileNode({payload: params}, {call, put}) {
      		const dirName = params.treeNode.props.eventKey;
      		var fileList = yield request('fs/list/file/?id=' + dirName);
      		yield put({ type: 'treeOnLoadData', payload: {
      			fileList,
      			dirName
      		}
      	});
      		params.resolve();
      	},

      	*mkdir({payload: dirName}, {call, put, select}) {
      		var val = yield select(state => state.file.newFolderInput.value);
      		var mkResult = yield request('fs/mkdir', {
      			method: 'POST',
      			body: JSON.stringify({
      				dirName: localStorage.currentFolder + val
      			})
      		});
      		yield put({type: 'fetchFileList'});
      		yield put({type: 'handleNewFolderInputVisible'})
      	},

      	*touch({payload: dirName}, {call, put, select}) {
      		var val = yield select(state => state.file.newFileInput.value);
			var mkResult = yield request('fs/write', {
      			method: 'POST',
      			body: JSON.stringify({
      				fileName: localStorage.currentFolder + val,
      				data: ''
      			})
      		});
      		yield put({type: 'fetchFileList'});
      	},

      	*renameFile({payload: params}, {call, put, select}) {
      		var val = yield select(state => state.file.renameModal.value);
			var mkResult = yield request('fs/rename', {
      			method: 'POST',
      			body: JSON.stringify({
      				fileName: localStorage.currentFolder + params.fileName,
      				newFileName: localStorage.currentFolder + val
      			})
      		});
      		yield put({type: 'fetchFileList'});
      	},

      	*removeFile({payload: fileName}, {call, put}) {
			var mkResult = yield request('fs/remove/', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.currentFolder + fileName
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*rmdir({payload: dirName}, {call, put}) {
			var mkResult = yield request('fs/rmdir/', {
				method: 'POST',
				body: JSON.stringify({
					dirName: localStorage.currentFolder + dirName
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*mvFile({payload: params}, {call, put}) {
			var mkResult = yield request('fs/move/', {
				method: 'POST',
				body: JSON.stringify({
					fileName: localStorage.currentFolder + params.fileName,
					newFileName: params.newFileName,
					move: true
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*copyFile({payload: params}, {call, put}) {
			var mkResult = yield request('fs/copy/', {
				method: 'POST',
				body: JSON.stringify({
					file: localStorage.currentFolder + params.fileName,
					newFile: params.newFileName
				})
			});
      		yield put({type: 'fetchFileList'});
      	},

      	*readFile({payload: fileName}, {call, put}) {
			var readResult = yield request('fs/read', {
      			method: 'POST',
      			body: JSON.stringify({
      				fileName: localStorage.currentFolder + fileName,
      			})
      		});
      		var content = readResult.data
      		// console.log(content)
      		content = content.fields;
      		// console.log(content);
			yield put({
				type: 'devpanel/add',
				payload: {
					title: content.fileName,
					type: 'editor',
					content: content.content,
					editorId: randomWord(8,10)
				}
			})
      	},

      	*writeFile({payload: params}, {call, put}) {

					var fileName = '';
					if(params.fileName == null){
						fileName = localStorage.currentSelectedFile;
					}else{
						fileName = params.fileName;
					}
			var mkResult = yield request('fs/write/', {
				method: 'POST',
				body: JSON.stringify({
					fileName: fileName,
					data: params.content
				})
			});
			yield put({type: 'fetchFileList'});
      	},

      	*handleUpload({payload: fileName}, {call, put, select}) {
      		var val = yield select(state => state.file.uploadInput.value);
      	},

      	*handleSearch({payload: fileName}, {call, put, select}) {
      		yield put({type: 'showSearchPane'});
      		var val = yield select(state => state.file.searchInput.value);
      	}

	},

	reducers: {
		
		showSearchPane(state) {
			state.searchFilePane.visible = true;
			state.searchInput.visible = false;
			return {...state};
		},

		hideSearchPane(state) {
			state.searchFilePane.visible = false;
			return {...state};
		},

		searchInputChange(state,{payload: value}){
			state.searchFilePane.inputValue = value;
			return {...state};
		},

		showContextMenu(state, {payload: proxy}) {
			var evt = proxy.event;
			return {...state, contextMenuStyles: {
				display: 'block',
				position: 'fixed',
				top: proxy.event.clientY,
				left: proxy.event.clientX
			}}
		},

		hideContextMenu(state) {
			if(state.contextMenuStyles.display != 'none') {
				return {...state, contextMenuStyles: {
					display: 'none',
					position: 'fixed',
					top: 0,
					left: 0
				}};
			}
			return {...state};
		},

		handleNewFileInputChange(state, {payload: val}) {
			return {...state, newFileInput: {
				value: val
			}};
		},

		handleNewFolderInputVisible(state) {
			console.log('handleNewFolderInputVisible');
			return {...state, newFolderInput: {
				visible: false,
				value: ''
			}};
		},

		handleNewFolderInputChange(state, {payload: val}) {
			return {...state, newFolderInput: {
				value: val,
				visible: true
			}};
		},
		handleSearchInputChange(state, {payload: val}) {
			state.searchInput.value = val;
			state.searchFilePane.inputValue = val
			return {...state};
		},
		handleUploadInputChange(state, {payload: val}) {
			return {...state, uploadInput: {
				value: val
			}};
		},

		hideRenameModal(state) {
			return {...state, renameModal: {
				visible: false
			}};
		},

		showRenameModal(state) {
			return {...state, renameModal: {
				visible: true
			}};
		},
		handleRenameInputChange(state, {payload: val}) {
			return {...state, renameModal: {
				value: val,
				visible: true
			}}
		},
		hideSaveModal(state) {
			return {...state, saveModal: {
				visible: false,
				showInput: false
			}};
		},

		showSaveModal(state, {payload: params}) {


			console.log(params.targetKey);
			if(params.action == 'remove') {
				console.log("saveModal");
				return {...state, saveModal: {
					visible: true,
					title: '保存文件？'
				}};
			}else{
				return {...state, saveModal: {
					visible: false
				}};
			}

		},
		hideSaveModal(state) {
			return {...state, saveModal: {
				visible: false,
				showInput: false
			}};
		},

		showNewFileNameModal(state, {payload: params}) {

				if(params.type == 'editor') {
					console.log("saveModal");
					return {...state, newFileNameModal: {
						visible: true,
						value: localStorage.currentFolder,
						title: '请输入文件名'
					}};
				}


		},
		hideNewFileNameModal(state) {
				return {...state, newFileNameModal: {
					visible: false,
					showInput: false
				}};
			},
		handleNewFileModelInputChange(state, {payload: val}) {
			console.log(val);
			return {...state, newFileNameModal: {
				value: val,
				visible: true,
				title: '请输入文件名'
			}}
		},
		write (state, {payload: key}) {
			return {...state, current: key};
		},

		// handleLastChildFile(state,payload: params) {
		// 	console.log(params.fileList);
		// },

		list (state, {payload: list}) {
			var data = list.data,
				tree = [];

			for (var i = 0; i <= data.length - 1; i++) {
				var curr = data[i],
					tmpTree = {};

				tmpTree.name = curr.text;
				tmpTree.key = curr.id;
				tmpTree.isLeaf = !curr.children;
				tmpTree.original = curr;

				tree.push(tmpTree);
			};

			console.log(tree);

			return {...state, treeData: [{
				isLeaf: false,
				key: 'node-hello_ivydom',
				name: 'root',
				children: tree,
				original: {
					folder: 'null'
				}
			}]};
		},

		treeOnSelect (state, {payload: key}) {

		},

		treeOnCheck (state, {payload: key}) {

		},

		treeOnLoadData (state, {payload: params }) {
			var files = params.fileList.data,
				parentDirName = params.dirName;

			var treeData = state.treeData,
				childNode = [],
				parentNodeIndex;

			var parentNode = findParentNode(state.treeData, parentDirName, 1);

			const generatorNode = (files) => {
				var childNode = [];
				files.map(file => {
					var tmpChild = {};
					tmpChild.name = file.text;
					tmpChild.key = file.id;
					tmpChild.isLeaf = !file.children;
					tmpChild.original = file;
					childNode.push(tmpChild);
				});
				return childNode;
			}

			const setLeaf = (treeData, parentNode) => {

			  	const loopLeaf = (data, parent) => {
			  		var parentNodeA = parent.node.original.folder;
			  		parentNodeA = findParentNode(data, parentNodeA, parent.lvl - 1);

			  		if(!parentNodeA) {
						data[parentNode.index].children = childNode;
			  		}else {
			  			var currNode = data[parentNodeA.index];
			  			if(!currNode) {
			  				loopLeaf(parentNodeA.node.children, parent);
			  			}else {
			  				currNode = currNode.children;
			  				if(!currNode) {
			  					loopLeaf(parentNodeA.node.children, parent);
			  				}else {
								currNode[parent.index].children = childNode;
			  				}
			  			}
			  		}
			  	};

			  	loopLeaf(treeData, parentNode);
			}

			if(parentNode.node.key + '/' == parentDirName || parentNode.node.key == parentDirName) {
				childNode = generatorNode(files);
			}

			if(parentNode.index == undefined) {
				throw '不匹配的文件树'
			}

			setLeaf(treeData, parentNode);

			return {...state, treeData};
		}
	}

}
