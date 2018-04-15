import $ from 'jquery';
import './style.css';

//jshint esnext:true
$(document).ready(function() {
	//creates timer object
	function timer(hours, minutes, seconds){
	    this.hours = hours;
	    this.minutes = minutes;
	    this.seconds = seconds;
	}
	var sessionTime = new timer(0, 25, 15);
	var breakTime = new timer(0, 5, 45);
	var myTimer = new timer(
	    sessionTime.hours,
	    sessionTime.minutes,
	    sessionTime.seconds
	);
	var sessionTimerActive = true;
	var hourRotation = 0;
	var minRotation = 0;
	var timerOn = true;
	var disableButtons = false;
	var intervalTimer = null;
	var pauseAnim = true;
	var totalTime;
	var intervalId;

	//function to properly decrement and increment the timer objects passed to it
	function timeIncrement(change, timeObject) {
	    //reduce hours unless they equal 0;
	    if (change === "h" && parseInt(timeObject.hours) > 0) {
	      	timeObject.hours--;
	      	return;
	    }
	    //if reducing second or minutes
	    if (change === "s" || change === "m") {
	      	//if reducing seconds or minutes needs to take from hours
	      	if (
	        (change === "s" && parseInt(timeObject.seconds) === 0 && parseInt(timeObject.minutes) === 0 && parseInt(timeObject.hours) > 0) ||
	        (change === "m" && parseInt(timeObject.minutes) === 0 && parseInt(timeObject.hours) > 0)
	        ) {
		        timeObject.hours--;
		        timeObject.minutes = "59";
		        return;
	      	}
	      	//if reducing seconds needs to take from minutes
	      	if (change === "s" && parseInt(timeObject.seconds) === 0 && parseInt(timeObject.minutes) > 0) {
	        	timeObject.minutes--;
	        	timeObject.seconds = "59";
	        	return;
	      	}
	      	//reduce seconds unless they equal 0
	      	if (change === "s" && parseInt(timeObject.seconds) > 0) {
	        	timeObject.seconds--;
	        	return;
	      	}
	      	//reduce minutes unless they equal 0
	      	if (change === "m" && parseInt(timeObject.minutes) > 0) {
	        	timeObject.minutes--;
	        	return;
	      	}
	    }
	    //end subtraction section

	    //adds hours unless hours are equal to 24
	    if (change === "H" && parseInt(timeObject.hours) < 24){
	      	timeObject.hours++;
	      	return;
	    }
	    //execute if change is add second or minute
	    if (change === "S" || change === "M") {
	      	//if adding seconds or minutes will add hours
	      	if (
	        (change === "S" &&  parseInt(timeObject.seconds) === 59 && parseInt(timeObject.minutes) === 59 && parseInt(timeObject.hours) < 24) ||
	        (change === "M" && parseInt(timeObject.minutes) === 59 && parseInt(timeObject.hours) < 24)
	        ) {
	        	//if adding seconds changes hours, change seconds to zero then continue to change minutes and to hours
	        	if (change === "S") {
	          		timeObject.seconds = 0;
	        	}
	        	//if adding minutes changes hours zero minutes and add to hours
	        	timeObject.minutes = 0;
	        	timeObject.hours++;
	        	return;
	      	}
	      	//if adding seconds changes mintues zero seconds and add to mintues
	      	if (change === "S" && parseInt(timeObject.seconds) == 59 && parseInt(timeObject.minutes) < 59) {
	        	timeObject.seconds = 0;
	        	timeObject.minutes++;
	        	return;
	      	}
	      	//add to seconds
	      	if (change === "S" && parseInt(timeObject.seconds) < 59) {
	        	timeObject.seconds++;
	        	return;
	      	}
	      	//add to minutes
	      	if (change === "M" && parseInt(timeObject.minutes) < 59) {
	        	timeObject.minutes++;
	        	return;
	      	}
	    }
	}

	var ringAnimation = function(message) {
	    return new Promise(function(resolve, reject) {
		    let innerComplete = TweenMax.to("#innerRing", totalTime, {
		        ease: Power0.easeNone,
		        rotation: totalTime * 360,
		        paused: pauseAnim,
		        transformOrigin: "50% 50%"
		    });
		    let middleComplete = TweenMax.to("#middleRing", totalTime, {
		        ease: Power0.easeNone,
		        rotation: -(totalTime / 60 * 360) + minRotation,
		        paused: pauseAnim,
		        transformOrigin: "50% 50%"
		    });
		    let outterComplete = TweenMax.to("#outterRing", totalTime, {
		        rotation: totalTime / 60 / 60 * 360 - hourRotation - minRotation / 60,
		        ease: Power0.easeNone,
		        paused: pauseAnim,
		        transformOrigin: "50% 50%"
		    });
		    if(innerComplete && middleComplete && outterComplete){
		      	resolve(message + "ringAnimation started ");
		  	} else{
		  		reject(message + "ringAnimation failure ");
		  	}
	    });
	};

	var calculateRotations = function(message) {
	    return new Promise(function(resolve, reject) {
	      	totalTime = 0;
	      	totalTime = myTimer.seconds + myTimer.minutes * 60 + myTimer.hours * 60 * 60;
		    if(totalTime !== 0){
		    	resolve("calculateRotations complete ");
	  		}else{
	  			reject("calculateRotations failure ");
	  		}
	    });
	};

	var resetRingAnimation = function(message) {
	    return new Promise(function(resolve, reject) {
		    let inner = TweenMax.to("#innerRing", 1.5, {
		        rotation: 0,
		        ease: Power2.easeOut,
		        transformOrigin: "50% 50%"
		    });
		    let middle = TweenMax.to("#middleRing", 1.5, {
		        rotation: 0,
		        ease: Power2.easeOut,
		        transformOrigin: "50% 50%"
		    });
		    let outter = TweenMax.to("#outterRing", 1.5, {
		        rotation: 0,
		        ease: Power2.easeOut,
		        transformOrigin: "50% 50%"
		    });
		    if(inner && middle && outter){
		    	console.log("at resetRingAnimation timeout");
		    	//setTimeout resolves the promise after the animation has completed
		      	setTimeout(() =>{ 
		      		console.log("completed resetRingAnimation timeout");
		      		resolve(message + "resetRingAnimation complete ")
		      	}, 1500);
		  	} else{
		  		reject(message + "resetRingAnimation failure ");
		  	}
	    });
	};

	var beginningRingAlignment = function(message) {
	    return new Promise(function(resolve, reject) {
	      	minRotation = 0;
	      	hourRotation = 0;

		    let inner = TweenMax.to("#innerRing", 0, {
		        rotation: 0,
		        ease: Bounce.easeOut,
		        transformOrigin: "50% 50%"
		    });
		    if (parseInt(myTimer.seconds) != 0) {
		        minRotation = parseInt(myTimer.seconds) * 6;
		        TweenMax.to("#middleRing", 3, {
		        	rotation: minRotation,
		        	ease: Bounce.easeOut,
		        	transformOrigin: "50% 50%"
		        });
		    }
		    if (parseInt(myTimer.minutes) != 0) {
		        hourRotation = parseInt(myTimer.minutes) * 6;
		        TweenMax.to("#outterRing", 3, {
		          	rotation: -hourRotation,
		          	ease: Bounce.easeOut,
		          	transformOrigin: "50% 50%"
		        });
		    }
		    if(inner){
		    	console.log("at beginningRingAlignment timeout");
		    	//setTimeout resolves the promise after the animation has completed
	      		setTimeout(() => {
	      			console.log("completed beginningRingAlignment timeout");
	      			resolve(message + "beginningRingAlignment complete ")
	      		}, 3000);
	      	}else{
	      		reject(message + "beginningRingAlignment failure ");
	      	}
	    });
	};

	let activeRingAlignment = function(message) {
	    return new Promise(function(resolve, reject) {
		    minRotation = 0;
		    hourRotation = 0;

		    let inner = TweenMax.to("#innerRing", 0, {
		        rotation: 0,
		        ease: Bounce.easeOut,
		        transformOrigin: "50% 50%"
		    });
		    if (parseInt(myTimer.seconds) != 0) {
		        minRotation = parseInt(myTimer.seconds) * 6;
		        TweenMax.to("#middleRing", 0, {
		          	rotation: minRotation,
		          	ease: Bounce.easeOut,
		          	transformOrigin: "50% 50%"
		        });
		    }
		    if (parseInt(myTimer.minutes) != 0) {
		        hourRotation = parseInt(myTimer.minutes) * 6;
		        TweenMax.to("#outterRing", 0, {
		          	rotation: -hourRotation,
		          	ease: Bounce.easeOut,
		          	transformOrigin: "50% 50%"
		        });
		    }
		    if(inner){
	      		resolve(message + "beginningRingAlignment complete");
	      	}else{
	      		reject(message + "beginningRingAlignment failure ");
	      	}
	    });
	};


	let startTimer = function(message) {
	    return new Promise(function(resolve, reject) {
	    	intervalId = setInterval(pomodoroTimer, 1000);
	    	if(intervalId !== undefined){
	      		resolve(message + "StartTimer complete");
	      	}else{
	      		reject(message + "StartTimer failure ");
	      	}
	    });
	};

	function disableButtonFunction() {
	    disableButtons = true;
	    $(".centerControlButton").css("background", "#9a4949");
	    return;
	}

	function enableButtonFunction() {
	    disableButtons = false;
	    $(".centerControlButton").css("background", "#3f3f40");
	    return;
	}

	function textColorChange() {
	    if (sessionTimerActive) {
	      	$("#start").css("color", "#e4ba1b");
	      	$("#toggleSessionBreak").css("color", "#337ab7");
	      	$("#reset").css("color", "#e4ba1b");
	    } else {
	      	$("#start").css("color", "#337ab7");
	      	$("#toggleSessionBreak").css("color", "#e4ba1b");
	      	$("#reset").css("color", "#337ab7");
	    }
	    return;
	}

  //function that swaps between session and break timers when time is up
	function sessionBreakSwapCheck() {
	    if (parseInt(myTimer.seconds) < 1 && parseInt(myTimer.minutes) < 1 && parseInt(myTimer.hours) < 1){
		    if (sessionTimerActive) {
		        $("#timerBell")[0].play();
		        sessionTimerActive = false;
		        pauseAnim = true;
		        disableButtonFunction();
		        clearInterval(intervalId);
		        myTimer.seconds = breakTime.seconds;
		        myTimer.minutes = breakTime.minutes;
		        myTimer.hours = breakTime.hours;
		        timeIncrement("S", myTimer);
		        resetRingAnimation()
		        .then(function(result) {
		            return calculateRotations(result);
		        })
		        .then(function(result) {
		            return beginningRingAlignment(result);
		        })
		        .then(function(result) {
		            return ringAnimation(result);
		        })
		        .then(function(result) {
		            return startTimer(result);
		        })
		        .then(function(result) {
		            enableButtonFunction();
		            textColorChange();
		            console.log(result);
		        });
		        $("#timerLabel").replaceWith(
		          	"<p id='timerLabel'><span class='breakTimerColor'>Break Time Remaining</span></p>"
		        );
		        pauseAnim = false;
		    }else{
		        $("#timerBell")[0].play();
		        sessionTimerActive = true;
		        pauseAnim = true;
		        disableButtonFunction();
		        clearInterval(intervalId);
		        myTimer.seconds = sessionTime.seconds;
		        myTimer.minutes = sessionTime.minutes;
		        myTimer.hours = sessionTime.hours;
		        timeIncrement("S", myTimer);
		        resetRingAnimation()
		        .then(function(result) {
		            return calculateRotations(result);
		        })
		        .then(function(result) {
		            return beginningRingAlignment(result);
		        })
		        .then(function(result) {
		            return ringAnimation(result);
		        })
		        .then(function(result) {
		            return startTimer(result);
		        })
		        .then(function(result) {
		           	enableButtonFunction();
		            textColorChange();
		            console.log(result);
		        });
		        $("#timerLabel").replaceWith(
		          	"<p id='timerLabel'><span class='sessionTimerColor'>Session Time Remaining</span></p>"
		        );
		        pauseAnim = false;
		    }
	    }
	}

  //function that defines how the timer object should be displayed as a string. If hours are not defined they will not show up in the on screen timer.
	myTimer.toString = function myTimerToString() {
	    if (parseInt(this.seconds) < 10) {
	      	this.seconds = "0" + this.seconds;
	    }
	    if (parseInt(this.minutes) < 10 && parseInt(this.hours) > 0 && this.minutes !== "0" + parseInt(this.minutes)){
	      	this.minutes = "0" + this.minutes;
	    }
	    if (parseInt(myTimer.hours) <= 0) {
	      	var display = this.minutes + ":" + this.seconds;
	      	return display;
	    }else {
	      	var display = this.hours + ":" + this.minutes + ":" + this.seconds;
	      	return display;
	    }
	};

  //function that runs once per second rewriting the displayed time and calling for a second to be decremented from the remaining time.
	function pomodoroTimer() {
	    sessionBreakSwapCheck();
	    timeIncrement("s", myTimer);
	    if (sessionTimerActive) {
	    	$(".timer").replaceWith(
	        	"<div class='timer sessionTimerColor'>" + myTimer.toString() + "</div>"
	      	);
	      	return;
	    }
	    	$(".timer").replaceWith(
	      		"<div class='timer breakTimerColor'>" + myTimer.toString() + "</div>"
	    	);
	    return;
	}

  //Renders the numbers in the control panel
	function renderControlNumbers() {
	    $("#sessionHours").replaceWith(
	      	"<span id='sessionHours'>" + sessionTime.hours + "</span>"
	    );
	    $("#sessionMinutes").replaceWith(
	      	"<span id='sessionMinutes'>" + sessionTime.minutes + "</span>"
	    );
	    $("#sessionSeconds").replaceWith(
	      	"<span id='sessionSeconds'>" + sessionTime.seconds + "</span>"
	    );
	    $("#breakHours").replaceWith(
	      	"<span id='breakHours'>" + breakTime.hours + "</span>"
	    );
	    $("#breakMinutes").replaceWith(
	      	"<span id='breakMinutes'>" + breakTime.minutes + "</span>"
	    );
	    $("#breakSeconds").replaceWith(
	      	"<span id='breakSeconds'>" + breakTime.seconds + "</span>"
	    );
	}
	renderControlNumbers();

	//Starts and stops the timer
	$("#start").on("click", function() {
	    if (!disableButtons) {
		    if (!timerOn) {
		        pauseAnim = false;
		        console.log("before enableButtonFunction()");
		        disableButtonFunction();
		        console.log("after enableButtonFunction()");
		        calculateRotations()
		        .then(activeRingAlignment)
		        .then(ringAnimation)
		        .then(startTimer)
		        .then(enableButtonFunction())
		        .then(textColorChange());
		        //pomodoroTimer();
		        timerOn = true;
		        return;
		    } else {
		        pauseAnim = true;
		        clearInterval(intervalId);
		        calculateRotations()
		        .then(activeRingAlignment)
		        .then(ringAnimation);
		        timerOn = false;
		        return;
		    }
	    }
	});

  	// Starts the timer on page load
	$(".timer").replaceWith(
	    "<div class='timer sessionTimerColor'>" + myTimer.toString() + "</div>"
	);
	pauseAnim = false;
	disableButtonFunction();
	calculateRotations()
    .then(function(result) {
      return beginningRingAlignment(result);
    })
    .then(function(result) {
      return ringAnimation(result);
    })
    .then(function(result) {
      return startTimer(result);
    })
    .then(function(result) {
      enableButtonFunction();
      console.log(result);
    });

	//toggles between session timer and break timer
	$("#toggleSessionBreak").on("click", function() {
	    if (!disableButtons) {
		    if (sessionTimerActive) {
		        sessionTimerActive = false;
		        console.log("In toggle: " + sessionTimerActive);
		        disableButtonFunction();
		        myTimer.seconds = breakTime.seconds;
		        myTimer.minutes = breakTime.minutes;
		        myTimer.hours = breakTime.hours;
		        clearInterval(intervalId);
		        textColorChange();
		        resetRingAnimation()
		        .then(function(result) {
		        	return calculateRotations(result)
		        })
		        .then(function(result) {
		        	return beginningRingAlignment(result)
		        })
		        .then(function(result) {
		        	return ringAnimation(result)
		        })
		        .then(function(result) {
		        	enableButtonFunction();
		        	if (timerOn) {
		            	return startTimer(result);
		        	}
		        });

		        $(".timer").replaceWith(
		          "<div class='timer breakTimerColor'>" + myTimer.toString() + "</div>"
		        );
		        $("#timerLabel").replaceWith(
		          "<p id='timerLabel'><span class='breakTimerColor'>Break Time Remaining</span></p>"
		        );
			} else {
		        sessionTimerActive = true;
		        console.log("In toggle: " + sessionTimerActive);
		        disableButtonFunction();
		        myTimer.seconds = sessionTime.seconds;
		        myTimer.minutes = sessionTime.minutes;
		        myTimer.hours = sessionTime.hours;
		        clearInterval(intervalId);
		        textColorChange();
		        resetRingAnimation()
		        .then(function(result) {
		        	return calculateRotations(result)
		        })
		        .then(function(result) {
		        	return beginningRingAlignment(result)
		        })
		        .then(function(result) {
		        	return ringAnimation(result)
		        })
		        .then(function(result) {
		            enableButtonFunction();
		            if (timerOn) {
		            	return startTimer(result);
		            }
		        });
		        $(".timer").replaceWith(
		          	"<div class='timer sessionTimerColor'>"+myTimer.toString()+"</div>"
		        );
		        $("#timerLabel").replaceWith(
		          	"<p id='timerLabel'><span class='sessionTimerColor'>Session Time Remaining</span></p>"
		        );
			}
	    }
	});

	$("#reset").on("click", function() {
	    if (!disableButtons) {
		    if (sessionTimerActive) {
		        disableButtonFunction();
		        myTimer.seconds = sessionTime.seconds;
		        myTimer.minutes = sessionTime.minutes;
		        myTimer.hours = sessionTime.hours;
		        $(".timer").replaceWith(
		          	"<div class='timer sessionTimerColor'>"+myTimer.toString()+"</div>"
		        );
		        clearInterval(intervalId);
		        textColorChange();
		        resetRingAnimation()
		        .then(function(result) {
		            return calculateRotations(result);
		        })
		        .then(function(result) {
		            return beginningRingAlignment(result);
		        })
		        .then(function(result) {
		            return ringAnimation(result);
		        })
		        .then(function(result) {
		            if (timerOn) {
		              	return startTimer(result);
		            }
		        })
		        .then(function(result) {
		            enableButtonFunction();
		            console.log(result);
		        });
		    } else {
		        disableButtonFunction();
		        myTimer.seconds = breakTime.seconds;
		        myTimer.minutes = breakTime.minutes;
		        myTimer.hours = breakTime.hours;
		        $(".timer").replaceWith(
		          	"<div class='timer breakTimerColor'>"+myTimer.toString()+"</div>"
		        );
		        clearInterval(intervalId);
		        textColorChange();
		        resetRingAnimation()
		        .then(function(result) {
		            return calculateRotations(result);
		        })
		        .then(function(result) {
		            return beginningRingAlignment(result);
		        })
		        .then(function(result) {
		            return ringAnimation(result);
		        })
		        .then(function(result) {
		            if (timerOn) {
		              	return startTimer(result);
		            }
		        })
		        .then(function(result) {
		            enableButtonFunction();
		        });
		    }
	    }
	});

	function highlightTimeChange(highlightSession, timeValue) {
	    console.log(
	      	"in highlightTimeChange highlightSession is: " + highlightSession,
	      	" timeValue is: " + timeValue
	    );
	    if (highlightSession) {
	    	if (timeValue == "hours") {
	        	$("#sessionHours").css("textShadow", "0px 0px 5px white");
	        	return;
	      	}
		    if (timeValue == "minutes") {
		        $("#sessionMinutes").css("textShadow", "0px 0px 5px white");
		        return;
		    }
		    if (timeValue == "seconds") {
		        $("#sessionSeconds").css("textShadow", "0px 0px 5px white");
		        return;
		    }
	    } else {
	      	if (timeValue == "hours") {
	        	$("#breakHours").css("textShadow", "0px 0px 5px white");
	        	return;
	      	}
	      	if (timeValue == "minutes") {
	        	$("#breakMinutes").css("textShadow", "0px 0px 5px white");
	        	return;
	      	}
	      	if (timeValue == "seconds") {
	        	$("#breakSeconds").css("textShadow", "0px 0px 5px white");
	        	return;
	      	}
	    }
	}

	$("#sessionHoursUp").on("click", function() {
	    timeIncrement("H", sessionTime);
	    highlightTimeChange(true, "hours");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#sessionHoursDown").on("click", function() {
	    timeIncrement("h", sessionTime);
	    highlightTimeChange(true, "hours");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#sessionMinutesUp").on("click", function() {
	    timeIncrement("M", sessionTime);
	    highlightTimeChange(true, "minutes");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#sessionMinutesDown").on("click", function() {
	    timeIncrement("m", sessionTime);
	    highlightTimeChange(true, "minutes");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#sessionSecondsUp").on("click", function() {
	    timeIncrement("S", sessionTime);
	    highlightTimeChange(true, "seconds");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#sessionSecondsDown").on("click", function() {
	    timeIncrement("s", sessionTime);
	    highlightTimeChange(true, "seconds");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#breakHoursUp").on("click", function() {
	    timeIncrement("H", breakTime);
	    highlightTimeChange(false, "hours");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#breakHoursDown").on("click", function() {
	    timeIncrement("h", breakTime);
	    highlightTimeChange(false, "hours");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#breakMinutesUp").on("click", function() {
	    timeIncrement("M", breakTime);
	    highlightTimeChange(false, "minutes");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#breakMinutesDown").on("click", function() {
	    timeIncrement("m", breakTime);
	    highlightTimeChange(false, "minutes");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#breakSecondsUp").on("click", function() {
	    timeIncrement("S", breakTime);
	    highlightTimeChange(false, "seconds");
	    setTimeout(renderControlNumbers, 100);
	});

	$("#breakSecondsDown").on("click", function() {
	    timeIncrement("s", breakTime);
	    highlightTimeChange(false, "seconds");
	    setTimeout(renderControlNumbers, 100);
	});
});
