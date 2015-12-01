(function($){
    $.boxPortionPicker = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.$el.data("boxPortionPicker", base);
        base.el = el;
        
        base.init = function(opt){
			var b = this;
            var o = this.options = $.extend({},$.boxPortionPicker.defaultOptions, opt), m = (!isNaN(o.cellMargin) ? o.cellMargin : parseInt(o.cellMargin.replace("px", "")));
			this.options.cellMargin = m;
			if((o.columns||0) < 1) o.columns = Math.ceil(Math.sqrt(o.cells));
			var d = Math.min(b.$el.innerWidth()-(b.$el.innerWidth()/8), b.$el.innerHeight()) / Math.ceil(o.cells / o.columns) - m;
			
			b.$el.css("line-height", Math.ceil(d + m) + "px");
			
			var cell = $("<"+o.elementType+"></"+o.elementType+">").css({
				"width": Math.max(Math.min(d, o.maxCellWidth), o.minCellWidth) + "px", 
				"height": Math.max(Math.min(d, o.maxCellHeight), o.minCellHeight) + "px",
				"margin": "0px "+m+"px "+m+"px 0px",
				"background-color": o.unselectedColor,
				"display": "inline-block",
				"cursor": "pointer"
			}).css(o.cellCss).html(o.html).click(function () {
				b.selectCell($(this).attr("data-num"));
			});
			
			var i=0, j=0;
			for(var i=0; i<o.cells; i++){
				if(j++ == o.columns && o.addBreaks) j=1, b.$el.append($("<br />"));
				var c = cell.clone(true).attr("data-num", (i+1));
				c.html(c.html().replace("{0}", (i+1)));
				b.$el.append(c);
			}
			
			if((o.selected||0) > 0){
				var n = o.selected; o.selected = null;
				b.selectCell(n, false)
			}
        };
		
		base.selectCell = function (num, triggerEvent){
			var b = this;
			if(typeof(triggerEvent)==="undefined") triggerEvent = true;
			if(num <= 0 || typeof(num)==="undefined") num = 0;
			
			if(num != null && b.options.selected == num && b.options.clickSelectedCellToClear){
				num = 0;
			} 
			
			var o = b.options;
			if(!num){
				b.$el.find(o.elementType).css("background-color", o.unselectedColor).removeClass(o.selectedClass).addClass(o.unselectedClass);
			} else {
				var $el = b.$el.find("[data-num="+num+"]");
				if($el.length){
					$el.css("background-color", o.selectedColor);
					$el.prevAll(o.elementType).css("background-color", o.selectedColor).removeClass(o.unselectedClass).addClass(o.selectedClass);
					$el.nextAll(o.elementType).css("background-color", o.unselectedColor).removeClass(o.selectedClass).addClass(o.unselectedClass);
				} else throw "Invalid value passed into boxPortionPicker selectCell method";
			}
			b.options.selected = num;
			if(triggerEvent)
				if(typeof(o.cellSelect) === "function"){
					o.cellSelect(b, num||0);
				} else if (typeof(window[o.cellSelect]) === "function") {
					window[o.cellSelect](b, num||0);
				}
		}
		
		base.clearSelection = function (triggerEvent){
			this.selectCell(null, triggerEvent);
		}
		
		base.get_selected = function () {
			return this.options.selected || 0;
		}
		
		base.get_percentage = function () {
			return this.options.selected / this.options.cells;
		}
		
		base.get_percentageText = function (decimals) {
			if(typeof(decimals) === "undefined") decimals = 2
			return parseFloat(parseFloat(base.options.selected / base.options.cells * 100).toFixed(decimals)) + "%";
		}
		
		base.resize = function () {
			var o = this.options, w = this.$el.innerWidth(), d = Math.min(w-(w/8), this.$el.innerHeight()) / Math.ceil(o.cells / o.columns) - o.cellMargin;
			
			this.$el.css("line-height", Math.ceil(d + o.cellMargin) + "px");
			this.$el.children(o.elementType+"[data-num]").css({
				"width": Math.max(Math.min(d, o.maxCellWidth), o.minCellWidth) + "px", 
				"height": Math.max(Math.min(d, o.maxCellHeight), o.minCellHeight) + "px"				
			});
		}
		
        base.init(options);
		
		var resz;
		$(window).resize(function(){
			clearTimeout(resz);
			resz = setTimeout(function () { base.resize() }, 50);
		});
		return base;
    };
    
    $.boxPortionPicker.defaultOptions = {
        cells: 4,
		cellMargin: 1,
		maxCellWidth: 500,
		minCellWidth: 5,
		maxCellHeight: 500,
		minCellHeight: 5,
		unselectedColor: "#BBE6BB",
		selectedColor: "#88CC00",
		selected:0,
		columns: 0,
		clickSelectedCellToClear: true,
		addBreaks: true,
		elementType: "div",
		cellCss:{},
		selectedClass: null,
		unselectedClass: null,
		html: "&nbsp;"//use {0} to insert the cell number into the html string
    };
    
    $.fn.boxPortionPicker = function(options){
        return this.each(function(){
            return (new $.boxPortionPicker(this, options));
        });
    };
    
})(jQuery);