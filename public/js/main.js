var vp = $.viewport();
var imagePath = './img';
var images = [];
var cacheImageName = [];
var cacheImg = {};
var lastImageIndex = 0;
var MAIN_INTERVAL = 60000; // 60 seconds
var isResizing = false;

// ajax
var getImageNames = function (callback) {
	$.http.get('http://localhost:3000/api/imageNames', {
		complete: function (data) {
			callback(null, JSON.parse(data));
		},
		error: function (err) {
			callback(err);
		}
	});
};

// Functions
var cache = function () {
	images.forEach(function (image) {
		if (cacheImageName.indexOf(image) === -1) {
			cacheImg[image] = new Image();
			cacheImg[image].src = imagePath + '/' + image;
			cacheImageName.push(image);
		}
	});
};

var refresh = function () {
	getImageNames(function (err, data) {
		if (err) {
			console.log(err);
		} else {
			images = data;
			cache();
		}
	});
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

getImageNames(function (err, data) {
	if (err) {
		console.log(err);
	} else {
		images = data;
		cache();

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

	}
});