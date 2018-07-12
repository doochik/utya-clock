(function() {
	"use strict";

	const images = new Array(24).fill('jpg');
	// images[0] = 'webp';
	// images[1] = 'webp';
	// images[2] = 'webp';
	// images[7] = 'webp';
	// images[8] = 'webp';
	// images[9] = 'webp';
	// images[12] = 'webp';
	// images[15] = 'webp';
	// images[16] = 'webp';
	// images[20] = 'webp';
	// images[23] = 'webp';

	function ClockFace(elem) {
		this.elem = elem;

		window.addEventListener('resize', () => this.createdCallback(), false);
	}

    ClockFace.prototype =  {};
	const proto = ClockFace.prototype;
	proto.createdCallback = function() {
		this.readAttributes();

		this.elem.innerHTML =
			"<div class='clock-face-container'>" +
				"<div class='clock-face-hour'></div>" +
				"<div class='clock-face-minute'></div>" +
				"<div class='clock-face-second'></div>" +
				this.createNumbers() +
				this.createImages() +
			"</div>";

		this.hourElement = this.elem.querySelector( ".clock-face-hour" );
		this.minuteElement = this.elem.querySelector( ".clock-face-minute" );
		this.secondElement = this.elem.querySelector( ".clock-face-second" );

		this.updateClock();
		if ( !this.hour && !this.minute && !this.second  ) {
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				this.updateClock();
			}, 1000 );
		}
	};
	proto.readAttributes = function() {
		this.hour = this.elem.getAttribute( "hour" );
		this.minute = this.elem.getAttribute( "minute" );
		this.second = this.elem.getAttribute( "second" );
	};
	proto.updateClock = function() {
		var now = new Date(),
			hour = this.hour || now.getHours(),
			minute = this.minute || now.getMinutes(),
			second = this.second || now.getSeconds(),
			secondAngle = second * 6,
			minuteAngle = minute * 6 + secondAngle / 60,
			hourAngle = ( ( hour % 12 ) / 12 ) * 360 + 90 + minute / 12,
			hourRule = "rotate(" + hourAngle.toFixed(2) + "deg)",
			minuteRule = "rotate(" + minuteAngle.toFixed(2) + "deg)",
			secondRule = "rotate(" + secondAngle.toFixed(2) + "deg)";

		this.hourElement.style.transform = hourRule;
		this.minuteElement.style.transform = minuteRule;
		this.secondElement.style.transform = secondRule;
	};
	proto.attributeChangedCallback = function( attrName, oldVal, newVal ) {
		if ( /^(hour|minute|second)$/.test( attrName ) ) {
			this.readAttributes();
			this.updateClock();
		}
	};
	proto.createNumbers = () => {
        const dimension = window.innerHeight > window.innerWidth ? 'vw' : 'vh';
		return new Array(12).fill(null).map((value, index) => {
			const num = index + 1;
            const rad1 = 0.0174532925;
            const rad30j = 30 * rad1 * num;
            const rad270 = 270 * rad1;

            const top = 22 * Math.sin(rad30j + rad270) + 23.5;
            const left = 22 * Math.cos(rad30j + rad270) + 24;

			return `<span class="clock-face-numeral" style="top: ${ top }${ dimension }; left: ${ left }${ dimension }">${ index + 1 }</span>`;
		}).join('');
	};

	proto.createImages = () => {
		// const add = new Date().getHours() > 12 ? 12 : 0;
		// const add = new Date().getHours() - 6;
		// const add = 20 - 1;
        const add = new Date().getHours();
        const dimension = window.innerHeight > window.innerWidth ? 'vw' : 'vh';
        return new Array(12).fill(null).map((value, index) => {
			const num = (index + add) % 24;
            const rad1 = 0.0174532925;
            const rad30j = 30 * rad1 * num;
            const rad270 = 270 * rad1;

            const top = 40 * Math.sin(rad30j + rad270) + 15;
            const left = 40 * Math.cos(rad30j + rad270) + 15;

			return `<img class="clock-face-image${ add === num ? ' clock-face-image-current' : '' }" src="kotya/${ num }.${ images[num] }" style="top: ${ top }${ dimension }; left: ${ left }${ dimension }"/>`;
		}).join('');
	};

    const elem = document.querySelector('.clock-face');
	new ClockFace(elem).createdCallback();
}());
