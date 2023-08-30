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
let slot1 = null;

class Slot1 {
	constructor(domElement, config = {}) {
		Symbol1.preload();

		this.currentSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["2", "3", "4"],
		];

		this.nextSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["2", "3", "4"],
		];

		this.container = domElement;

		this.reels = Array.from(this.container.getElementsByClassName("reel1")).map(
			(reelContainer, idx) => {
				return new Reel1(reelContainer, idx, this.currentSymbols[idx])
			}
		);

		this.spinButton = document.querySelector('[data-button="spin-1"]');
		this.spinButton.addEventListener("click", () => {
			//при запуске сбрасываем интервал запуска между слотами
			tl.to(this.spinButton, {});

			if ((+localStorage.getItem('money') >= configSlot.minBet)) {
				this.spin();

			} else {
				noMoney('.score');
			}
		});

		this.casinoAutoSpinCount = 0;
		this.autoSpinButton = document.querySelector('[data-button="autospin-1"]');

		this.autoSpinButton.addEventListener("click", () => {
			tl.to(this.spinButton, {});
			var oThis = this;
			this.casinoAutoSpinCount = 0;
			configSlot.isAutMode = true;

			if ((+localStorage.getItem('money') > configSlot.minBet)) {
				this.casinoAutoSpinCount++;
				this.spin();
			}
			configSlot.timer = setInterval(function () {
				tl.to(oThis.spinButton, {});

				oThis.casinoAutoSpinCount++;
				if (oThis.casinoAutoSpinCount >= 9) configSlot.isAutMode = false;

				if (oThis.casinoAutoSpinCount < 10 && (+localStorage.getItem('money') >= configSlot.minBet)) {
					oThis.spin();
				} else if (oThis.casinoAutoSpinCount >= 10 && (+localStorage.getItem('money') >= configSlot.minBet)) {
					clearInterval(configSlot.timer);
					configSlot.isAutMode = false;
				} else {
					clearInterval(configSlot.timer);
					noMoney('.check');
					configSlot.isAutMode = false;
				}
			}, 5500);
		});

		if (config.inverted) {
			this.container.classList.add("inverted");
		}
		this.config = config;
	}

	async spin() {
		this.currentSymbols = this.nextSymbols;
		this.nextSymbols = [
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
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
		deleteMoney(configSlot.minBet, '.score');

		this.spinButton.classList.add('_hold');
		this.autoSpinButton.classList.add('_hold');

		if (symbols) {
			this.config.onSpinStart(symbols);
		}
	}

	onSpinEnd(symbols) {
		if (!configSlot.isAutMode) {
			this.spinButton.classList.remove('_hold');
			this.autoSpinButton.classList.remove('_hold');
		}

		if (symbols && configSlot.isAutMode) {
			this.config.onSpinEnd(symbols, this.spinButton, this.autoSpinButton);
		} else {
			this.config.onSpinEnd(symbols);
		}
	}
}

class Reel1 {
	constructor(reelContainer, idx, initialSymbols) {
		this.reelContainer = reelContainer;
		this.idx = idx;

		this.symbolContainer = document.createElement("div");
		this.symbolContainer.classList.add("icons");
		this.reelContainer.appendChild(this.symbolContainer);

		initialSymbols.forEach((symbol) =>
			this.symbolContainer.appendChild(new Symbol1(symbol).img)
		);
	}

	get factor() {
		return configSlot.rows_slot1 + Math.pow(this.idx / 2, 2);
	}

	renderSymbols(nextSymbols) {
		const fragment = document.createDocumentFragment();

		for (let i = configSlot.rows_slot1; i < configSlot.rows_slot1 + Math.floor(this.factor) * 10; i++) {
			const icon = new Symbol1(
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
		slot1.onSpinEnd(symbols);
	}
}

const cache1 = {};

class Symbol1 {
	constructor(name = Symbol1.random()) {
		this.name = name;

		if (cache1[name]) {
			this.img = cache1[name].cloneNode();
		} else {

			this.img = new Image();
			this.img.src = `img/slot-1/slot-${name}.png`;

			cache1[name] = this.img;
		}
	}

	static preload() {
		Symbol1.symbols.forEach((symbol) => new Symbol1(symbol));
	}

	static get symbols() {
		return [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
		];
	}

	static random() {
		return this.symbols[Math.floor(Math.random() * this.symbols.length)];
	}
}

const config1 = {
	inverted: false,
	onSpinStart: (symbols) => {

	},
	onSpinEnd: (symbols, spinButton, autoSpinButton) => {
		if (symbols[0][0] == symbols[1][0] && symbols[1][0] == symbols[2][0] ||
			symbols[0][1] == symbols[1][1] && symbols[1][1] == symbols[2][1] ||
			symbols[0][2] == symbols[1][2] && symbols[1][2] == symbols[2][2]) {

			if (configSlot.isAutMode) {
				clearInterval(configSlot.timer);
				configSlot.isAutMode = false;

				spinButton.classList.remove('_hold');
				autoSpinButton.classList.remove('_hold');
			}

			const currintWin = configSlot.minBet * configSlot.winCoeff_1;

			addMoney(currintWin, '.score', 1000, 2000);

		}
	},
};

if (document.querySelector('[data-screen="slot-1"]')) {
	slot1 = new Slot1(document.getElementById("slot1"), config1);
}


//========================================================================================================================================================
if (targetElement.closest('[data-button="slot-1-home"]')) {
	wrapper.classList.add('_slot-screen');
	wrapper.classList.remove('_slot-1');
	if (configSlot.isAutMode) {
		clearInterval(configSlot.timer);
		configSlot.isAutMode = false;

		document.querySelector('[data-button="spin-1"]').classList.remove('_hold');
		document.querySelector('[data-button="auto-1"]').classList.remove('_hold');
	}
}