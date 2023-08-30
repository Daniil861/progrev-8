
import { addMoney, deleteMoney, noMoney } from './functions.js';
import { configGame, startGame, getDataFirstColb, getDataSecondColb, stopGame } from './script.js';
import { startData } from './startData.js';


// Объявляем слушатель событий "клик"
document.addEventListener('click', (e) => {

	const wrapper = document.querySelector('.wrapper');

	const targetElement = e.target;

	const money = +localStorage.getItem('money');
	const bet = +localStorage.getItem('current-bet');

	// privacy screen
	if (targetElement.closest('.preloader__button')) {
		location.href = 'main.html';
	}

	// main screen
	if (targetElement.closest('[data-button="privacy"]')) {
		location.href = 'index.html';
	}

	if (targetElement.closest('[data-level]') && !wrapper.classList.contains('_game')) {
		const level = +targetElement.closest('[data-level]').dataset.level;
		configGame.level = level;

		startGame();

		setTimeout(() => {
			wrapper.classList.add('_game');
		}, 250);
	}

	if (targetElement.closest('[data-button="game-home"]')) {
		wrapper.setAttribute('class', 'wrapper');
		setTimeout(() => {
			stopGame();
		}, 1000);
	}

	if (targetElement.closest('[data-colb]') && configGame.state === 2) {
		getDataSecondColb(targetElement.closest('[data-colb]'));
	}

	if (targetElement.closest('[data-colb]') && configGame.state === 1) {
		getDataFirstColb(targetElement.closest('[data-colb]'));
	}

})



