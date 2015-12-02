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
			
			var d = getBoxSize(b.$el.innerWidth(), b.$el.innerHeight(), o.cells, o.columns, m);// Math.min((b.$el.innerWidth()-(b.$el.innerWidth()/8)) / o.columns, b.$el.innerHeight() / Math.ceil(o.cells / o.columns)) - m;
			
			console.log(Math.ceil(o.cells / o.columns));
			b.$el.css("line-height", Math.ceil(d + m) + "px");
			
			var cell = $("<"+o.elementType+"></"+o.elementType+">").css({
				"width": Math.max(Math.min(d, o.maxCellWidth), o.minCellWidth) + "px", 
				"height": Math.max(Math.min(d, o.maxCellHeight), o.minCellHeight) + "px",
				"margin": "0px "+m+"px "+m+"px 0px",
				"background-color": o.unselectedColor,
				"display": "inline-block",
				"cursor": "pointer"
			}).css(o.cellCss).html(o.cellHtml).click(function () {
				b.selectCell($(this).attr("data-num"));
			});
			
			var i=0, j=0;
			for(var i=0; i<o.cells; i++){
				if(j++ == o.columns && o.addBreaks) j=1, b.$el.append($("<br />"));
				var c = cell.clone(true).attr("data-num", (i+1));
				c.html(c.html().replace("{0}", (i+1)));
				if(o.cellHtml.indexOf("{1}") > -1) c.html(c.html().replace("{1}", calcPercentText((i+1), o.cells)));
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
			return calcPercent(this.options.selected, this.options.cells);
		}
		
		base.get_percentageText = function (decimals) {
			return calcPercentText(this.options.selected, this.options.cells, decimals);
		}
		
		base.resize = function () {
			var o = this.options, w = this.$el.innerWidth(), 
				d=getBoxSize(this.$el.innerWidth(), this.$el.innerHeight(), o.cells, o.columns, o.cellMargin); //d = Math.min(w-(w/8), this.$el.innerHeight()) / Math.ceil(o.cells / o.columns) - o.cellMargin;
			
			this.$el.css("line-height", Math.ceil(d + o.cellMargin) + "px");
			this.$el.children(o.elementType+"[data-num]").css({
				"width": Math.max(Math.min(d, o.maxCellWidth), o.minCellWidth) + "px", 
				"height": Math.max(Math.min(d, o.maxCellHeight), o.minCellHeight) + "px"				
			});
		}
		
		var getBoxSize = function (w, h, n, c, m){
			return Math.min(w/c, h/Math.ceil(n/c))-m;
		}
		
		var calcPercent = function(x, y){
			return x / y;
		}
		var calcPercentText = function(x, y, d){
			if(typeof(d) === "undefined") d = 0
			return Number(calcPercent(x * 100, y).toFixed(d)) + "%";
		}
		
        base.init(options);
		
		var resz;
		$(window).resize(function(){
			clearTimeout(resz);
			resz = setTimeout(function () { base.resize() }, 50);
		});
    };
    
    $.boxPortionPicker.defaultOptions = {
		addBreaks: true,
		cellCss:{},
		cellHtml: "&nbsp;",//use {0} to insert the cell number into the html string
		cellMargin: 1,
        cells: 4,
		clickSelectedCellToClear: true,
		columns: 0,
		elementType: "div",
		maxCellHeight: 500,
		maxCellWidth: 500,
		minCellHeight: 5,
		minCellWidth: 5,
		selected: 0,//which item is selected by default
		selectedClass: null,
		selectedColor: "#88CC00",
		unselectedClass: null,
		unselectedColor: "#BBE6BB"
    };
    
    $.fn.boxPortionPicker = function(options){
        return this.each(function(){
            (new $.boxPortionPicker(this, options));
        });
    };
    
})(jQuery);