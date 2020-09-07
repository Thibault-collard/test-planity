var calendar = (function(){
	
	var events = [{"id": 1, "start": "17:00", "duration": 60},{"id": 2,"start": "17:00","duration": 120},{"id": 3,"start": "19:40","duration": 10}
		,{"id": 4,"start": "15:00","duration": 20},{"id": 5,"start": "18:00","duration": 60},{"id": 6,"start": "10:25","duration": 35}
		,{"id": 7,"start": "10:45","duration": 30},{"id": 8,"start": "17:00","duration": 60},{"id": 9,"start": "10:00","duration": 30}
		,{"id": 10,"start": "11:50","duration": 20},{"id": 11,"start": "19:00","duration": 60},{"id": 12,"start": "09:00","duration": 45}
		,{"id": 13,"start": "14:45","duration": 60},{"id": 14,"start": "19:20","duration": 10},{"id": 15,"start": "11:50","duration": 30}
		,{"id": 16,"start": "11:40","duration": 40},{"id": 17,"start": "14:00","duration": 30}
	]

		open_hour = 9;
		closing_hour = 21
		screen_height = 850;
		fullsize_width = 760;
		max_depth = 0;
		column_width = 0;
		px_per_hour = screen_height/(closing_hour - open_hour)
		px_per_minute = px_per_hour/60;
		overlaping = [];
		tmp = [];


	var convert_events = {
		// Transform start and duration into start and end related to the pixel's calendar
		convert_start_end : function(){
				events.forEach(event => { event.start = Math.round((parseFloat(event.start) - open_hour)*px_per_hour + parseInt(event.start.split(':')[1])*px_per_minute)
				event.end = Math.round(event.start + (event.duration*px_per_minute))
				event.collides = []
			})
		},
		// Sort events chronologically, to be sure calendar follow the right orders
		sort_converted_data : function(){
			events.sort((a,b) => (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0)); 
		},

		init : function(){
			var that = this;
			that.convert_start_end();
			that.sort_converted_data();
		}
	}
	
	var overlaps = { 
		//Find when two events overlaps and save them inside each event
		findOverlaps : function(event1,event2){
			event2.forEach(function(event2){
				if(event1.id !== event2.id){
					if( event1.start <= event2.start && event1.end >= event2.start ||
						(event2.start <= event1.start && event2.end >= event1.start) ){
							event1.collides.push(event2)
					}
				}
			});
		},
		loopOverlaps : function(){  
			var that = this;    
			events.forEach(function(event){
				that.findOverlaps(event,events);
			});          
		},
		init : function(){
			var that = this;
			that.loopOverlaps();
		}
	}
	
	var config_depth = {
			setDepth : function(){
				for(let j=0; j<events.length;j++){
					if(events[j].collides.length > 0){
						for(let i=0;i<events[j].collides.length;i++){
							if(events[j].start >= events[j].collides[0].start ){
									events[j].depth =+ 1
								if(events[j].end >= events[j].collides[i].end){
									events[j].depth = 1;
								}
								else if(events[j].start >= events[j].collides[i].start && events[j].end <= events[j].collides[i].end){
									events[j].depth += 1;
								}
								if(events[j-1] && events[j-1].depth == 1){
									if(events[j].start >= events[j-1].start && events[j].end >= events[j-1].end){
										events[j].depth = 0;
									}
									else{
										events[j].depth += 1;
									}
								}
							}
						}
					}
				}
			},
		setMaxDpeth : function(){
			events.forEach(event => {
				if(max_depth < event.depth ){
					max_depth = event.depth
				}
				column_width = fullsize_width/max_depth+1
			})
		},
		init : function(){
			var that = this;
			that.setDepth();
			that.setMaxDpeth();
		}
	}
	
	var display = {	
		// Create template calendar dynamically to easily moving open and closing hours
		draw_template_calendar : function(){
			for(let i=open_hour;i<=closing_hour;i++){
				$(`<li>${i}:00</li>`).css({position:"absolute",top:(i-open_hour)*px_per_hour}).appendTo('#calendar');
				if(i < closing_hour ){
					$(`<li>${i}:30</li>`).css({position:"absolute",top:(i-open_hour)*px_per_hour+(px_per_hour/2)}).appendTo('#calendar');
				}
			}
		},
		//Display events on calendar
		draw_events : function(){
			events.forEach(event => {
				var randomColor = "#"+ Math.floor(Math.random()*16777215).toString(16);
				if(event.collides.length == 0){
					$(`<div>${event.id}</div>`).css({width:`${fullsize_width}px`,height:(event.end - event.start),position:"absolute", top:event.start,left:`${event.depth*column_width}px`, backgroundColor:randomColor, border:"1px solid black"}).appendTo('#grid');
				}else{
					$(`<div>${event.id}</div>`).css({width:`${fullsize_width/max_depth}px`,height:(event.end - event.start),position:"absolute", top:event.start, left:`${event.depth*column_width}px`,backgroundColor:randomColor, border:"1px solid black"}).appendTo('#grid');
				}
			})
		},
		init : function(){
			var that = this;
			that.draw_template_calendar();
			that.draw_events();
		}
	}
	return {
		init : function(){
			convert_events.init()
			overlaps.init()
			config_depth.init()          
			display.init();
		}()
	}
}());