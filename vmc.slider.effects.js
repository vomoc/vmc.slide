/**
 * Vmc Slider v1.0.0 图片轮播插件
 * 维米客网页工作室
 * http://www.vomoc.com/vmc/slider/
 * vomoc@qq.com
 * 2015/06/29
 **/
;
(function($, undefined) {
	//**************************************************************************************************************
	$.vmcSliderEffects({
		'fadeTopLeft': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(0);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var x = i % opts.gridCol;
				var y = Math.floor(i / opts.gridCol);
				var delay = ((y + 1) / opts.gridRow + (x + 1) / opts.gridCol) / 2;
				delay = opts.speed / 3 * 2 * delay;
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'fadeBottomRight': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(0);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var x = i % opts.gridCol;
				var y = Math.floor(i / opts.gridCol);
				var delay = 1 - (y / opts.gridRow + x / opts.gridCol) / 2;
				delay = opts.speed / 3 * 2 * delay;
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'fadeLeft': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (i + 1);
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'fadeRight': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (opts.gridVertical - i);
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'fadeTop': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(1);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridHorizontal * (i + 1);
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'fadeBottom': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(1);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridHorizontal * (opts.gridHorizontal - i);
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'blindsTopLeft': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(0);
			node.transfer.children().css({
				width: 0,
				height: 0,
				opacity: 0
			}).each(function(i) {
				var x = i % opts.gridCol;
				var y = Math.floor(i / opts.gridCol);
				var delay = ((y + 1) / opts.gridRow + (x + 1) / opts.gridCol) / 2;
				delay = opts.speed / 3 * 2 * delay;
				$(this).delay(delay).animate({
					width: opts.width / opts.gridCol,
					height: opts.height / opts.gridRow,
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'blindsBottomRight': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(0);
			node.transfer.children().css({
				width: 0,
				height: 0,
				opacity: 0
			}).each(function(i) {
				var x = i % opts.gridCol;
				var y = Math.floor(i / opts.gridCol);
				var delay = 1 - (y / opts.gridRow + x / opts.gridCol) / 2;
				delay = opts.speed / 3 * 2 * delay;
				$(this).delay(delay).animate({
					width: opts.width / opts.gridCol,
					height: opts.height / opts.gridRow,
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'blindsLeft': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				width: 0,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (i + 1);
				$(this).delay(delay).animate({
					width: opts.width / opts.gridVertical,
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'blindsRight': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				width: 0,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (opts.gridVertical - i);
				$(this).delay(delay).animate({
					width: opts.width / opts.gridVertical,
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'blindsTop': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(1);
			node.transfer.children().css({
				height: 0,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridHorizontal * (i + 1);
				$(this).delay(delay).animate({
					height: opts.height / opts.gridHorizontal,
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'blindsBottom': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(1);
			node.transfer.children().css({
				height: 0,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridHorizontal * (opts.gridHorizontal - i);
				$(this).delay(delay).animate({
					height: opts.height / opts.gridHorizontal,
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'mosaic': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			var max = 0;
			var index = 0;
			the._setStage(0);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 2 * Math.random();
				if (delay > max) {
					max = delay;
					index = $(this).index();
				}
				$(this).delay(delay).animate({
					opacity: 1
				}, opts.speed / 2, 'linear');
			}).eq(index).queue(function() {
				the._afterTransfer();
			});
		},
		'bomb': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			var max = 0;
			var index = 0;
			var gridWidth = opts.width / opts.gridCol;
			var gridHeight = opts.height / opts.gridRow;
			the._setStage(0);
			node.transfer.children().css({
				top: (opts.height - gridHeight) / 2,
				left: (opts.width - gridWidth) / 2,
				opacity: 0
			}).each(function(i) {
				var x = i % opts.gridCol;
				var y = Math.floor(i / opts.gridCol);
				var top = gridHeight * y;
				var left = gridWidth * x;
				var delay = opts.speed / 2 * Math.random();
				if (delay > max) {
					max = delay;
					index = $(this).index();
				}
				$(this).delay(delay).animate({
					top: top,
					left: left,
					opacity: 1
				}, opts.speed / 2);
			}).eq(index).queue(function() {
				the._afterTransfer();
			});
		},
		'fumes': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(0);
			node.transfer.children().css({
				width: opts.width / opts.gridCol * 2,
				height: opts.height / opts.gridRow * 2,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / node.transfer.children().length * (i + 1);
				$(this).delay(delay).animate({
					width: opts.width / opts.gridCol,
					height: opts.height / opts.gridRow,
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'interlaceLeft': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (i + 1);
				$(this).css({
					top: i % 2 > 0 ? -opts.height : opts.height
				}).delay(delay).animate({
					top: 0,
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'interlaceRight': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (opts.gridVertical - i);
				$(this).css({
					top: i % 2 > 0 ? -opts.height : opts.height
				}).delay(delay).animate({
					top: 0,
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		},
		'curtainLeft': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				height: 0,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (i + 1);
				$(this).delay(delay).animate({
					top: 0,
					height: opts.height,
					opacity: 1
				}, opts.speed / 3);
			}).last().queue(function() {
				the._afterTransfer();
			});
		},
		'curtainRight': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			the._setStage(2);
			node.transfer.children().css({
				height: 0,
				opacity: 0
			}).each(function(i) {
				var delay = opts.speed / 3 * 2 / opts.gridVertical * (opts.gridVertical - i);
				$(this).delay(delay).animate({
					top: 0,
					height: opts.height,
					opacity: 1
				}, opts.speed / 3);
			}).first().queue(function() {
				the._afterTransfer();
			});
		}
	});
	//**************************************************************************************************************
})(jQuery);