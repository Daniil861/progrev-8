import { deleteMoney, addMoney, addRemoveClass, getRandom } from "./functions.js";


//========================================================================================================================================================
//game-drum

export const config_game = {
	state: 1, // 1 - not play, 2 - play
	last_rotate: 0,
	count_win: 0,
	priceStep: 50,
	coeffWin: 5,
	userSelect: ''
}
export function rotateDrum() {
	config_game.last_rotate += getRandom(100, 2000);
	document.querySelector('.circle__drum-box').style.transform = `rotate(${config_game.last_rotate}deg)`;
	document.querySelector('.circle__drum-box').style.transition = '2s';
}
export function getTargetBlock() {
	let arrow_top = document.querySelector('.circle__dot').getBoundingClientRect().top;
	let arrow_left = document.querySelector('.circle__dot').getBoundingClientRect().left;

	let target_block2 = document.elementFromPoint(arrow_left, arrow_top);

	return target_block2;
}

export function checkTargetItem(block) {

	const value = block.dataset.target;

	if (value != 'repeat') {
		if (config_game.userSelect == value) {
			const winCount = config_game.priceStep * config_game.coeffWin;
			addMoney(winCount, '.score', 1000, 2000);
		}
		removeHoldButtons();
	} else if (value == 'repeat') {
		const money = +localStorage.getItem('money');
		if (money >= config_game.priceStep) {

			rotateDrum();

			holdButtons();

			setTimeout(() => {
				const block = getTargetBlock();
				checkTargetItem(block);
			}, 2100);
		}
	}
}

function holdButtons() {
	document.querySelectorAll('[data-lucky]').forEach(button => {
		button.classList.add('_hold');
		if (button.dataset.lucky == config_game.userSelect) button.classList.add('_active');
	});
}

function removeHoldButtons() {
	document.querySelectorAll('[data-lucky]').forEach(button => {
		button.classList.remove('_hold');
		if (button.classList.contains('_active')) button.classList.remove('_active');
	});
}

document.addEventListener('click', (e) => {
	const targetElement = e.target;

	const money = +localStorage.getItem('money');
	const wrapper = document.querySelector('.wrapper');


	if (targetElement.closest('[data-button="drum-home"]')) {
		wrapper.classList.remove('_drum');
	}

	if (targetElement.closest('[data-button="drum"]')) {
		wrapper.classList.add('_drum');
	}

	//========================================================================================================================================================
	//game
	if (targetElement.closest('[data-lucky]')) {
		if (money >= config_game.priceStep) {
			config_game.userSelect = targetElement.closest('[data-lucky]').dataset.lucky;

			deleteMoney(config_game.priceStep, '.score', 'money');
			rotateDrum();

			holdButtons();

			setTimeout(() => {
				const block = getTargetBlock();
				checkTargetItem(block);
			}, 2100);
		}
	}
	//========================================================================================================================================================

})