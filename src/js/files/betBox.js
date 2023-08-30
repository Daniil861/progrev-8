import { startData } from './startData.js';
import { initStartData, writeBet } from './script.js';
import { noMoney } from './functions.js';

document.addEventListener('click', (e) => {

	const targetElement = e.target;

	const money = +localStorage.getItem('money');
	const currentBet = +localStorage.getItem('current-bet');

	if (targetElement.closest('[data-button="bet-minus"]') && currentBet > startData.countBet) {
		localStorage.setItem('current-bet', currentBet - startData.countBet);
		writeBet();
	}

	if (targetElement.closest('[data-button="bet-plus"]') && money > currentBet + startData.countBet && currentBet < startData.maxBet) {
		localStorage.setItem('current-bet', currentBet + startData.countBet);
		writeBet();
	}

	if (targetElement.closest('[data-button="max-bet"]')) {
		if (money > startData.maxBet) {
			localStorage.setItem('current-bet', startData.maxBet);
		}
		else if (money < startData.maxBet && money > startData.countBet + 100) {
			const num = money - (money % 5);
			localStorage.setItem('current-bet', num - 100);
		} else if (money < startData.countBet + 100) noMoney('.score');

		writeBet();
	}

	if (targetElement.closest('[data-button="bet-min"]') && money > startData.countBet) {
		localStorage.setItem('current-bet', startData.countBet);
		writeBet();
	}

	if (targetElement.closest('[data-button="bet-reset"]') && money > startData.countBet) {
		localStorage.setItem('current-bet', startData.countBet);
		writeBet();
	}

	if (targetElement.closest('[data-button="bet-semi"]')) {
		let bet = localStorage.getItem('current-bet');
		if (Math.round(bet * 0.5) > 50) {
			localStorage.setItem('current-bet', Math.round(bet * 0.5));
			writeBet();
		}
	}

	if (targetElement.closest('[data-button="bet-x2"]')) {

		let bet = localStorage.getItem('current-bet');
		if (bet * 2 < money) {
			localStorage.setItem('current-bet', bet * 2);
			writeBet();
		} else noMoney('.score');

	}

})