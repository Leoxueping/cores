import configs from './config';
import keymap from './keymap';

const HotKeyHandler = {

	currentMainKey: null,
	currentValueKey: null,
	props: null,
	handlers: [],

	init: function (props) {

		HotKeyHandler.props = props;
		HotKeyHandler.handlers = new Array();

		configs.bindKey.map(config => {

			config.mainKey.map(key =>{

				var keys = key.split('+');
				if(keys.length < 2){
					HotKeyHandler.register(key,null,keymap[keys[1]],config.handler);
				}else{
					HotKeyHandler.register(key,keymap[keys[0]],keymap[keys[1]],config.handler);
				}

			});
		});
	},

	register: function(shortcuts, mainKey,key, func) {

		HotKeyHandler.handlers.push({
			shortcuts: shortcuts,
			mainKey:mainKey,
			key: key,
			func: func
		});

		document.onkeyup = function(e) {
			HotKeyHandler.currentMainKey=null;
		}

		document.onkeydown = function(event) {
			//获取键值
			var keyCode = event.keyCode;
			var exec = false;

			HotKeyHandler.handlers.map(handler =>{
				if(handler.mainKey == HotKeyHandler.currentMainKey) {
					if(keyCode == handler.key) {
						HotKeyHandler.currentMainKey = null;
						if(func != null) {
							handler.func(HotKeyHandler.props);
							exec = true;
						}
					}
				}else{
					if(keyCode == handler.key && handler.mainKey == null) {
						if(func != null) {
							handler.func(HotKeyHandler.props);
							exec = true;
						}
					}
				}
			});

			if(keyCode == keymap['ctrl'] || keyCode == keymap['command']){
				HotKeyHandler.currentMainKey=keyCode;
			}
			return !exec;
		}
	}
}

export default HotKeyHandler;
