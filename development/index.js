$(document).ready(function () {
	$('<a href="#" class="open-menu"><span></span><span></span><span></span>Open Menu</a>').appendTo('#header');
	$('<span class="fader"/>').appendTo('#header');
	$('.open-menu').click(function () {
		$('body').toggleClass('menu-opened');
		return false;
	});
	$('.fader').click(function () {
		$('body').removeClass('menu-opened');
	});//mobile-menu
});


