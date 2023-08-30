import { } from "./script.js";
import { shuffle, addMoney } from "./functions.js";


const gameBonus = document.querySelector('.game__bonus-game');
const bonuses = document.querySelectorAll('[data-bonus]');

const config = {
	arr: [0, 50, 500]
}

export function generateDataBonusGame() {
	config.arr = shuffle(config.arr);
	config.arr.forEach((count, idx) => {
		if (count > 0) {
			bonuses[idx].setAttribute('data-bonus', `+${count}`);
		} else bonuses[idx].setAttribute('data-bonus', `0`);
	})
}

export function openBonusChest(item) {
	item.classList.add('_visible');
	item.querySelector('img').setAttribute('src', 'img/other/chest-opened.png');
	document.querySelector('.bonus-screen__boxes').classList.add('_hold');


	const count = parseInt(item.dataset.bonus);

	if (count > 0) addMoney(count, '.score', 500, 1500);

	setTimeout(() => {
		document.querySelector('.bonus-screen').classList.remove('_visible');
		document.querySelector('.bonus-screen__boxes').classList.remove('_hold');
		exitBonusScreen();
	}, 1500);
}



function exitBonusScreen() {
	document.querySelectorAll('.bonus-screen__box').forEach(item => {
		if (item.classList.contains('_visible')) {
			item.classList.remove('_visible');
			item.querySelector('img').setAttribute('src', 'img/other/chest.png');
		}
	});
}

document.addEventListener('click', (e) => {

	const targetElement = e.target;

	if (targetElement.closest('.bonus-screen__button')) {
		document.querySelector('.bonus-screen').classList.remove('_visible');
		document.querySelector('.bonus-screen__boxes').classList.remove('_hold');
	}

	if (targetElement.closest('.bonus-screen__box')) {
		openBonusChest(targetElement.closest('.bonus-screen__box'));
	}

	if (targetElement.closest('.game__bonus-game')) {
		generateDataBonusGame();
		document.querySelector('.bonus-screen').classList.add('_visible');
	}

})