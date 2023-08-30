// Стандартная с одной кнопко запуска


export const configSlot = {
	currentWin: 0,
	winCoeff_1: 30,
	winCoeff_2: 30,

	rows_slot1: 3, // количество рядов с картинками (как правило всегда 3)
	rows_slot2: 3,

	minBet: 50,
	maxBet: 950,

	betSlot3: 50,

	isAutMode: false,
	isWin: false,

	timer: false
}

const configGSAP = {
	duration_1: 1,
	duration_3: 3
}



//========================================================================================================================================================
let slot3 = null;

class Slot3 {
	constructor(domElement, config = {}) {
		Symbol3.preload();

		this.currentSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "8", "9"]
		];

		this.nextSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "8", "9"]
		];

		this.container = domElement;

		this.reels = Array.from(this.container.getElementsByClassName("reel3")).map(
			(reelContainer, idx) => {
				return new Reel3(reelContainer, idx, this.currentSymbols[idx])
			}
		);

		this.holder = null;
		this.spinButton = document.querySelector('[data-button="spin-3"]');

		this.spinButton.addEventListener("touchstart", () => {
			let oThis = this;
			this.holder = setTimeout(function () {
				configSlot.isAutMode = true;
				oThis.autoSpin();
			}, 2000)
		});

		this.spinButton.addEventListener("touchend", () => {

			this.holder && clearTimeout(this.holder);
			if (!configSlot.isAutMode) {
				tl.to(this.spinButton, {});
				if ((+localStorage.getItem('money') >= +localStorage.getItem('current-bet'))) {
					this.spin();
				} else {
					noMoney('.score');
				}
			}
		});
		if (config.inverted) {
			this.container.classList.add("inverted");
		}
		this.config = config;
	}

	autoSpin() {
		var oThis = this;
		this.casinoAutoSpinCount = 0;
		if ((+localStorage.getItem('money') > +localStorage.getItem('current-bet'))) {
			this.casinoAutoSpinCount++;
			this.spin();
		}
		configSlot.timer = setInterval(function () {
			oThis.casinoAutoSpinCount++;
			if (oThis.casinoAutoSpinCount >= 9) oThis.autospinActive = false;

			tl.to(oThis.spinButton, {});

			if (oThis.casinoAutoSpinCount < 10 && (+localStorage.getItem('money') >= +localStorage.getItem('current-bet'))) {
				oThis.spin();
			} else if (oThis.casinoAutoSpinCount >= 10 && (+localStorage.getItem('money') >= +localStorage.getItem('current-bet'))) {
				clearInterval(configSlot.timer);
			} else if ((+localStorage.getItem('money') < +localStorage.getItem('current-bet'))) {
				clearInterval(configSlot.timer);
				noMoney('.score');
			}
		}, 5500);
	}

	async spin() {
		this.currentSymbols = this.nextSymbols;
		this.nextSymbols = [
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()]
		];

		this.onSpinStart(this.nextSymbols);

		await Promise.all(
			this.reels.map((reel) => {
				reel.renderSymbols(this.nextSymbols[reel.idx]);
				return reel.spin(this.nextSymbols);
			})
		);
	}

	onSpinStart(symbols) {
		deleteMoney(+localStorage.getItem('current-bet'), '.score');

		this.spinButton.classList.add('_hold');


		if (symbols) {
			this.config.onSpinStart(symbols);
		}
	}

	onSpinEnd(symbols) {
		if (!configSlot.isAutMode) {
			this.spinButton.classList.remove('_hold');
		}

		if (symbols && configSlot.isAutMode) {
			this.config.onSpinEnd(symbols, this.spinButton);
		} else {
			this.config.onSpinEnd(symbols);
		}
	}
}

class Reel3 {
	constructor(reelContainer, idx, initialSymbols) {
		this.reelContainer = reelContainer;
		this.idx = idx;

		this.symbolContainer = document.createElement("div");
		this.symbolContainer.classList.add("icons");
		this.reelContainer.appendChild(this.symbolContainer);

		initialSymbols.forEach((symbol) =>
			this.symbolContainer.appendChild(new Symbol3(symbol).img)
		);
	}

