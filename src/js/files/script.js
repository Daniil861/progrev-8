
import { getRandom, getDigFormat, addMoney, deleteMoney, checkCollision } from '../files/functions.js';
import { startData } from './startData.js';



export function initStartData() {

	if (!localStorage.getItem('money')) {
		localStorage.setItem('money', startData.bank);
	}
	writeScore();

	// if (!localStorage.getItem('resource')) {
	// 	localStorage.setItem('resource', 0);
	// }
	// writeResource();


	if (!localStorage.getItem('current-bet')) {
		localStorage.setItem('current-bet', startData.countBet);
	}
	writeBet();

	// if (!localStorage.getItem('level')) {
	// 	localStorage.setItem('level', 1);
	// }

	// if (!localStorage.getItem('opened-level')) {
	// 	localStorage.setItem('opened-level', 1);
	// }
	// openNewLevel();
}


function writeScore() {
	if (document.querySelectorAll('.score').length) {
		let money = getDigFormat(+localStorage.getItem('money'));
		document.querySelectorAll('.score').forEach(el => {
			el.textContent = money;
		})
	}
}

// function writeResource() {
// 	if (document.querySelector('.resource')) {
// 		let money = getDigFormat(+localStorage.getItem('resource'));
// 		document.querySelectorAll('.resource').forEach(el => {
// 			el.textContent = money;
// 		})
// 	}
// }

export function writeBet() {
	if (document.querySelector(startData.nameItemBet)) {
		document.querySelectorAll(startData.nameItemBet).forEach(el => {
			el.textContent = localStorage.getItem('current-bet');
		})
	}
}

export function openNewLevel() {
	const levelsBlocks = document.querySelectorAll('[data-level-button]');
	const openedLevels = +localStorage.getItem('opened-level');
	if (levelsBlocks.length) {
		for (let i = 0; i < openedLevels; i++) {
			if (levelsBlocks[i].classList.contains('_disabled')) levelsBlocks[i].classList.remove('_disabled');
		}
	}
}


// initStartData();


//========================================================================================================================================================
// Функция присвоения случайного класса анимациии money icon
const anim_items = document.querySelectorAll('.icon-game');

function getRandomAnimate() {
	let number = getRandom(0, 3);
	let arr = ['jump', 'scale', 'rotate'];
	let random_item = getRandom(0, anim_items.length);
	anim_items.forEach(el => {
		if (el.classList.contains('_anim-icon-jump')) {
			el.classList.remove('_anim-icon-jump');
		} else if (el.classList.contains('_anim-icon-scale')) {
			el.classList.remove('_anim-icon-scale');
		} else if (el.classList.contains('_anim-icon-rotate')) {
			el.classList.remove('_anim-icon-rotate');
		}
	})
	setTimeout(() => {
		anim_items[random_item].classList.add(`_anim-icon-${arr[number]}`);
	}, 100);
}

if (anim_items.length) {
	setInterval(() => {
		getRandomAnimate();
	}, 20000);
}

//========================================================================================================================================================
// game

const colb1 = document.querySelector('[data-colb="1"]');
const colb2 = document.querySelector('[data-colb="2"]');
const colb3 = document.querySelector('[data-colb="3"]');
const colb4 = document.querySelector('[data-colb="4"]');
const colb5 = document.querySelector('[data-colb="5"]');
const colb6 = document.querySelector('[data-colb="6"]');
const colb7 = document.querySelector('[data-colb="7"]');
const colbs = document.querySelectorAll('[data-colb');

const firework = document.querySelector('.pyro');
const wrapper = document.querySelector('.wrapper');

