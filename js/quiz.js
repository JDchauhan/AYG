function Quiz()
{
	var self = this;
	var popup = [];
	var timer;
	var questions;
	var tlife=0;
	var current;
	var score=0;
	var timelife;
	var stoplife;
	var swaplife;
	var fiftylife;
	var allUsers,currentUser;
	
	self.init = function()
	{
		allUsers = JSON.parse(localStorage.users);
		currentUser= allUsers[sessionStorage.userIndex];
		$(".username").html(currentUser.username);	
		
		if(getUrlVars()["sub"])
		{
			var temp = queset[getUrlVars()["sub"]].slice(); //copy data to temporary variable
			questions = shuffle(temp);
			_setQuestion();
			_updateScore();	
		}
		
		_handleEvent();
	};
	
	
		
		
	function _updateScore()
	{
		if(currentUser.userscore > 0)
		{
			score =score + currentUser.userscore;
		}
		
		currentUser.userscore = score;
		score=0;
		$(".userscore").html(currentUser.userscore);
	//	console.log("current user : ", currentUser);
	//	console.log("all users : ", allUsers);
		localStorage.users = JSON.stringify(allUsers);
	};
	
	function _setQuestion()
	{
		if(questions.length)
		{
			current = _getQuestion();
			var str = '<div class="table-row"><div class="question rounded table-cell"><span class="list-num">Question: </span>'+current.quest+'</div></div>';
				str += '<div class="table-row">';
				
				for(var i=0;i<current.options.length;i++)
				{
					str+= '<button class="options rounded table-cell"><span class="list-num">'+(i+1)+': </span> '+current.options[i]+'</button>';
				}

				str += '</div>';
				$("#quiz-container").html(str);
				$(document).ready(function(){
		   			$(".options").click(function(){
		   				var index = $(this).index();
		      			var correct= current.correct;
							if (index==correct)
							{
								_stopTimer();
								_open("right-dialog-box");
								score+=1000;
								_updateScore();
								$(".options").attr('disabled', "true");
								$(this).prop('disabled', false);
    							$(this).addClass("correct");
    							
														
							}
							else
							{
								_stopTimer();
								_open("wrong-dialog-box");
								$(".options").attr('disabled', "true");
								$(this).prop('disabled', false);
								$(this).addClass("incorrect");
								
							};
		 			});
				});
			_startTimer();
	//		console.log("questions in if : ", questions );
		}else
		{
			_stopTimer();
			_open("win-dialog-box");
	//		console.log("questions in else : ", questions);
			
		}
	}

	function _getQuestion()
	{
		var q = questions[0];
		questions.splice(0,1);
		return q;
	}
	
	// popup show/hide
	function _open(popupID)
	{
	//	$(".popup").hide();
		$("#"+popupID).show();
		popup.push(popupID); 
	};
	
	function _close()
	{
		var currentPopup = popup.pop();
		$("#"+currentPopup).hide();
	}
	
	function _stopTimer()
	{
		if(timer)
		{
			clearInterval(timer);
		}
	}
	
	function _startTimer()
	{	
		_stopTimer(); // rest timer 
		counter=60+tlife;
		timer = setInterval(function(){
			$("#timer").html(counter);
			counter--;
			if(counter ==-1)
			{
					_stopTimer();
					_open("timeup-dialog-box");	
				};
			},1000);
		
		
	}
	
	
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			vars[key] = value;
		});
		return vars;
	}


	
	function shuffle(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

		
	function _handleEvent()
	{
		// change buttons with id or class
		$(".buttons").on("click", function(){
			var type = $(this).attr("type");
			switch(type)
			{
				case "open-popup":
					var popupID = $(this).attr("popup");
					_open(popupID);		
				break;
				
				case "close-popup":
					_close();
				break;
				case "next-popup-close":
					_close();
					_setQuestion();	
				break;
				case "href":
					var page = $(this).attr("location");
					_close();  //for hide dialog bok after a option is selected
					var url = $(this).attr('location');		//store location of page in variable "url" to the webpage
					window.location = url;	//redirect to the webpage
				break;
				case "tlife":
					counter+=60;
					$('#timelife').attr('disabled', "true");
					timelife=false;
				break;
				case "swaplife":
					_setQuestion();
					$('#swaplife').attr('disabled', "true");
					swaplife=false;
				break;
				case "fiftylife":
		//			console.log("current : ", current);
					var temp = [];
					for(var i=0;i<current.options.length;i++)
					{
						if(i != current.correct)
						{
			//				//console.log(i);
							temp.push(i);
						}
					}
					
					$(".options").eq(temp[0]).attr('disabled', "true");
					$(".options").eq(temp[1]).attr('disabled', "true");
					
					$('#fiftylife').attr('disabled', "true");
					fiftylife=false;
				break;
				case "stoplife":
					$('#stoplife').attr('disabled', "true");
					_stopTimer();
					stoplife=false;
				break;
	
				case "buy-tlife":
					_close();
					if ((currentUser.userscore>=5000)&&(timelife==false)){
						$('#timelife').prop('disabled', false);
						score-=5000;
						timelife=true;
						_updateScore();
						
					} 
					else{
						_open("not-buy-dialog-box");
					};
					
				break;
				case "buy-swaplife":
					_close();
					if ((currentUser.userscore>=15000)&&(swaplife==false)){
						$('#swaplife').prop('disabled', false);
						score-=15000;
						swaplife=true;
						_updateScore();
					}
					else{
						_open("not-buy-dialog-box");
					}
						
				break;
				case "buy-fiftylife":
					_close();
					if ((currentUser.userscore>=10000)&&(fiftylife==false)){
						$('#fiftylife').prop('disabled', false);
						score-=10000;
						fiftylife=true;
						_updateScore();
					}
					else{
						_open("not-buy-dialog-box");
					}
				break;
				case "buy-stoplife":
					_close();
					if ((currentUser.userscore>=8000)&&(stoplife==false)){
						$('#stoplife').prop('disabled', false);
						score-=8000;
						stoplife=true;
						_updateScore();
					}
					else{
						_open("not-buy-dialog-box");
					}
				break;
			/*	case "localstorage":
					// Check browser support
					if (typeof(Storage) !== "undefined") {
					    // Store
					    localStorage.setItem("name", value);
    				var	name=localStorage.getItem("name");
    					localStorage.setItem("number", value);
    				var mobile=localStorage.getItem("number");
    					//console.log(name);
    					//console.log(mobile);
					    alert("save");
					    
					}
					else {
					  alert( "Sorry, your browser does not support Web Storage...");
					}
					break;
				*/				
				
			}
		});
	}
}

