var pjaxBinded = false;
var ujian_config = {showType:0};
var disqus_count_command;
var disqus_embed_command;
var ujian_command;
var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
jQuery(document).ready(function($){
	if ($.browser.msie) {
		location.href = 'http://chrome.google.com';
	}
	afterLoaded();
    $.getScript("/js/slimbox2.js");
	if( history && history.pushState){
		bindPjax();
	}
});

function afterLoaded(){
	bindSlimBox();
    if(disqus_shortname){
        window.DISQUSWIDGETS = undefined;
        if(disqus_count_command){
            eval(disqus_count_command);
        }else{
            $.getScript('http://' + disqus_shortname + '.disqus.com/count.js',function(data){
                        disqus_count_command = data;
                        eval(disqus_count_command);
                        });
        }
        
        if($('#disqus_thread').length){
            if(disqus_embed_command){
                eval(disqus_embed_command);
            }else{
                $.getScript('http://' + disqus_shortname + '.disqus.com/embed.js',function(data){
                            disqus_embed_command = data;
                            eval(disqus_embed_command);
                            });
            }
        }
    }
    if(ujian_uid && $('.ujian-hook').length){
        if(ujian_command){
            eval(ujian_command);
        }else{
            $.getScript('http://v1.ujian.cc/code/ujian.js?uid=' + ujian_uid,function(data){
                        ujian_command = data;
                        eval(ujian_command);
                        });
        }
    }
}

function bindSlimBox(){
	if($('.postContent a[rel!=link]:has(img)').length > 0){
        $(".postContent a[rel!=link]:has(img)").slimbox();
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