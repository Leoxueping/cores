import React , { PropTypes } from 'react';
import { Menu, Spin, Icon, Modal, Input, Button, message, notification, Tabs, Card, Popconfirm, Row, Col, Dropdown, Form, Radio, Switch } from 'antd';

import { Tooltip } from 'antd';

const TabPane = Tabs.TabPane;

import { connect } from 'dva';
import { Router, Route, IndexRoute, Link } from 'dva/router';

import CodingEditor from './Panel/Editor.js';
import Terminal from './Panel/Terminal.js';
import randomWord from '../utils/randomString';
import dndHandler from './Panel/dndHandler';
import keyRegister from './keybinding/register';
import initApplication from '../utils/initApplication';
import gitTerminal from '../utils/gitTerminal';

import Previewer from './Panel/Previewer.js';

import { Steps } from 'antd';
import { Progress } from 'antd';

import Dashboard from './TopBar/Dashboard.js';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const ButtonGroup = Button.Group;
const Step = Steps.Step;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const InputGroup = Input.Group;
const confirm = Modal.confirm;

const LeftSidebar = (props) => {

	dndHandler.init(props);
	keyRegister.init(props);

	var styles = {
		sidebar: {
			height: '100%'
		},

		ifr: {
			width: '100%',
			height: parseInt(document.body.clientHeight) - 300,
			border: 'none'
		},

		wrapper: {
			height: '100%'
		}
	};
	const initApplications = () => {
		if(props.sidebar.applications.length < 1) {
			return;
		}
		return props.sidebar.applications.map(application => {
			return  ( <Col className="gutter-row" span={6} style={{marginTop: 20}} key={application.id}>
						 <div className="gutter-box">
								<Card onClick={leftSidebarProps.openApp.bind(this,application)} extra={
									<Popconfirm onClick={(e) => e.stopPropagation()} title="确认删除此项目?"
									onConfirm={leftSidebarProps.confirmDeleteApp.bind(this,application.id)}
									onCancel={leftSidebarProps.cancelDeleteApp} okText="Yes" cancelText="No">
										<a className="delete-app">
											<Icon type="close" />
										</a>
									</Popconfirm>
								} style={{ width: 110, height: 110 }}
								bodyStyle={{height: '100%', background: 'whitesmoke', display:'flex',
											color: '#555', cursor: 'pointer', wordWrap: 'break-word',
											overflow: 'auto'}}>
										<div style={{margin: 'auto', width: '100%', display: 'flex',
													wordBreak: 'break-all', justifyContent: 'center'}}
											className="app-name-hover"
										>
											{application.name}
										</div>
								</Card>
						 </div>
					</Col>
			);
		});
	};

	const initPreviewer = () => {
		if(props.devpanel.loadPreviewer) {
			// return <Previewer></Previewer>;
		}
	}

	const leftSidebarProps = {

	    handleClick(activeMenu) {
	      var handleActiveMenuEvent = {

	        create() {
	        	if(location.hash.indexOf('project') != -1) {
					props.dispatch({
						type: 'sidebar/handleAvailable',
                        payload: {
                            available: true,
                        }
					});
					confirm({
					    title: '即将新建应用',
					    content: '您要保存工作状态后再进行新建操作吗? ',
					    onOk() {
							wechatSave.save();

	    	          		props.dispatch({
				        		type: 'sidebar/showModalNewApp'
				          	});
					    },
					    onCancel() {
							props.dispatch({
				        		type: 'sidebar/showModalNewApp'
				          	});
					    },
					});
	        	}else {
	          		props.dispatch({
		        		type: 'sidebar/showModalNewApp'
		          	});
	        	}
	        },

	        'switch'() {

	        	// if(location.hash.indexOf('project') != -1) {

				props.dispatch({
	            	type: 'sidebar/showModalSwitchApp'
	          	});

				props.dispatch({
	            	type: 'sidebar/getApplications'
	          	});

				// 	confirm({
				// 	    title: '即将切换应用',
				// 	    content: '您确定要切换吗（点击确定将保存您的工作内容并进行切换）',
				// 	    onOk() {

				// 			wechatSave.save();

							

				// 	    },
				// 	    onCancel() {
				// 	    },
				// 	});

				// }else {
				// 	props.dispatch({
		  //           	type: 'sidebar/showModalSwitchApp'
		  //         	});

				// 	props.dispatch({
		  //           	type: 'sidebar/getApplications'
		  //         	});
				// }
		    },

	        commit() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');

		        	props.dispatch({
		        		type: 'sidebar/showModalModifyGitOrgin'
		        	});
				}else {
					modalCommitInfoProps.showModal();
				}
	        },

	        'push'() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				}else {

					var key = "horizontal-dbl";

					props.dispatch({
						type: 'devpanel/setActivePane',
						payload: {
							paneKey: 1
						}
					});

					props.dispatch({
						type: 'devpanel/changeColumnWithHeight',
						payload: {
							key: key,
							height: '70%'
						}
					});

		          	var title = 'git push',
	              		type = 'terminal';
		          	props.dispatch({
	    	        	type: 'devpanel/add',
	        	    	payload: { title, type }
	          		});

					props.dispatch({
						type: 'devpanel/initDebugPanel',
						payload: { cmd: 'cd /root/workspace\n clear && git push -u origin master\n' }
					});

				}
	        },

	        pull() {
	        	if(!props.sidebar.modifyGitOriginInput.isGit) {
					message.error('您尚未添加git源，请先添加');
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					});
				}else {

					props.dispatch({
						type: 'devpanel/setActivePane',
						payload: {
							paneKey: 1
						}
					});

					var key = "horizontal-dbl";
					props.dispatch({
						type: 'devpanel/changeColumnWithHeight',
						payload: {
							key: key,
							height: '70%'
						}
					});

		          	var title = 'git pull',
	              	type = 'terminal';
		          	props.dispatch({
	    	        	type: 'devpanel/add',
	        	    	payload: { title, type }
	          		});

					props.dispatch({
						type: 'devpanel/initDebugPanel',
						payload: { cmd: 'cd /root/workspace\n clear && git pull origin master\n' }
					});
				}
	        },

	        terminal() {
	          	var title = '终端',
	              	type = 'terminal';

				props.dispatch({
					type: 'devpanel/initDebugPanel',
					payload: { cmd: 'cd /root/workspace && clear\n' }
				});

	          	props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
	          	});
	        },

	        file() {

	          	var title = '新文件',
	              	content = '',
	              	type = 'editor',
	              	editorId = randomWord(8, 10);

				localStorage.currentSelectedFile = '新文件';

	            props.dispatch({
	            	type: 'sidebar/setActiveMenu',
	            	payload: 'file'
	            });

				// 更换默认语法
				localStorage.suffix = "js";

	          	props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, content, type, editorId}
	          	});

	          	// localStorage.isSave = true;

	        },

	        designer() {

	        	if(window.gospelDesignerPreviewer) {
	        		message.warning('小程序设计器目前只能打开一个!');
	        		return false;
	        	}

	          	var title = (
						<span>
							<i className="fa fa-weixin"></i> Gospel 小程序 UI 设计器
						</span>
					),

	              	type = 'designer';

	          	var editor = props.dispatch({
	            	type: 'devpanel/add',
	            	payload: {title, type}
	          	});

	        },

	        showStartMenu() {

				if(localStorage.debugType == 'common'){
					// sessionStorage.currentDebugResource = 'http://'+ localStorage.host +':' + localStorage.port;
					// var debug = window.open(location.origin + '/static/debugger/wordpress.html','_blank')
					var debug = window.open('http://'+ localStorage.domain);
					// props.dispatch({
					// 	type: 'devpanel/handleDebugger',
					// 	payload: {debug}
					// });
				}else{
					return false;
				}

	        },

	        pause() {

				if(localStorage.debugType == 'shell') {
					var kill = "kill -9 $(netstat -tlnp | grep "+ localStorage.exposePort +" |awk '{print $7}' | awk -F '/' '{print $1}')\n"
					props.dispatch({
						type: 'devpanel/initDebugPanel',
						payload: { cmd: kill}
					});

					var title = '终端',
							type = 'terminal';
					props.dispatch({
						type: 'devpanel/add',
						payload: {title, type}
					})
				}
	        },

	        preview() {

	        	message.warning('暂不提供预览功能，请关注后续版本');

	        	return false;

	          	var title = (
						<span>
							<i className="fa fa-weixin"></i> 小程序 预览
						</span>
					),

		          	type = 'previewer';

        		props.dispatch({
        			type: 'devpanel/loadPreviewer',
        			payload: true
        		});
	        },

	        'download-weapp'() {
	        	props.dispatch({
	        		type: 'sidebar/showWeappCompilerModal'
	        	});
	        },

	        dashboard () {
	        	props.dispatch({
	        		type: 'dashboard/showDash'
	        	})
	        },

	        feedback () {
	        	props.dispatch({
	        		type: 'sidebar/showFeedback'
	        	});
	        }

	      }

	      if(handleActiveMenuEvent[activeMenu.key]) {
		      handleActiveMenuEvent[activeMenu.key]();
	      }
	    },

	    cancelNewApp() {
	    	if(!props.sidebar.appCreator.loading) {
		      	props.dispatch({
		        	type: 'sidebar/hideModalNewApp'
		      	});
	    	}else {
				const openNotification = () => {
				  	const key = 'cancelNewApp';
				  	const btnClick = function () {
				    	notification.close(key);
    			      	props.dispatch({
		        			type: 'sidebar/hideModalNewApp'
				      	});
    		    		message.success('您已取消创建应用');
				  	};
				  	const cancelBtnClick = function () {
				    	notification.close(key);
				  	};
				  	const btn = [
				  		(<Button type="ghost" size="small" style={{ marginRight: 15 }} onClick={cancelBtnClick}>
				      		不取消
				    	</Button>),

				  		(<Button type="primary" size="small" onClick={btnClick}>
				      		取消
				    	</Button>)
				    ];
				  	notification.open({
				    	message: '应用创建过程中不允许取消喔',
				    	key,
				    	duration: 0
				  	});
				};openNotification();
	    	}
	    },

		//btn,
		//onClose: close

	    createApp() {
			props.dispatch({
				type: 'sidebar/createApp'
			});
			notification.open({
				message: '正在创建应用，请稍等……',
				title: '创建应用'
			});
	    },

	    cancelSwitchApp() {
	      props.dispatch({
	        type: 'sidebar/hideModalSwitchApp'
	      });
	    },

	    confirmDeleteApp(application) {
			notification.open({
				message: '正在删除应用，请稍等……',
				title: '删除应用'
			});
			if(localStorage.applicationId == application){
				localStorage.clear;
				window.location.hash = '#/'
				props.dispatch({
					type: 'devpanel/initPanel',
				})
			}
			props.dispatch({
				type: 'sidebar/deleteApp',
				payload: {application}
			})
	    },

	    cancelDeleteApp() {

	    },

	    openApp(application) {
	    	const swApp = (application) => {
	    		window.location.hash = 'project/' + application.id;
    			props.dispatch({
    				type: 'devpanel/stopDocker',
    				payload: { id: localStorage.applicationId, image: localStorage.image }
    			});
    			window.reload = true
    			window.applicationId = application.id;
    			initApplication(application, props);
	    		
	    	}
			
        	if(location.hash.indexOf('project') != -1) {
	    		if(application.id != localStorage.applicationId) {

	    			confirm({
	    			    title: '即将切换应用',
	    			    content: '您确定要切换吗（点击确定将保存您的工作内容并进行切换）',
	    			    onOk() {
	    					wechatSave.save();
	    					swApp(application);
	    			    },
	    			    onCancel() {
	    			    },
	    			});
	    		}else {
    				props.dispatch({
    			      	type: 'sidebar/hideModalSwitchApp'
    			  	});
	    		}

			}else {
				swApp(application);
			}
	    },

	    switchApp() {

			props.dispatch({
				type: 'sidebar/switchApp'
			})
	    },

		cancelModifyGitOrigin: function() {
			props.dispatch({
				type: 'sidebar/hideModalModifyGitOrigin'
			})
		},

		modifyGitOriginInput: {
			onPressEnter: function() {

				props.dispatch({
					type: 'sidebar/setModifyGitOriginStart'
				});
				if(props.sidebar.gitTabKey == '1'){
					if(props.sidebar.modifyGitOriginInput.value == '' || props.sidebar.modifyGitOriginInput.pushValue == '') {
						message.error('git源不能为空');
						return false;
					}
					var isHttp = /https:\/\/github.com\/?/.test(props.sidebar.modifyGitOriginInput.pushValue) && /https:\/\/github.com\/?/.test(props.sidebar.modifyGitOriginInput.value);
					var isSSH = /git@github.com:?/.test(props.sidebar.modifyGitOriginInput.value) && /git@github.com:?/.test(props.sidebar.modifyGitOriginInput.pushValue);
					if(isHttp){
						console.log('isHttp');
						if(props.sidebar.modifyGitConfigInput.userName == '' || props.sidebar.modifyGitConfigInput.email == '') {
							message.error('git 配置不能为空');
							return false;
						}
						if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(props.sidebar.modifyGitConfigInput.email)){
							message.error('邮箱格式错误');
							return false;
						}
					}
					if (isHttp || isSSH) {
						if(!props.sidebar.modifyGitOriginInput.isGit){
							window.socket.send('clear && git init\n');
							setTimeout(function(){
								window.socket.send('git remote add origin ' + props.sidebar.modifyGitOriginInput.value + ' && clear\n');
								props.dispatch({
									type: 'sidebar/setGitOrigin',
	                                payload: { gitOrigin: props.sidebar.modifyGitOriginInput.value, isGit: true }
								});
								notification.open({
									message: '添加git源成功'
								});

							}, 2000)
						}else{
							window.socket.send('git remote set-url origin ' + props.sidebar.modifyGitOriginInput.value + ' && clear\n');
							window.socket.send('git remote set-url origin ' + props.sidebar.modifyGitOriginInput.value + ' && clear\n');
							notification.open({
								message: '修改git源成功'
							});
						}
					}else{
						message.error('git 源格式错误');
					}
				}
				if(isHttp){
					setTimeout(function(){
						window.socket.send('git config user.name ' + props.sidebar.modifyGitConfigInput.userName + ' --replace-all && clear\n');
						window.socket.send('git config user.email ' + props.sidebar.modifyGitConfigInput.email + ' --replace-all && clear\n');
						setTimeout(function(){
							window.Pname = false;
							window.email = false;
							if(props.sidebar.modifyGitOriginInput.isGit){
								window.socket.send('cd /root/workspace && echo PPemail && git config user.email && echo PPname && git config user.name && clear\n');
								window.getConfig = true;
							}
							notification.open({
								message: '配置成功'
							});
						}, 100)
					},200);
				}
				if(isSSH){
					notification.open({
						message: '请在Github或git@oschina配置你的sshKey'
					});
				}

				setTimeout(function(){
					props.dispatch({
						type: 'sidebar/setModifyGitOriginCompleted'
					});
					props.dispatch({
						type: 'sidebar/hideModalModifyGitOrigin'
					})

				}, 1000)
			},
			onChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitOriginInputChange',
					payload: e.target.value
				})
			},

			onPushValueChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitPushOriginInputChange',
					payload: e.target.value
				})
			}
		},
		modifyGitConfigInput: {
			onPressEnter: function() {
				if(props.sidebar.modifyGitConfigInput.userName == '' || props.sidebar.modifyGitConfigInput.email == '') {
					message.error('git 配置不能为空');
					return false;
				}

				props.dispatch({
					type: 'sidebar/modifyGitOrigin'
				})
			},

			onChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitConfigInputChange',
					payload: e.target.value
				})
			},

			onEmailChange: function(e) {
				props.dispatch({
					type: 'sidebar/handleModifyGitConfigEmailInputChange',
					payload: e.target.value
				})
			}
		},

		onGitOperationTabChanged: function(key) {

			props.dispatch({
				type: 'sidebar/changeGitTabKey',
				payload: { key: key }
			});
			if(key == '3'){
				props.dispatch({
					type: 'sidebar/getKey'
				});
			}
			if(key == ''){

			}
			if(key == '1'){

				window.gitOrigin = true;
				if(props.sidebar.modifyGitOriginInput.isGit){
					window.socket.send("cd /root/workspace && git remote -v | head -1 | awk '{print $2}'\n");
					window.socket.send('echo begin');
				}
				setTimeout(function(){
					window.Pname = false;
					window.email = false;
					if(props.sidebar.modifyGitOriginInput.isGit){
						window.socket.send('cd /root/workspace && echo PPemail && git config user.email && echo PPname && git config user.name && clear\n');
						window.getConfig = true;
					}
				}, 200);
			}
		},

		createAppFromModal() {
			props.dispatch({
				type: 'sidebar/handleAvailable',
				payload: {
					available: true,
				}
			});
			props.dispatch({
				type: 'sidebar/showNewAppAndHideSwitch',
			})
		}
	};

	const compilerModalProps = {
		handleOk () {
        	props.dispatch({
        		type: 'sidebar/startCompileWeapp'
        	});
		},

		handleCancel () {
        	props.dispatch({
        		type: 'sidebar/hideWeappCompilerModal'
        	});
		},

		handleRestart () {
			compilerModalProps.handleCancel();
			setTimeout(function() {
	        	props.dispatch({
	        		type: 'sidebar/showWeappCompilerModal'
	        	});

	        	setTimeout(function() {
					compilerModalProps.handleOk();
	        	}, 200);
			}, 200);
		},

		stepTemplate () {
			return props.sidebar.weappCompiler.steps.map( (item, index) => {
    			return (
			    	<Step key={index} title={item.title} description={item.description} />
    			);
    		});

		}
	};

	const searchCls = {
	    antSearchInput: true,
	    antSearchInputFocus: false,
	};

  	const btnCls = {
	    borderRadius: '0px',
	    marginLeft: '-1px'
	};

	const onSelectStartMenu = function (activeMenu) {
		let handleActiveMenuEvent = {
			runCommand() {

				//分栏
				var kill = "mv /root/temp/.* /root/workspace || kill -9 $(netstat -tlnp | grep "+ localStorage.exposePort +" |awk '{print $7}' | awk -F '/' '{print $1}')\n"
				var cmd = 'cd /root/workspace\n ' + kill  + 'clear\n' + props.sidebar.debugConfig.runCommand + '\n';
				var key = "horizontal-dbl";
				props.dispatch({
					type: 'devpanel/changeColumnWithHeight',
					payload: {
						key: key,
						height: '70%'
					}
				});
				props.dispatch({
					type: 'devpanel/initDebugPanel',
					payload: { cmd: cmd}
				});
				var title = '调试终端 - ' + props.sidebar.debugConfig.runCommand,
					type = 'terminal';
				props.dispatch({
					type: 'devpanel/add',
					payload: {title, type}
				})
				// if(window.debugTerminal){
				// 	fireKeyEvent(window.debug_el,'keydown',17)
				// 	fireKeyEvent(window.debug_el,'keydown',67)
				// 	window.debugTerminal.send(cmd);
				// }else{
				//
				// }
			},
			visit(){
				//分栏
				var url = 'http://' + localStorage.domain;
				window.open(url);
			},
			'run&visit&noleave'(){
				var key = "vertical-dbl";
				props.dispatch({
					type: 'devpanel/changeColumn',
					payload: key
				});
				props.dispatch({
					type: 'devpanel/initDebugPanel',
					payload: {cmd: 'cd /root/workspace && clear\n'}
				});

				var title = '预览',
	        		type = 'previewer',
					url = 'http://' + localStorage.domain;
        		props.dispatch({type: 'devpanel/add',payload: {title,type,url}});
			},
			run() {
				const debugType = {
					common(){
						// sessionStorage.currentDebugResource = 'http://' + localStorage.domain;
						window.open('http://' + localStorage.domain);
						// props.dispatch({
						// 	type: 'devpanel/handleDebugger',
						// 	payload: {debug}
						// });
					},
					shell(){
						//分栏
						var key = "vertical-dbl";
						props.dispatch({
							type: 'devpanel/changeColumn',
							payload: key
						});
						props.dispatch({
							type: 'devpanel/initDebugPanel',
						});

						var title = '启动命令终端',
							type = 'terminal';
						props.dispatch({
							type: 'devpanel/add',
							payload: {title, type}
						})
						//创建termin，执行启动的shell
					}
				}
				debugType["visual"]();
			},
			config() {
				props.dispatch({
					type: 'sidebar/showDebugConfigModal'
				})
			}
		}
		handleActiveMenuEvent[activeMenu.key]()
	}

	//<Menu.Item key='run&visit&noleave' disabled={window.disabled}>在IDE访问</Menu.Item>

	const startMenu = (
		localStorage.debugType == 'shell' &&
		<Menu onClick={onSelectStartMenu}>
			<Menu.Item key='runCommand' disabled={window.disabled}>运行：{props.sidebar.debugConfig.runCommand}</Menu.Item>
			<Menu.Item key='visit' disabled={window.disabled}>访问：http://{localStorage.domain}</Menu.Item>
			<Menu.Divider/>
			<Menu.Item key='config' disabled={window.disabled}>配置...</Menu.Item>
		</Menu>
	)
	const wechatSave = {
		hideModal() {
			props.dispatch({
				type: 'sidebar/handleWechatSave'
			})
			props.dispatch({
				type: 'sidebar/showModalSwitchApp'
			});
			props.dispatch({
				type: 'sidebar/getApplications'
			});
		},
		save(){
			notification.open({
				message: '正在保存工作状态...'
			});
			props.dispatch({
				type: 'UIState/writeConfig'
			});
		}
	}
	const debugConfigModal = {
		formItemLayout: {
			labelCol: { span: 4 },
      		wrapperCol: { span: 16 }
		},
		hideModal() {
			props.dispatch({
				type: 'sidebar/hideDebugConfigModal'
			})
		},
		runCommandChange(event) {
			props.dispatch({
				type: 'sidebar/handleRunCommandChange',
				payload: event.target.value
			})
		},
		startPortChange(event) {
			props.dispatch({
				type: 'sidebar/handleStartPortChange',
				payload: event.target.value
			})
		},
		commitDebugConfigChange() {
			props.dispatch({
				type: 'sidebar/updateCmds',
			})
			notification.open({
	            message: '正在修改端口配置....'
	        });
		}
	}

	const modalAppCreatorFromHandler = {
		onFromGitSwitchChange (s, checked) {
			props.dispatch({
				type: 'sidebar/handleSwitchChanged',
				payload: {
					'switch': s,
					checked: checked
				}
			});
		},

		onFormInputChange (s, dom) {
			if(s == 'git') {

				if(dom.target.value.indexOf('git@') != -1) {
					notification['warning']({
						message: '暂时不支持通过SSH创建',
						description: '请先使用HTTP然后在程序创建完毕后在[设置]菜单中更改Git源',
						duration: 6000
					});

					props.dispatch({
						type: 'sidebar/handleInputChanged',
						payload: {
							input: s,
							value: ''
						}
					});

					return false;
				}

			}

			if(s == 'appName') {

				for(var i = 0; i < 10; i++) {
					if(dom.target.value.indexOf(i.toString()) === 0) {

						notification['warning']({
							message: '首字符不能为数字',
							description: '请重新输入'
						});

						props.dispatch({
							type: 'sidebar/handleInputChanged',
							payload: {
								input: s,
								value: ''
							}
						});
						return false;
					}
				}

				const illegalLetter = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']',
									'{', '}', '\\', '|', ':', ';', '\'', '"', '<', '>', ',', '.', '/', '?'];
					let theCurrentLetter = dom.target.value.replace(props.sidebar.appCreatingForm.appName, '');
					if(illegalLetter.indexOf(theCurrentLetter) !== -1) {
						notification['warning']({
							message: '请勿输入非法字符: \' ' + theCurrentLetter + ' \'',
							description: '请重新输入'
						});
						return false;
					}

				props.dispatch({
					type: 'sidebar/checkProjectAvailable',
					payload: {
						name:  dom.target.value
					}
				});
			}

			props.dispatch({
				type: 'sidebar/handleInputChanged',
				payload: {
					input: s,
					value: dom.target.value
				}
			});

			if(s == 'image') {
				if(dom.target.value != 'wechat:latest'){
					props.dispatch({
						type: 'sidebar/checkAvailable',
						payload: {
							input: s,
							value: dom.target.value
						}
					});
				}else{
					props.dispatch({
						type: 'sidebar/initVersions',
						payload: {
							input: s,
							value: dom.target.value
						}
					});
					props.dispatch({
						type: 'sidebar/initFrameWork',
						payload: {
							input: s,
							value: dom.target.value
						}
					});
					props.dispatch({
						type: 'sidebar/handleAvailable',
                        payload: {
                            available: true,
                        }
					});

				}
			}
		}
	}


	const generateDatabaseSelector = () => {
		if(!props.sidebar.appCreatingForm.isFront) {
			return (
				<div>
			      	<Col span={4} style={{textAlign: 'right'}}>
			      		<span>{props.sidebar.appCreatingForm.databaseShow}：</span>
			      	</Col>
			      	<Col span={8} style={{textAlign: 'left'}}>
			      		<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'createLocalServer')} disabled={props.sidebar.appCreatingForm.isFront} checked={props.sidebar.appCreatingForm.createLocalServer} />
			      	</Col>
				</div>
			);
		}else {
			return (
				<span>{props.sidebar.appCreatingForm.databaseShow}</span>
			);
		}
	}

	const modalAppCreatorProps = {

		appCreatingSteps: [{
		  	title: '基本信息',
		  	content: (
		  		<div>
			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>您的项目名称：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Input onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'appName')} value={props.sidebar.appCreatingForm.appName} />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>从Git创建：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'fromGit')} checked={props.sidebar.appCreatingForm.fromGit} />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.fromGit}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>您的Git项目地址：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
				              	<Input placeholder="暂不支持SSH创建，请使用HTTP" onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'git')} value={props.sidebar.appCreatingForm.git} />
					      	</Col>
					    </Row>
					</div>
		  		</div>
		    ),
		}, {
			title: '选择语言',
			content: (

				<div>
		  			<div style={{ marginTop: 32 }}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择语言：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.image}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'image')}>
									{props.sidebar.images.map(image =><RadioButton value={image.id} key={image.id}>{image.name}</RadioButton>)}
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={props.sidebar.versions.length === 0 }>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择语言版本：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.imageVersion}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'imageVersion')}>
							      	{props.sidebar.versions.map(image =><RadioButton value={image.label} key={image.id}>{image.label}</RadioButton>)}
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={props.sidebar.appCreatingForm.fromGit}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>使用框架：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
					      		<Switch onChange={modalAppCreatorFromHandler.onFromGitSwitchChange.bind(this, 'useFramework')} checked={props.sidebar.appCreatingForm.useFramework}  />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.useFramework || props.sidebar.frameworks.length === 0}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择框架：</span>
					      	</Col>
					      	<Col style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.framework}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'framework')}>
							      	{props.sidebar.frameworks.map(image =><RadioButton value={image.id} key={image.id}>{image.name}</RadioButton>)}
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

				</div>

			)
		}, {
			title: '数据库配置',
			content: (
				<div>
			  		<div style={{ marginTop: 32 }}>
			  		    <Row>
			  		    	{generateDatabaseSelector()}
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>请选择数据库类型：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
							    <RadioGroup
							    	value={props.sidebar.appCreatingForm.databaseType}
							    	onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databaseType')}>
							      	<RadioButton value="mysql">MySQL</RadioButton>
							      	<RadioButton value="mongodb" disabled={props.sidebar.appCreatingForm.mongodb}>MongoDB</RadioButton>
							    </RadioGroup>
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>数据库用户：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
					      		<Input onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databaseAccount')} value={props.sidebar.appCreatingForm.databaseAccount} type="text" />
					      	</Col>
					    </Row>
					</div>

			  		<div style={{ marginTop: 32 }} hidden={!props.sidebar.appCreatingForm.createLocalServer}>
			  		    <Row>
					      	<Col span={4} style={{textAlign: 'right'}}>
					      		<span>数据库密码：</span>
					      	</Col>
					      	<Col span={8} style={{textAlign: 'left'}}>
					      		<Input onPressEnter={() => modalAppCreatorProps.next()} onChange={modalAppCreatorFromHandler.onFormInputChange.bind(this, 'databasePassword')} value={props.sidebar.appCreatingForm.databasePassword} type="password" />
					      	</Col>
					    </Row>
					</div>
				</div>
			)
		}],

		next () {

			if(props.sidebar.currentAppCreatingStep === 0) {

				if(props.sidebar.appCreatingForm.appName == '') {
					message.error('请填写应用名!');
					return false;
				}

				if(props.sidebar.appCreatingForm.fromGit) {
					if(props.sidebar.appCreatingForm.git == '') {
						message.error('请填写git地址');
						return false;
					}
				}

				if(!props.sidebar.appCreatingForm.isProjectNameAvailabel) {
					message.error('您的项目名与已有项目重复，请重新填写');
					return false;
				}

				//初始化语言镜像
				props.dispatch({
					type: 'sidebar/initImages'
				});
			}

			if(props.sidebar.currentAppCreatingStep === 1) {

				if(props.sidebar.appCreatingForm.image == '') {
					message.error('请选择语言');
					return false;
				}

				if(props.sidebar.versions.length > 0) {
					if(props.sidebar.appCreatingForm.imageVersion == '') {
						message.error('请选择语言版本');
						return false
					}
				}

				if(props.sidebar.appCreatingForm.useFramework && props.sidebar.frameworks.length > 0) {
					if(props.sidebar.appCreatingForm.framework == '') {
						message.error('请选择框架版本');
						return false;
					}
				}

			}

			if(props.sidebar.currentAppCreatingStep === 2) {
				modalAppCreatorProps.createApp();
			}else {
				props.dispatch({
					type: 'sidebar/handleNextAppCreatingStep'
				});
			}

		},

		prev () {
			props.dispatch({
				type: 'sidebar/handlePrevAppCreatingStep'
			});
		},

		createApp () {

			if(props.sidebar.currentAppCreatingStep === 2) {
				if(props.sidebar.appCreatingForm.createLocalServer) {
					if(props.sidebar.appCreatingForm.databaseType == '' || props.sidebar.appCreatingForm.databaseAccount == '' || props.sidebar.appCreatingForm.databasePassword == '') {
						message.error('请完整填写数据库信息!');
						return false;
					}
				}
			}
			props.dispatch({
				type: 'sidebar/handleCreateApp',
				payload: {ctx: props}
			});
			notification.open({
				message: '正在创建应用',
				description: '请稍等……'
			});

		}
	}

	var topbarMenu = '';

	if(!window.disabled) {

		if(window.isWeapp) {

			// <Menu.Item key="designer">
		 	//  <Tooltip title="小程序设计器">
			// 		<i className="fa fa-weixin"></i>
			// 	</Tooltip>
			// </Menu.Item>

			topbarMenu = (
		      	<Menu
		      		style={styles.sidebar}
		      		onClick={leftSidebarProps.handleClick}
		      		mode="horizontal">
					<Menu.Item key="create">
				      	<Tooltip title="新建项目">
			          		<Icon type="plus" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="switch">
				      	<Tooltip title="切换项目">
			          		<Icon type="appstore-o" />
			          	</Tooltip>
			        </Menu.Item>
				    <Menu.Item key="preview">
				      	<Tooltip title="预览">
				    		<Icon type="eye-o" />
				      	</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="download-weapp">
				    	<Icon type="cloud-o" />
				    	打包小程序
				    </Menu.Item>
    		        <Menu.Item key="dashboard">
						<Icon type="laptop" />
		        		控制台
			        </Menu.Item>
    		        <Menu.Item key="feedback">
						<Icon type="smile-o" />
						反馈建议
			        </Menu.Item>
			    </Menu>
			);

		}else {

			var debugMenu = '';

			if(localStorage.debugType == 'common') {
				debugMenu = (
				    <Menu.Item key="showStartMenu">
			      		<Tooltip title="调试运行">
							<Icon type="play-circle-o" />
						</Tooltip>
				    </Menu.Item>
				);
			}else {
				debugMenu = (
				    <Menu.Item key="showStartMenu">
				    	<Dropdown overlay={startMenu}  trigger={['click']}>
				      		<Tooltip title="调试运行">
				    			<div style={{width: 30}}>
									<Icon type="play-circle-o" />
								</div>
							</Tooltip>
						</Dropdown>
				    </Menu.Item>
				);
			}

			topbarMenu = (
		      	<Menu
		      		style={styles.sidebar}
		      		onClick={leftSidebarProps.handleClick}
		      		mode="horizontal">
					<Menu.Item key="create">
				      	<Tooltip title="新建项目">
			          		<Icon type="plus" />
			          	</Tooltip>
			        </Menu.Item>
			        <Menu.Item key="switch">
				      	<Tooltip title="切换项目">
			          		<Icon type="appstore-o" />
			          	</Tooltip>
			        </Menu.Item>
				    <Menu.Item key="commit">
				      	<Tooltip title="commit操作">
							<Icon type="check"/>
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="push">
				      	<Tooltip title="push操作">
							<Icon type="upload" />
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="pull">
				      	<Tooltip title="pull操作">
							<Icon type="download" />
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="file">
				      	<Tooltip title="新建文件">
							<Icon type="file-text" />
						</Tooltip>
				    </Menu.Item>
				    <Menu.Item key="terminal">
				      	<Tooltip title="打开终端">
							<Icon type="code-o" />
						</Tooltip>
				    </Menu.Item>
				    {debugMenu}
				    <Menu.Item key="pause">
				      	<Tooltip title="停止运行">
							<Icon type="pause-circle-o" />
						</Tooltip>
				    </Menu.Item>
    		        <Menu.Item key="dashboard">
						<Icon type="laptop" />
		        		控制台
			        </Menu.Item>
					<Menu.Item key="feedback">
						<Icon type="smile-o" />
						反馈建议
			        </Menu.Item>
			    </Menu>
			);

		}

	}else {
		topbarMenu = (

	      	<Menu
	      		style={styles.sidebar}
	      		onClick={leftSidebarProps.handleClick}
	      		mode="horizontal">
				<Menu.Item key="create">
			      	<Tooltip title="新建项目">
		          		<Icon type="plus" />
		          	</Tooltip>
		        </Menu.Item>
		        <Menu.Item key="switch">
			      	<Tooltip title="切换项目">
		          		<Icon type="appstore-o" />
		          	</Tooltip>
		        </Menu.Item>
		        <Menu.Item key="dashboard">
					<Icon type="laptop" />
	        		控制台
		        </Menu.Item>
				<Menu.Item key="feedback">
					<Icon type="smile-o" />
					反馈建议
			    </Menu.Item>
	      	</Menu>

		);

	}

	const modalCommitInfoProps = {
		showModal () {
			props.dispatch({
				type: 'sidebar/showModalCommitInfo'
			});
		},

		hideModal () {
			props.dispatch({
				type: 'sidebar/hideModalCommitInfo'
			});
		},

		commit () {

			modalCommitInfoProps.hideModal();

			props.dispatch({
				type: 'devpanel/setActivePane',
				payload: {
					paneKey: 1
				}
			});

			var key = "horizontal-dbl";
			props.dispatch({
				type: 'devpanel/changeColumnWithHeight',
				payload: {
					key: key,
					height: '70%'
				}
			});

	       	var title = 'git commit',
	          	type = 'terminal';
	       		props.dispatch({
		        	type: 'devpanel/add',
	    	    	payload: { title, type }
	      		});
			props.dispatch({
				type: 'devpanel/initDebugPanel',
				payload: { cmd: 'cd /root/workspace\n clear && git add * && git commit -a -m "' + props.sidebar.modalCommitInfo.title + '"\n' }
			});
			setTimeout(function(){
				props.dispatch({
					type: 'sidebar/handleCommitInfoInputChange',
					payload: {
						value: '',
						input: 'title'
					}
				});
			}, 200);

		},

		onInputChange (input, e) {
			sessionStorage.commitInfo = e.target.value;
			props.dispatch({
				type: 'sidebar/handleCommitInfoInputChange',
				payload: {
					value: e.target.value,
					input: input
				}
			});
		}
	}

	const feedbackProps = {
		'submit' () {
			props.dispatch({
				type: 'sidebar/submitFeedback'
			});
		},

		hideModal () {
			props.dispatch({
				type: 'sidebar/hideFeedback'
			});
		},

		onMsgChange (e) {
			props.dispatch({
				type: 'sidebar/handleFeedbackMsgChange',
				payload: e.target.value
			});
		}
	}

	return (
		<div style={styles.wrapper}>
			{topbarMenu}

	    	<Modal width="80%"  title="新建应用" visible={props.sidebar.modalNewAppVisible}
	          	onOk={leftSidebarProps.createApp} onCancel={leftSidebarProps.cancelNewApp}
	          	footer={[]}
	          	maskClosable={!props.sidebar.appCreator.loading}
	        >
	            <Spin spinning={props.sidebar.appCreator.loading}>
		        	<Steps current={props.sidebar.currentAppCreatingStep}>
				        {modalAppCreatorProps.appCreatingSteps.map(item => <Step key={item.title} title={item.title} />)}
				    </Steps>
					    <div className="steps-content">{modalAppCreatorProps.appCreatingSteps[props.sidebar.currentAppCreatingStep].content}</div>
			        <div className="steps-action">
				          {
				            props.sidebar.currentAppCreatingStep < modalAppCreatorProps.appCreatingSteps.length - 1
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} type="primary" disabled={!props.sidebar.appCreator.available} onClick={() => modalAppCreatorProps.next()}>下一步</Button>
				          }
				          {
				            props.sidebar.currentAppCreatingStep === modalAppCreatorProps.appCreatingSteps.length - 1
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} type="primary" onClick={modalAppCreatorProps.createApp}>立即创建</Button>
				          }
				          {
				            props.sidebar.currentAppCreatingStep > 0
				            &&
				            <Button hidden={!props.sidebar.appCreator.loading} style={{ marginLeft: 8 }} type="ghost" onClick={() => modalAppCreatorProps.prev()}>
				              上一步
				            </Button>
				          }
				    </div>
	            </Spin>

	        </Modal>

	    	<Modal style={{maxWidth: 550}}   title="切换应用" visible={props.sidebar.modalSwitchAppVisible}
	          	onOk={leftSidebarProps.switchApp} onCancel={leftSidebarProps.cancelSwitchApp}
	          	footer={[(<Button key='cancel' onClick={leftSidebarProps.cancelSwitchApp}>取消</Button>)]}
	        >
	            <Spin spinning={props.sidebar.showAppsLoading || props.sidebar.appCreator.loading}>
	        	    <Row gutter={16}>
		        	    <Col className="gutter-row" span={6} style={{marginTop: 20}} key='addApp'>
							 <div className="gutter-box">
									<Card
									style={{ width: 110, height: 110 }}
									bodyStyle={{height: '100%', background: 'whitesmoke', color: '#555', cursor: 'pointer'}}
									>
											<div style={{ height: 50,lineHeight: '50px',textAlign: 'center' }}>
												<a className="create-app-from-modal" onClick={leftSidebarProps.createAppFromModal}>
													<Icon type="plus" />
												</a>

											</div>
									</Card>
							 </div>
						</Col>
						{initApplications()}
        	    	</Row>
        	    </Spin>
	        </Modal>

	        <Modal
	          	title="请输入commit信息"
	          	style={{ top: 20 }}
	          	visible={props.sidebar.modalCommitInfo.visible}
	          	onOk={modalCommitInfoProps.commit}
	          	onCancel={modalCommitInfoProps.hideModal}
	        >

	        	<Input type="text" placeholder="请输入commit信息" onChange={modalCommitInfoProps.onInputChange.bind(this, 'title')} value={props.sidebar.modalCommitInfo.title} onPressEnter={modalCommitInfoProps.commit}></Input>
	        </Modal>

	        <Modal
	          	visible={props.sidebar.weappCompilerModalVisible}
	          	title="小程序打包器"
	          	onOk={compilerModalProps.handleOk}
	          	onCancel={compilerModalProps.handleCancel}
	          	width="60%"
      	        footer={[
		            <Button key="back" type="ghost" size="small" onClick={compilerModalProps.handleCancel}>返回</Button>,
		            <Button key="submit" disabled={props.sidebar.weappCompiler.start} type="primary" size="small" onClick={compilerModalProps.handleOk}>
		              开始
		            </Button>,
		            <Button disabled={props.sidebar.weappCompiler.status == 'success'} key="restart" type="primary" size="small" onClick={compilerModalProps.handleRestart}>
		              重新开始
		            </Button>
		        ]}
	        >
			  	<Steps current={props.sidebar.weappCompiler.current}>
		        	{compilerModalProps.stepTemplate()}
			  	</Steps>
			  	<Spin spinning={props.sidebar.weappCompiler.percent >= 60 && props.sidebar.weappCompiler.percent !== 100}>
			        <div className="steps-content">
	        	        {	
	        	        	props.sidebar.weappCompiler.status !== 'exception' &&
	        	        	(props.sidebar.weappCompiler.percent == 100 ? 
	        	        	<a href={props.sidebar.weappCompiler.filePath} target='blank'>若浏览器没有开始下载，请点击这里</a> : 
	        	        	<Progress type="circle" percent={props.sidebar.weappCompiler.percent} />)
	        	        }
	        	        {
	        	        	props.sidebar.weappCompiler.status === 'exception' && 
	        	        	<Progress type="circle" status='exception' percent={props.sidebar.weappCompiler.percent} />
	        	        }
			        </div>
			    </Spin>
	        </Modal>

	    	<Modal width="60%"  title="添加/更改 Git 源" visible={props.sidebar.modalModifyGitOriginVisible}
	          	onOk={leftSidebarProps.modifyGitOriginInput.onPressEnter} onCancel={leftSidebarProps.cancelModifyGitOrigin}
	        >
			<Spin spinning={props.sidebar.modifyGitOriginInput.loading}>
  			<Tabs className="modalTab" defaultActiveKey="1" onChange={leftSidebarProps.onGitOperationTabChanged}>
    			<TabPane tab="HTTPS" key="1">

		        	<div style={{ marginBottom: 16, marginTop: 16 }}>

				      	<InputGroup style={searchCls}>
				        	<Input
					        	addonBefore="fetch"
				        		value={props.sidebar.modifyGitOriginInput.value}
				        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
				        		onChange={leftSidebarProps.modifyGitOriginInput.onChange}
				        	/>
				     	</InputGroup>

		        	</div>

		        	<div style={{ marginBottom: 16 }}>

				      	<InputGroup style={searchCls}>
				        	<Input
					        	addonBefore="push"
				        		value={props.sidebar.modifyGitOriginInput.pushValue}
				        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
				        		onChange={leftSidebarProps.modifyGitOriginInput.onPushValueChange}
				        	/>
				     	</InputGroup>

		        	</div>

					<div style={{ marginBottom: 16, marginTop: 16 }}  hidden={!props.sidebar.isHttp}>

				      	<InputGroup style={searchCls}>
				        	<Input
					        	addonBefore="user.name"
				        		value={props.sidebar.modifyGitConfigInput.userName}
				        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
				        		onChange={leftSidebarProps.modifyGitConfigInput.onChange}
				        	/>
				     	</InputGroup>

		        	</div>

		        	<div style={{ marginBottom: 16 }}   hidden={!props.sidebar.isHttp}>

				      	<InputGroup style={searchCls}>
				        	<Input
					        	addonBefore="user.email"
				        		value={props.sidebar.modifyGitConfigInput.email}
				        		onPressEnter={leftSidebarProps.modifyGitOriginInput.onPressEnter}
				        		onChange={leftSidebarProps.modifyGitConfigInput.onEmailChange}
				        	/>
				     	</InputGroup>

		        	</div>
    			</TabPane>
    			<TabPane tab="SSH" key="2">
    				<div style={{marginTop: 16}}>
	    				<h4>ssh可以让您免密码使用push操作，请按照以下方法配置SSH：</h4>
	    				<div style={{margin: 10}}>
		    				<ol>
		    					<li>1、点击查看公钥并将其配置到您的Git平台中即可</li>
		    					<li>2、开源中国（gitosc）官方说明：<a href="http://git.oschina.net/oschina/git-osc/wikis/%E5%B8%AE%E5%8A%A9" target="_blank">GitOSC ssh操作说明</a></li>
		    					<li>3、Github 官方说明：<a href="https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/" target="_blank">Github ssh操作说明</a></li>
		    				</ol>
	    				</div>
    				</div>
    			</TabPane>
				<TabPane tab="查看公钥" key="3">
    				<div style={{marginTop: 16}}>
	    				<div style={{margin: 10}}>
							<Input type="textarea" readOnly rows={4} value={props.sidebar.sshKey}/>
	    				</div>
    				</div>
    			</TabPane>

  			</Tabs>
		</Spin>
	        </Modal>

	        <Modal width="30%"  title="配置调试参数" visible={props.sidebar.debugConfig.showConfigModal}
	          	onOk={debugConfigModal.commitDebugConfigChange} onCancel={debugConfigModal.hideModal}
		    >
				<Spin spinning={props.sidebar.debugConfig.loading}>
		    	<Form.Item key="runCommand" label="启动命令" {...debugConfigModal.formItemLayout}>
		    		<Input value={props.sidebar.debugConfig.runCommand}
	         				type="text"
	         				onChange={debugConfigModal.runCommandChange}
	         				placeholder="npm run dev" />
		    	</Form.Item>

		    	<Form.Item key="startPort" label="启动端口" {...debugConfigModal.formItemLayout}>
		    		<Input value={props.sidebar.debugConfig.startPort}
	         				type="number"
	         				onChange={debugConfigModal.startPortChange}
	         				placeholder="8080" />
		    	</Form.Item>
			</Spin>
		    </Modal>
			<Modal width="30%"  title="您正在切换应用" visible={props.sidebar.wechatSaveShow}
	          	onOk={wechatSave.save} onCancel={wechatSave.hideModal}
		    >
				要保存您的设计吗？
		    </Modal>

		    <Dashboard></Dashboard>

			<Modal width="30%"  title="意见建议" visible={props.sidebar.modalFeedback.visible}
	          	onOk={feedbackProps.submit} onCancel={feedbackProps.hideModal}
		    >
		    	<Input type="textarea" placeholder="请留下您的想法:)" value={props.sidebar.modalFeedback.message} rows={4} onChange={feedbackProps.onMsgChange} />
		    </Modal>


			{initPreviewer()}

        </div>

	);

}

function mapStateToProps({ sidebar, editor, editorTop, rightbar, designer, attr ,devpanel,layout}) {
  return { sidebar, editor, editorTop, rightbar, designer, attr ,devpanel,layout};
}

export default connect(mapStateToProps)(LeftSidebar);