export const configGame = {
	state: 1, // 1 - not start game, 2 - play game

	level: 1,

	colorMigrate: '',
	firstColbMigrateNumber: null,
	firstColbMigrateItem: null,

	colbs: {
		1: {
			currentArr: [],
			levels: {
				1: ['red', 'red', 'red'],
				2: ['blue', 'red', 'blue', 'red'],
				3: ['orange', 'red', 'blue', 'orange'],
				4: ['orange', 'orange', 'red', 'blue'],
				5: ['orange', 'yellow', 'blue', 'pink'],
				6: ['blue', 'pink', 'yellow', 'orange'],
			}
		},
		2: {
			currentArr: [],
			levels: {
				1: ['red'],
				2: ['red', 'blue', 'red', 'blue'],
				3: ['orange', 'orange', 'red', 'blue'],
				4: ['blue', 'orange', 'red', 'blue'],
				5: ['pink', 'red', 'orange', 'red'],
				6: ['blue', 'orange', 'red', 'yellow'],
			}
		},
		3: {
			currentArr: [],
			levels: {
				2: [],
				3: ['blue', 'red', 'blue', 'red'],
				4: ['red', 'blue', 'orange', 'red'],
				5: ['yellow', 'yellow', 'red', 'blue'],
				6: ['yellow', 'blue', 'pink', 'blue'],
			}
		},
		4: {
			currentArr: [],
			levels: {
				3: [],
				4: [],
				5: ['yellow', 'orange', 'blue', 'pink'],
				6: ['red', 'orange', 'red', 'pink'],
			}
		},
		5: {
			currentArr: [],
			levels: {
				3: [],
				4: [],
				5: ['orange', 'pink', 'red', 'blue'],
				6: ['orange', 'yellow', 'red', 'pink'],
			}
		},
		6: {
			currentArr: [],
			levels: {
				5: [],
				6: [],
			}
		},
		7: {
			currentArr: [],
			levels: {
				5: [],
				6: [],
			}
		},
	}

}

export function startGame() {
	wrapper.setAttribute('data-game-level', configGame.level);

	// Оставляем активными количество колб в соответствии с текущим уровнем
	showStartColbsForCurrentLevel();

	// Записываем стартовые краски в колбы
	drawStartColbsForCurrentLevel();
	drawColbsInner();
}

// Записываем содержимое колб, в соответствии с уровнем, перед входом в игру
function drawColbsInner() {
	if (configGame.level === 1) {
		drawInColb(configGame.colbs[1].currentArr, colb1);
		drawInColb(configGame.colbs[2].currentArr, colb2);
	} else if (configGame.level === 2) {
		drawInColb(configGame.colbs[1].currentArr, colb1);
		drawInColb(configGame.colbs[2].currentArr, colb2);
		drawInColb(configGame.colbs[3].currentArr, colb3);
	} else if (configGame.level === 3 || configGame.level === 4) {
		drawInColb(configGame.colbs[1].currentArr, colb1);
		drawInColb(configGame.colbs[2].currentArr, colb2);
		drawInColb(configGame.colbs[3].currentArr, colb3);
		drawInColb(configGame.colbs[4].currentArr, colb4);
		drawInColb(configGame.colbs[5].currentArr, colb5);
	} else if (configGame.level === 5 || configGame.level === 6) {
		drawInColb(configGame.colbs[1].currentArr, colb1);
		drawInColb(configGame.colbs[2].currentArr, colb2);
		drawInColb(configGame.colbs[3].currentArr, colb3);
		drawInColb(configGame.colbs[4].currentArr, colb4);
		drawInColb(configGame.colbs[5].currentArr, colb5);
		drawInColb(configGame.colbs[6].currentArr, colb6);
		drawInColb(configGame.colbs[7].currentArr, colb7);
	}
}

// Записываем в переданную колбу текущий массив
function drawInColb(colbArr, colbDom) {
	const colbDomSpans = Array.from(colbDom.querySelectorAll('span'));

	colbDomSpans.forEach(color => color.setAttribute('class', ''));

	if (colbArr.length) {
		colbArr.forEach((color, idx) => {
			colbDomSpans[3 - idx].classList.add(`_${color}`);
		})
	}
}

