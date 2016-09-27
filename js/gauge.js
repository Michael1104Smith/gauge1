function Gauge(placeholderName, configuration)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;
		
		this.config.size = this.config.size * 0.9;
		
		this.config.raduis = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
		
		this.config.min = undefined != configuration.min ? configuration.min : 0; 
		this.config.max = undefined != configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;
		this.config.valueFontSize = configuration.valueFontSize || 25;
		
		this.config.majorTicks = configuration.majorTicks || 5;
		this.config.minorTicks = configuration.minorTicks || 2;
		
		this.config.transitionDuration = configuration.transitionDuration || 500;
	}

	this.render = function()
	{
		var chartId = "#" + this.placeholderName;
		$(chartId).html("");
		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "gauge")
							.attr("width", this.config.size)
							.attr("height", this.config.size);
		
		var fontSize = Math.round(this.config.size / 16);
		var minorDelta = this.config.range / (this.config.majorTicks - 1);
		var first_flag = 0;
		for (var minor = this.config.min; minor <= this.config.max; minor += minorDelta)
		{
				var point1 = this.valueToPoint(minor, 0.65, 258, 37);
				var point2 = this.valueToPoint(minor, 0.85, 258, 37);
				
				var delta_y = point1.y - point2.y;
				var delta_x = point1.x - point2.x;
				var rotate_value = Math.atan(delta_y/delta_x)/Math.PI*180 - 90;
				if(minor > (this.config.max + this.config.min)/2 - 1){
					rotate_value = Math.atan(delta_y/delta_x)/Math.PI*180 + 90;
				}
				var pos_x = (point1.x + point2.x) /2;
				var pos_y = (point1.y + point2.y) /2;

				if(first_flag == 0){
					if(this.config.min>9){
						pos_x += 4;
						pos_y += 6;
					}
					first_flag = 1;
				}
				var value_fontsize = fontSize/3*2;

				var cur_text = Math.round(minor);
				this.body.append("text")
				 			.attr("dy", value_fontsize / 3)
				 			.attr("text-anchor", minor == this.config.min ? "start" : "end")
				 			.text(cur_text)
				 			.attr("transform","translate("+pos_x+","+pos_y+") rotate("+rotate_value+")")
				 			.style("font-size", value_fontsize + "px")
							.style("fill", "#333")
							.style("stroke-width", "0px");
		}
		
		var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
		
		var midValue = (this.config.min + this.config.max) / 2;

		var pointerPath = this.buildPointerPath(midValue);
		
		var pointerLine = d3.svg.line()
									.x(function(d) { return d.x })
									.y(function(d) { return d.y });
		
		pointerContainer.append("svg:path")
							.data([pointerPath])
									.attr("d", pointerLine)
									.style("fill", "#dededd")
									.style("stroke", "#605d5c")
									.style("fill-opacity", 1);



	
		var pointerPath1 = this.buildPointerPath1(midValue);
		
		var pointerLine1 = d3.svg.line()
									.x(function(d) { return d.x })
									.y(function(d) { return d.y });
		
		pointerContainer.append("svg:path")
							.data([pointerPath1])
									.attr("d", pointerLine1)
									.style("fill", "#383431")
									.style("fill-opacity", 1);



		// Define the gradient
		var gradient = pointerContainer.append("svg:defs")
		    .append("svg:radialGradient")
		    .attr("id", "gradient")
		    .attr("x1", "0%")
		    .attr("y1", "0%")
		    .attr("x2", "100%")
		    .attr("y2", "100%")
		    .attr("spreadMethod", "pad");

		// Define the gradient colors
		gradient.append("svg:stop")
		    .attr("offset", "0%")
		    .attr("stop-color", "#aaa9a9")
		    .attr("stop-opacity", 1);

		gradient.append("svg:stop")
		    .attr("offset", "100%")
		    .attr("stop-color", "#6d6a69")
		    .attr("stop-opacity", 1);

					
		pointerContainer.append("svg:circle")
							.attr("cx", this.config.cx)
							.attr("cy", this.config.cy)
							.attr("r", 0.24 * this.config.raduis)
							.style("fill", "url(#gradient)")
							.style("stroke", "#666")
							.style("opacity", 1);
		
		var fontSize = this.config.valueFontSize;
		pointerContainer.selectAll("text")
							.data([midValue])
							.enter()
								.append("svg:text")
									.attr("x", this.config.cx)
									.attr("y", this.config.size - this.config.cy / 4 - fontSize)
									.attr("dy", fontSize / 2)
									.attr("text-anchor", "middle")
									.style("font-size", fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px");
	}
	
	this.buildPointerPath = function(value)
	{
		var delta = this.config.range / 13;
		
		var head = valueToPoint(value, 0.73, 270, 45);
		var head1 = valueToPoint(value - delta, 0.65, 278, 30);
		var head2 = valueToPoint(value + delta, 0.65, 212, 30);

		return [head, head1,head2, head];
		
		function valueToPoint(value, factor, value1, value2)
		{
			var point = self.valueToPoint(value, factor, value1, value2);
			point.x -= self.config.cx;
			point.y -= self.config.cy;
			return point;
		}
	}

	this.buildPointerPath1 = function(value)
	{
		var delta = this.config.range / 13;
		
		var head = valueToPoint(value, 0.71, 270, 45);
		var head1 = valueToPoint(value - delta, 0.657, 280, 30);
		var head2 = valueToPoint(value + delta, 0.657, 210, 29.8);
		
		return [head, head1,head2, head];
		
		function valueToPoint(value, factor, value1, value2)
		{
			var point = self.valueToPoint(value, factor, value1, value2);
			point.x -= self.config.cx;
			point.y -= self.config.cy;
			return point;
		}
	}
		
	this.redraw = function(value, transitionDuration)
	{
		var pointerContainer = this.body.select(".pointerContainer");
		
		pointerContainer.selectAll("text").text(Math.round(value));	
		
		var pointer = pointerContainer.selectAll("path");
		pointer.transition()
					.duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
					
					.attrTween("transform", function()
					{
						var pointerValue = value;
						if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
						else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
						var targetRotation = (self.valueToDegrees(pointerValue, 254, 37) - 90);
						if(value < (self.config.max + self.config.min)/2){
							targetRotation = (self.valueToDegrees(pointerValue, 254, 39) - 90);
						}
						if(value == self.config.min){
							targetRotation = (self.valueToDegrees(pointerValue, 254, 36) - 90);	
						}
						var currentRotation = self._currentRotation || targetRotation;
						self._currentRotation = targetRotation;
						
						return function(step) 
						{
							var rotation = currentRotation + (targetRotation-currentRotation)*step;
							return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
						}
					});
	}
	
	this.valueToDegrees = function(value, value1, value2)
	{
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * value1 - (this.config.min / this.config.range * value1 + value2);
	}
	
	this.valueToRadians = function(value, value1, value2)
	{
		return this.valueToDegrees(value, value1, value2) * Math.PI / 180;
	}
	
	this.valueToPoint = function(value, factor, value1, value2)
	{
		return { 	x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value, value1, value2)),
					y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value, value1, value2)) 		};
	}
	
	// initialization
	this.configure(configuration);	
}