	get factor() {
		return configSlot.rows_slot1 + Math.pow(this.idx / 2, 2);
	}

	renderSymbols(nextSymbols) {
		const fragment = document.createDocumentFragment();

		for (let i = configSlot.rows_slot1; i < configSlot.rows_slot1 + Math.floor(this.factor) * 10; i++) {
			const icon = new Symbol3(
				i >= 10 * Math.floor(this.factor) - 2
					? nextSymbols[i - Math.floor(this.factor) * 10]
					: undefined
			);
			fragment.appendChild(icon.img);
		}

		this.symbolContainer.appendChild(fragment);
	}

	async spin(symbols) {
		// запускаем анимацию смещения колонки
		this.param = ((Math.floor(this.factor) * 10) / (configSlot.rows_slot1 + Math.floor(this.factor) * 10)) * 100;

		await tl.fromTo(this.symbolContainer, { translateY: 0, }, {
			translateY: `${-this.param}%`,
			duration: configGSAP.duration_3,
			onComplete: () => {

				// определяем какое количество картинок хотим оставить в колонке
				const max = this.symbolContainer.children.length - configSlot.rows_slot1; // 3 - количество картинок в одной колонке после остановки

				gsap.to(this.symbolContainer, { translateY: 0, duration: 0 });

				// запускаем цикл, в котором оставляем определенное количество картинок в конце колонки
				for (let i = 0; i < max; i++) {
					this.symbolContainer.firstChild.remove();
				}
			}
		}, '<10%');

		// После выполнения анимации запускаем сценарий разблокировки кнопок и проверки результата
		slot3.onSpinEnd(symbols);
	}
}

const cache3 = {};

class Symbol3 {
	constructor(name = Symbol3.random()) {
		this.name = name;

		if (cache3[name]) {
			this.img = cache3[name].cloneNode();
		} else {

			this.img = new Image();
			this.img.src = `img/slot-3/slot-${name}.png`;

			cache3[name] = this.img;
		}
	}

	static preload() {
		Symbol3.symbols.forEach((symbol) => new Symbol3(symbol));
	}

	static get symbols() {
		return [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
		];
	}

	static random() {
		return this.symbols[Math.floor(Math.random() * this.symbols.length)];
	}
}

const config3 = {
	inverted: false,
	onSpinStart: (symbols) => { },
	onSpinEnd: (symbols, spinButton) => {
		if (symbols[0][0] == symbols[1][0] && symbols[1][0] == symbols[2][0] ||
			symbols[0][1] == symbols[1][1] && symbols[1][1] == symbols[2][1] ||
			symbols[0][2] == symbols[1][2] && symbols[1][2] == symbols[2][2]) {
			if (configSlot.isAutMode) {
				clearInterval(configSlot.timer);
				configSlot.isAutMode = false;

				spinButton.classList.remove('_hold');
			}

			const currintWin = +localStorage.getItem('current-bet') * configSlot.winCoeff_3;

			addMoney(currintWin, '.score', 1000, 2000);
		}
	},
};

if (document.querySelector('[data-screen="slot-3"]')) {
	slot3 = new Slot3(document.getElementById("slot3"), config3);
}

//========================================================================================================================================================
if (targetElement.closest('[data-button="slot-1-home"]')) {
	wrapper.classList.add('_slot-screen');
	wrapper.classList.remove('_slot-1');
	if (configSlot.isAutMode) {
		clearInterval(configSlot.timer);
		configSlot.isAutMode = false;
		if (document.querySelector('[data-button="spin-2"]').classList.contains('_hold')) {
			document.querySelector('[data-button="spin-2"]').classList.remove('_hold');
		}
		if (document.querySelector('[data-button="spin-3"]').classList.contains('_hold')) {
			document.querySelector('[data-button="spin-3"]').classList.remove('_hold');
		}

		// document.querySelector('.bet-box').classList.remove('_hold');
	}
}