// Записываем стартовый массив содержимого в колбе
function drawStartColbsForCurrentLevel() {
	if (configGame.level === 1) {
		configGame.colbs[1].currentArr.push(...configGame.colbs[1].levels[1]);
		configGame.colbs[2].currentArr.push(...configGame.colbs[2].levels[1]);
	} else if (configGame.level === 2) {
		configGame.colbs[1].currentArr.push(...configGame.colbs[1].levels[2]);
		configGame.colbs[2].currentArr.push(...configGame.colbs[2].levels[2]);
		configGame.colbs[3].currentArr.push(...configGame.colbs[3].levels[2]);
	} else if (configGame.level === 3) {
		configGame.colbs[1].currentArr.push(...configGame.colbs[1].levels[3]);
		configGame.colbs[2].currentArr.push(...configGame.colbs[2].levels[3]);
		configGame.colbs[3].currentArr.push(...configGame.colbs[3].levels[3]);
		configGame.colbs[4].currentArr.push(...configGame.colbs[4].levels[3]);
		configGame.colbs[5].currentArr.push(...configGame.colbs[5].levels[3]);
	} else if (configGame.level === 4) {
		configGame.colbs[1].currentArr.push(...configGame.colbs[1].levels[4]);
		configGame.colbs[2].currentArr.push(...configGame.colbs[2].levels[4]);
		configGame.colbs[3].currentArr.push(...configGame.colbs[3].levels[4]);
		configGame.colbs[4].currentArr.push(...configGame.colbs[4].levels[4]);
		configGame.colbs[5].currentArr.push(...configGame.colbs[5].levels[4]);
	} else if (configGame.level === 5) {
		configGame.colbs[1].currentArr.push(...configGame.colbs[1].levels[5]);
		configGame.colbs[2].currentArr.push(...configGame.colbs[2].levels[5]);
		configGame.colbs[3].currentArr.push(...configGame.colbs[3].levels[5]);
		configGame.colbs[4].currentArr.push(...configGame.colbs[4].levels[5]);
		configGame.colbs[5].currentArr.push(...configGame.colbs[5].levels[5]);
		configGame.colbs[6].currentArr.push(...configGame.colbs[6].levels[5]);
		configGame.colbs[7].currentArr.push(...configGame.colbs[7].levels[5]);
	} else if (configGame.level === 6) {
		configGame.colbs[1].currentArr.push(...configGame.colbs[1].levels[6]);
		configGame.colbs[2].currentArr.push(...configGame.colbs[2].levels[6]);
		configGame.colbs[3].currentArr.push(...configGame.colbs[3].levels[6]);
		configGame.colbs[4].currentArr.push(...configGame.colbs[4].levels[6]);
		configGame.colbs[5].currentArr.push(...configGame.colbs[5].levels[6]);
		configGame.colbs[6].currentArr.push(...configGame.colbs[6].levels[6]);
		configGame.colbs[7].currentArr.push(...configGame.colbs[7].levels[6]);
	}
}
function showStartColbsForCurrentLevel() {
	colbs.forEach(colb => !colb.classList.contains('_hide') ? colb.classList.add('_hide') : false);

	let increment = 1
	if (configGame.level === 3 || configGame.level === 5) increment = 2;

	for (let i = 0; i < configGame.level + increment; i++) {
		colbs[i].classList.remove('_hide');
	}

}

//=======================
// select colbs logic

export function getDataFirstColb(colb) {

	const colbNumber = +colb.dataset.colb;

	if (configGame.colbs[colbNumber].currentArr.length) {
		configGame.state = 2;
		colb.classList.add('_migrate-start');
		const lastElem = configGame.colbs[colbNumber].currentArr.length - 1;

		const deleteElem = configGame.colbs[colbNumber].currentArr[lastElem];
		configGame.colorMigrate = deleteElem;
		configGame.firstColbMigrateNumber = colbNumber;
		configGame.firstColbMigrateItem = colb;
	}
}

export function getDataSecondColb(colb) {

	const colbNumber = +colb.dataset.colb;

	// Проверка на случай если повторно кликаем на первую колбу
	if (colbNumber === configGame.firstColbMigrateNumber) {
		configGame.firstColbMigrateItem.classList.remove('_migrate-start');
		resetMigrateColbData();
		setTimeout(() => {
			configGame.state = 1;
		}, 0);
		return false;
	}

	if (configGame.colbs[colbNumber].currentArr.length < 4) {

		configGame.colbs[colbNumber].currentArr.push(configGame.colorMigrate);

		configGame.colbs[configGame.firstColbMigrateNumber].currentArr.pop();

		configGame.firstColbMigrateItem.classList.add('_anim');

		colb.classList.add('_get');

		resetMigrateColbData();

		setTimeout(() => {
			configGame.firstColbMigrateItem.classList.remove('_anim');
			configGame.firstColbMigrateItem.classList.remove('_migrate-start');
			colb.classList.remove('_get');
		}, 500);

		drawColbsInner();
		checkGameOver();

		setTimeout(() => {
			configGame.state = 1;
		}, 0);
	}
}
//=======================

