var i_love_u = [
		[140,150],[140,180],[140,210],[140,240],[140,270],
		
		[250,150],[250,180],[250,210],[250,240],[250,270],[280,270],[310,270],
		
		[360,150],[360,180],[360,210],[360,240],[360,270],[390,270],[420,270],[450,270],[450,240],[450,210],[450,180],[450,150],[420,150],[390,150],
		
		[500,150],[510,180],[520,210],[530,240],[540,270],[550,240],[560,210],[570,180],[580,150],
		
		[630,150],[660,150],[690,150],[630,180],[630,210],[630,240],[630,270],[660,270],[690,270],[660,210],[690,210],
		
		[800,150],[800,180],[800,210],[800,240],[800,270],[830,270],[860,270],[890,270],[890,240],[890,210],[890,180],[890,150]
		]
		
var myy = [
		[340,300],[350,270],[360,240],[370,210],[380,180],[390,210],[400,240],[410,270],[420,300],[430,270],[440,240],[450,210],[460,180],[470,210],[480,240],[490,270],[500,300],

		[550,180],[560,210],[570,240],[580,210],[590,180],[570,270],[570,300],
		
		[640,180],[650,210],[660,240],[670,210],[680,180],[660,270],[660,300]
		]
var totalimage = 18;
var ballcount = 0;
var centerball = false;
function form_i_love_u(){
	var i = 0;
	var ball = setInterval(function(){
			if(i == i_love_u.length - 1){
				setTimeout('unite()',3000);
				setTimeout('form_myy()',4500);
				clearInterval(ball);
			}
			createballfromfloor(i_love_u[i][0],i_love_u[i][1]);
			i++
		},
		200
	)
}

function unite(){
	var topcenter = $(window).height() / 2;
	var leftcenter = $(window).width() / 2;
	var ball = $(".ball");
	ball.animate({'top':topcenter + 'px','left':leftcenter+'px'},1500,'easeOutCirc',function(){
		ball.remove();
		ballcount = 0;
		creatcenterball();
	});	
}

function creatcenterball(){
	if(!centerball){
		$('body').append('<div class="ball" id="ball-center"></div>');
		centerball = true;
	}
}

function removecenterball(){
	$('#ball-center').remove();
}

function form_myy(){
	ballcount = 0;
	var i = 0;
	var ball = setInterval(function(){
			if(i === myy.length - 2){
				removecenterball();
			}
			if(i === myy.length - 1){
				setTimeout('unite()',3000);
				setTimeout('explose()',4000);
				clearInterval(ball);
			}
			createballfromcenter(myy[i][0],myy[i][1]);
			i++
		},
		200
	)
}

function explose(){
	removecenterball();
	for(var i = 0 ; i < 300 ; i++){
		ballcount ++;
		var topcenter = $(window).height() / 2;
		var leftcenter = $(window).width() / 2;
		var ball = $('<div class="ball" id="ball-'+ballcount+'" style="left:'+leftcenter+'px;top:'+topcenter+'px"></div>');
		ball.appendTo('body');
		var filter = Math.floor(Math.random() * 4);
		var topp , leftp;
		if(filter === 0){
			topp = 0;
			leftp = Math.floor(Math.random() * ($(window).width() - 20));
		}
		if(filter === 1){
			leftp = $(window).width() - 20;
			topp = Math.floor(Math.random() * ($(window).height() - 20));
		}
		if(filter === 2){
			topp = $(window).height() - 20;
			leftp = Math.floor(Math.random() * ($(window).width() - 20));
		}
		if(filter === 3){
			leftp = 0;
			topp = Math.floor(Math.random() * ($(window).height() - 20));
		}
		ball.animate({'top':topp + 'px','left':leftp + 'px'},1500,'easeInCirc',function(){
			$(this).remove();
		})
	}
	thumbinput();
}

function createballfromcenter(x,y){
	$('body').append('<div class="ball" id="ball-' + ballcount+'"></div>');
	var topcenter = $(window).height() / 2;
	var leftcenter = $(window).width() / 2;
	var ball = $('#ball-'+ballcount);
	ball.css({'top':topcenter + 'px','left':leftcenter + 'px'});
	ballcount ++;
	ball.animate({'top':y + 'px','left':x + 'px'},1500,'easeOutCirc');
}

function createballfromfloor(x,y){
	$('body').append('<div class="ball" id="ball-' + ballcount+'"></div>');
	var leftp = Math.floor(Math.random() * $(window).width()) + 'px',ball = $('#ball-'+ballcount);
	ball.css({'top':($(window).height() - 20) + 'px','left':leftp});
	ballcount ++;
	ball.animate({'top':y + 'px','left':x + 'px'},1500,'easeOutCirc');
}

function breakball(){
	var i = 0;
	var ballbreaker = setInterval(function()
		{
			if(i == (ballcount + 1)){
				clearInterval(ballbreaker);
			}
			var ball = $('#ball-'+ i ) , r = Math.floor(Math.random() * 2);
			ball.animate({
				top:[($(window).height() - 20) + 'px','easeOutBounce'],
				left:Math.floor(Math.random() * $(window).width()) + 'px'
				},
				2000,
				function(){
					$(this).remove();
				}
			);
			i++;
		},
		50
	);
}

function singlethumbinput(n,x,y){
	var thumb = $('<div class="thumb" id="thumb-'+n+'"><a title="i love you!" href="image/'+n+'.jpg"><img src="image/'+n+'_thumb.jpg" /></a></div>');
	var topp = $(window).height();
	var leftp = Math.floor(Math.random() * ($(window).width()-200));
	var angle = (Math.random() * 180)- 90;
	var toangle = (Math.random() * 60)- 390;
	thumb.css({'top':topp + 'px','left':leftp + 'px'});
	thumb.appendTo('body');
	thumb.animate({
			rotate:toangle+'deg',
			left:x + 'px',
			top:y + 'px',		
		},
		3000,
		function()
		{
			$(this).children("a").slimbox();
		}
	);
}

function thumbinput(){
	var x = 100 , y = 50, n = 1;
	var input = setInterval(function(){
		if((x + 250) > $(window).width()){
			x = 100;
			y += 250;
		}
		if(y > ($(window).height() - 250)){
			$('body').css({'overflow':'auto'});
		}
		if(n === totalimage){
			clearInterval(input);
		}
		singlethumbinput(n,x,y);
		n ++;
		x += 250;
	},
	1500
	)
}

$(document).ready(function() {
	//form_i_love_u();
	thumbinput();
})