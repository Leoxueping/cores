export default {
	leftSidebarCollapseChange(e) {
		setTimeout(function toDo() {
			let construction = document.getElementsByClassName('toGetConstructionHeight')[0],
				controllers = document.getElementsByClassName('consCollapseTopBorder')[0];
			if (e.length != 0) {
				controllers.style.height = 'calc(100vh - 38px - ' + construction.offsetHeight + 'px)';
			}
			if(e[0] == 'controllers' && e.length == 1) {
				controllers.style.height = 'calc(100vh - 68px)';
			}
		},400)
	},

	leftSidebarWhenLoaded() {
		const toDo = () => {
			let construction = document.getElementsByClassName('toGetConstructionHeight')[0],
				controllers = document.getElementsByClassName('consCollapseTopBorder')[0];
			if(controllers) {
				controllers.style.height = 'calc(100vh - 38px - ' + construction.offsetHeight + 'px)';
			}else {
				this.leftSidebarWhenLoaded();
			}
			
		}
		setTimeout(toDo, 400)
		
	}

}