function checkGameOver() {
	if (configGame.level === 1) {
		const a = checkSameItemsArr(configGame.colbs[1].currentArr);
		const b = checkSameItemsArr(configGame.colbs[2].currentArr);
		if ((a || a === 'zero') && (b || b === 'zero')) {
			configGame.state = 0;
			showFirework();
			quiteGame();
		}
	} else if (configGame.level === 2) {
		const a = checkSameItemsArr(configGame.colbs[1].currentArr);
		const b = checkSameItemsArr(configGame.colbs[2].currentArr);
		const c = checkSameItemsArr(configGame.colbs[3].currentArr);
		if ((a || a === 'zero') && (b || b === 'zero') && (c || c === 'zero')) {
			configGame.state = 0;
			showFirework();
			quiteGame();
		}
	} else if (configGame.level === 3 || configGame.level === 4) {
		const a = checkSameItemsArr(configGame.colbs[1].currentArr);
		const b = checkSameItemsArr(configGame.colbs[2].currentArr);
		const c = checkSameItemsArr(configGame.colbs[3].currentArr);
		const d = checkSameItemsArr(configGame.colbs[3].currentArr);
		const e = checkSameItemsArr(configGame.colbs[3].currentArr);
		if ((a || a === 'zero') && (b || b === 'zero') && (c || c === 'zero') && (d || d === 'zero') && (e || e === 'zero')) {
			configGame.state = 0;
			showFirework();
			quiteGame();
		}
	} else if (configGame.level === 5 || configGame.level === 6) {
		const a = checkSameItemsArr(configGame.colbs[1].currentArr);
		const b = checkSameItemsArr(configGame.colbs[2].currentArr);
		const c = checkSameItemsArr(configGame.colbs[3].currentArr);
		const d = checkSameItemsArr(configGame.colbs[3].currentArr);
		const e = checkSameItemsArr(configGame.colbs[3].currentArr);
		const f = checkSameItemsArr(configGame.colbs[3].currentArr);
		const g = checkSameItemsArr(configGame.colbs[3].currentArr);
		if (
			(a || a === 'zero') &&
			(b || b === 'zero') &&
			(c || c === 'zero') &&
			(d || d === 'zero') &&
			(e || e === 'zero') &&
			(f || f === 'zero') &&
			(g || g === 'zero')
		) {
			configGame.state = 0;
			showFirework();
			quiteGame();
		}
	}
}

function checkSameItemsArr(arr) {
	if (arr.length === 4) {
		let firstItem = arr[0];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] != firstItem) return false;
		}
		return true;
	} else if (arr.length === 0) {
		return 'zero';
	} else return false;

}

function showFirework() {
	firework.classList.add('_visible');
}
function removeShowFirework() {
	firework.classList.remove('_visible');
}

function quiteGame() {
	setTimeout(() => {
		document.querySelector('.wrapper').classList.remove('_game');
		removeShowFirework();
	}, 2000);
	setTimeout(() => {
		stopGame()
	}, 3000);
}

export function stopGame() {
	configGame.state = 1;
	resetData();
	resetColbInner();
	colbs.forEach(colb => {
		if (colb.classList.contains('_migrate-start')) colb.classList.remove('_migrate-start');
		if (colb.classList.contains('_anim')) colb.classList.remove('_anim');
	})
}

function resetMigrateColbData() {
	configGame.colorMigrate = '';
	configGame.firstColbMigrateNumber = null;
}


function resetData() {
	for (let colb in configGame.colbs) {
		configGame.colbs[colb].currentArr.splice(0);
	}

	wrapper.setAttribute('data-game-level', 1);
}

function resetColbInner() {
	colbs.forEach(colb => {
		colb.querySelectorAll('span').forEach(item => item.setAttribute('class', ''))
	})
}
