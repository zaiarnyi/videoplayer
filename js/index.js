window.addEventListener('DOMContentLoaded', () => {
	video('.video');
});
function video(selector) {
	const wrap = document.querySelector(selector),
		video = document.querySelector('.player');

	//Active function
	createControls();

	//Controls
	const wrapPanel = wrap.querySelector('.video-wrapper'),
		btnPlay = wrap.querySelector('.video-play'),
		btnSpeedUp = wrap.querySelector('.video-speed-up'),
		btnSpeedDown = wrap.querySelector('.video-speed-down'),
		btnSpeedNormal = wrap.querySelector('.video-speed-normal'),
		btnRangeVol = wrap.querySelector('.video-volume'),
		wrapProgress = wrap.querySelector('.wrap-progress'),
		progress = wrapProgress.querySelector('.video-progress'),
		spanCurrentTime = wrapProgress.querySelector('.video-current-time'),
		spanAllTime = wrapProgress.querySelector('.video-all-time'),
		btnFullScreen = wrap.querySelector('.video-fullscreen');

	//Event
	btnPlay.addEventListener('click', play);
	btnPlay.addEventListener('dblclick', stop);
	btnSpeedUp.addEventListener('click', speedUp);
	btnSpeedDown.addEventListener('click', speedDown);
	btnSpeedNormal.addEventListener('click', speddNormal);
	btnRangeVol.addEventListener('input', rangeVol);
	video.addEventListener('timeupdate', progressVideo);
	video.addEventListener('loadedmetadata', allTime);
	video.addEventListener('ended', finishVideo);
	progress.addEventListener('click', videoRewind);
	btnFullScreen.addEventListener('click', fullScreenControl);

	//Динамическое создание кнопок управления
	function createControls() {
		const fragment = document.createDocumentFragment(),
			div = document.createElement('div'),
			btnPlay = document.createElement('button'),
			btnSpeedUp = document.createElement('button'),
			btnSpeedDown = document.createElement('button'),
			btnSpeedNormal = document.createElement('button'),
			btnRangeVol = document.createElement('input'),
			wrapProgress = document.createElement('div'),
			progress = document.createElement('progress'),
			spanCurrentTime = document.createElement('span'),
			spanAllTime = document.createElement('span'),
			btnFullScreen = document.createElement('button');

		//Add classList for new elements
		div.classList.add('video-wrapper');
		btnPlay.classList.add('video-play');
		btnSpeedUp.classList.add('video-speed-up');
		btnSpeedDown.classList.add('video-speed-down');
		btnSpeedNormal.classList.add('video-speed-normal');
		btnRangeVol.classList.add('video-volume');
		btnRangeVol.setAttribute('type', 'range');
		btnRangeVol.setAttribute('step', '0.1');
		btnRangeVol.setAttribute('min', '0');
		btnRangeVol.setAttribute('max', '1');
		wrapProgress.classList.add('wrap-progress');
		progress.classList.add('video-progress');
		progress.setAttribute('max', '100');
		progress.setAttribute('value', '0');
		spanCurrentTime.classList.add('video-current-time');
		spanAllTime.classList.add('video-all-time');
		btnFullScreen.classList.add('video-fullscreen');

		//Add textContent for new elements
		btnPlay.textContent = 'Play';
		btnSpeedUp.textContent = 'Up';
		btnSpeedDown.textContent = 'Down';
		btnSpeedNormal.textContent = 'Normal';
		btnRangeVol.textContent = 'Volume';
		spanCurrentTime.textContent = editTime(~~video.currentTime / 100);
		btnFullScreen.textContent = 'full';

		//Add new elements in fragment
		div.appendChild(btnPlay);
		wrapProgress.appendChild(spanCurrentTime);
		wrapProgress.appendChild(progress);
		wrapProgress.appendChild(spanAllTime);
		div.appendChild(wrapProgress);
		div.appendChild(btnSpeedUp);
		div.appendChild(btnSpeedDown);
		div.appendChild(btnSpeedNormal);
		div.appendChild(btnRangeVol);
		div.appendChild(btnFullScreen);
		fragment.appendChild(div);
		wrap.appendChild(fragment);
	}
	//Функция Запуска/при повторном нажатии - паузы/При двойном нажатии стоп
	function play() {
		video.playbackRate = 1;
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}
	//Функция при двойном нажатии - стоп
	function stop() {
		video.pause();
		video.currentTime = 0;
	}
	//Функция для ускорение видео
	function speedUp() {
		video.playbackRate = 2;
	}

	//Функция для замедления видео
	function speedDown() {
		video.playbackRate = 1;
	}

	//Функция для восстановление скорости видео
	function speddNormal() {}

	//Функция для регулировки звука
	function rangeVol() {
		let v = this.value;
		video.volume = v;
	}

	//Функция для полосы всего видео
	function progressVideo() {
		let d = video.duration,
			c = video.currentTime;
		progress.value = (100 * c) / d;
		spanCurrentTime.textContent = editTime(c);
	}

	//Функция для вывода времени всего видео
	function allTime() {
		spanAllTime.textContent = editTime(video.duration);
	}

	//Функция для перемещение по видео с помощью прогрессбара
	function videoRewind(e) {
		let widthProgress = this.offsetWidth,
			positionTarget = e.offsetX;

		this.value = (100 * positionTarget) / widthProgress;
		video.pause();
		video.currentTime = video.duration * (positionTarget / widthProgress);
		if (!unlock) {
			video.play();
		}
	}

	//Функция, которая сбрасывает к началу, после просмотра всего видео, спустя 1 секунду
	function finishVideo() {
		setTimeout(() => {
			video.currentTime = 0;
		}, 1000);
	}

	//Вспомогательная функция для корректного отображения времени
	function editTime(time) {
		var h = Math.floor(time / (60 * 60)),
			dm = time % (60 * 60),
			m = Math.floor(dm / 60),
			ds = dm % 60,
			s = Math.ceil(ds);
		if (s === 60) {
			s = 0;
			m = m + 1;
		}
		if (s < 10) {
			s = '0' + s;
		}
		if (m === 60) {
			m = 0;
			h = h + 1;
		}
		if (m < 10) {
			m = '0' + m;
		}
		if (h === 0) {
			fulltime = m + ':' + s;
		} else {
			fulltime = h + ':' + m + ':' + s;
		}
		return fulltime;
	}

	//Функция для полноэкранного просмотра
	function fullScreenControl() {
		const fullEnabled =
			document.fullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.documentElement.webkitRequestFullScreen;

		if (!fullEnabled) return false;

		requestFullscreen(video);

		function requestFullscreen(element) {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		}
	}
}
