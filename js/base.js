var pjaxBinded = false;
var disqus_shortname = 'garyblog';
var ujian_config = {showType:0};
var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
jQuery(document).ready(function($){
	if ($.browser.msie) {
		location.href = 'http://chrome.google.com';
	}
	afterLoaded();
	if( history && history.pushState){
		bindPjax();
	}
});

function afterLoaded(){
	bindSlimBox();
	$.getScript('http://garyblog.disqus.com/embed.js',function(data){eval(data);});
	$.getScript('http://garyblog.disqus.com/count.js',function(data){eval(data);});
	$.getScript('http://v1.ujian.cc/code/ujian.js?uid=97713',function(data){eval(data);});
}

function bindSlimBox(){
	if($('.postContent a[rel!=link]:has(img)').length > 0){
		$.getScript("{{ ASSET_PATH }}/js/slimbox2.js");
	};
}

function bindPjax(){
	$('a[target!=_blank]').live('click',function(event){
		var link = event.currentTarget;
		var url = link.href;
		// Middle click, cmd click, and ctrl click should open
		// links in a new tab as normal.
		if ( event.which > 1 || event.metaKey || event.ctrlKey )
			return

		// Ignore cross origin links
		if ( location.protocol !== link.protocol || location.host !== link.host ){
			return;
		}
		
		  // Ignore anchors on the same page
		if (link.hash && link.href.replace(link.hash, '') === location.href.replace(location.hash, ''))
			return

		// Ignore empty anchor "foo.html#"
		if (link.href === location.href + '#')
			return
		loadData(url,true);
		event.preventDefault();
	});
	
	
}

function loadData(url,toPush){
	$.ajax({
		url:url,
		beforeSend:function(jqXHR, settings){
			$('#content').fadeTo(500,0.3);
			scrollToTop();
			$('#header span.title').addClass('rotate');
		},
		complete:function(){
			$('#content').fadeTo(200,1);
			$('#header span.rotate').removeClass('rotate');
		},
		success:function(data){
			data = $(data);
			var title = data.filter('title').text();
			var category = data.find('.category').html();
			var content = data.find('#content').html();
			caculateCategory(category);
			$('#content').html(content);
			$('#content').fadeTo(500,1);
			document.title = title;
			if(toPush){
				window.history.pushState(null, title, url);
			}
			afterLoaded();
			if(!pjaxBinded){
				pjaxBinded = true;
				$(window).bind('popstate', function(e){
					loadData(location.pathname,false);
					return false;
				});
			}
		},
	});
}

function caculateCategory(category){
	$('#nav .menu-item').each(function(index,item){
		if($(item).find('a').html() == category){
			$(item).addClass('current-menu-item');
		}else{
			$(item).removeClass('current-menu-item');
		}
	});
}

function scrollToTop(){
	$body.animate({scrollTop: 0},600);
}