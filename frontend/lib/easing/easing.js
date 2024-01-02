/**
 * jQuery Easing v1.4.1 - http://gsgd.co.uk/sandbox/jquery/easing/
 * Open source under the BSD License.
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/gdsmith/jquery-easing/master/LICENSE
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
})(function ($) {
	var PI = Math.PI,
		c1 = 1.70158,
		c2 = c1 * 1.525,
		c3 = c1 + 1,
		c4 = (2 * PI) / 3,
		c5 = (2 * PI) / 4.5;

	// Preserve the original jQuery "swing" easing as "jswing"
	if ($.easing) {
		$.easing['jswing'] = $.easing['swing'];
	}

	function bounceOut(x) {
		var n1 = 7.5625,
			d1 = 2.75;
		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= (1.5 / d1)) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= (2.25 / d1)) * x + 0.9375;
		} else {
			return n1 * (x -= (2.625 / d1)) * x + 0.984375;
		}
	}

	$.extend($.easing, {
		def: 'easeOutQuad',
		swing: function (x) {
			return $.easing[$.easing.def](x);
		},
		easeInQuad: function (x) {
			return x * x;
		},
		easeOutQuad: function (x) {
			return 1 - (1 - x) * (1 - x);
		},
		easeInOutQuad: function (x) {
			return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
		},
		// Add other easing functions here...
		easeInOutBounce: function (x) {
			return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2;
		}
	});
});

