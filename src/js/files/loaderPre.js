//================
//  Анимируем загрузку экрана
export function digitsCounterInit(digitsCountersItems) {
	const digitCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll('[data-digits-counter]');
	if (digitCounters) {
		digitCounters.forEach(digitCounter => {
			digitsCountersAnimate(digitCounter);
		})
	}
}

function digitsCountersAnimate(digitsCounter) {
	let startTimestamp = null;

	const duration = parseInt(digitsCounter.dataset.digitsCounter) ? parseInt(digitsCounter.dataset.digitsCounter) : 1000;
	const startValue = parseInt(digitsCounter.innerHTML);
	const startPosition = 0;
	const innerBar = document.querySelector('.loader__loading-inner');
	const step = (timestamp) => {
		if (!startTimestamp) startTimestamp = timestamp;
		const progress = Math.min((timestamp - startTimestamp) / duration, 6);

		const percent = `${Math.floor(progress * (startPosition + startValue))}%`;
		digitsCounter.innerHTML = percent;
		innerBar.style.width = percent;

		if (progress < 1) {
			window.requestAnimationFrame(step);

		} else {
			setTimeout(() => {
				location.href = 'main.html';
			}, 500);

		}
	}
	window.requestAnimationFrame(step);
}