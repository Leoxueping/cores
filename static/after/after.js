(function() {

	var loader = $('body').append('<div class="loader-wrapper"><div class="loader"><p style="position: absolute;padding-bottom: 70px;">正在努力加载</p><div class="loader-inner ball-pulse-sync"><div></div><div></div><div></div></div></div></div>');

	var interval = setInterval(function() {

		var rootChildren = $('#root').children();

		if(rootChildren.length > 0) {
			clearInterval(interval);
			$('.loader-wrapper').remove();
		}

	}, 1);

})();
