var fs = require('fs');
var vp = $.viewport();
var imagePath = './img';
var images = fs.readdirSync(imagePath);
var lastImageIndex = 0;
var MAIN_INTERVAL = 60000; // 60 seconds
var isResizing = false;

// Function
var deleteExtraFile = function () {
	for (var i = 0; i < images.length; i++) {
		if (images[i].indexOf('png') === -1 && images[i].indexOf('jpg') === -1 && images[i].indexOf('JPG') === -1) {
			images.splice(i--, 1);
		}
	}
};
deleteExtraFile();

var refresh = function () {
	images = fs.readdirSync(imagePath);
	deleteExtraFile();
};

var getImagePath = function (imageName) {
	return 'url(' + imagePath + '/' + imageName + ')';
};

var changeImage = function () {
	// get percent
	var per = Math.floor((parseInt($('#knob').css('left')) / ($('#slider').width() - $('#knob').width())) * 100);

	var imageIndex = Math.floor(images.length * per / 101);

	if (lastImageIndex !== imageIndex) {
		$('#main_image').css({
			backgroundImage: getImagePath(images[imageIndex])
		});
	}

	lastImageIndex = imageIndex;

};

// Event
$(window).on('resize', function () {
	if (isResizing) { return; }
	isResizing = true;

	setTimeout(function () {
		vp = $.viewport();
		$('body').css({
			widht: vp.window.width,
			height: vp.window.height
		});
		isResizing = false;
		console.log('resized');
	}, 1000);
});

$('#knob').on('mousedown', function (e) {
	var minX = 0;
	var maxX = $('#slider').width() - $(this).width() + 1;

	var startX = e.clientX;

	$(this).on('mousemove', function (e) {
		var moveX = e.clientX;
		var diff = moveX - startX;

		// update startX
		startX = moveX;

		var newX = parseInt($(this).css('left')) + diff;

		if (newX < minX) {
			newX = minX;
		}

		if (newX > maxX) {
			newX = maxX;
		} 

		$(this).css({
			left: newX + 'px'
		});

		changeImage();
	});

	$(this).on('mouseup', function () {
		$(this).off('mousemove');
		$(this).off('mouseup');
		$(this).off('mouseout');
	});

	$(this).on('mouseout', function () {
		$(this).off('mousemove');
		$(this).off('mouseup');
		$(this).off('mouseout');
	});

});

// Style
$('body').css({
	widht: vp.window.width,
	height: vp.window.height
});

$('#main_image').css({
	backgroundImage: getImagePath(images[0])
});

// Timer
var mainTimer = setInterval(function() {
	refresh();
}, MAIN_INTERVAL);