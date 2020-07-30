// user defined
(function() {

// 文章详情页，上下篇如果不存在，移除链接
var pagePrevious = $('.pager.pager-round>.previous>a[title=""]'),
    pageNext = $('.pager.pager-round>.next>a[title=""]');
if (pagePrevious.length == 1) {
    pagePrevious.addClass('no-more-article').removeAttr('href');
    pagePrevious.find('span').text('：无');
}
if (pageNext.length == 1) {
    pageNext.addClass('no-more-article').removeAttr('href');
    pageNext.find('span').text('：无');
}

const getCurCategoryId = () => {
	let pathname = window.location.pathname;
	let paramArray = pathname.split('/');
	if (paramArray.length != 0) {
		let category = paramArray[paramArray.length-2];
		return category;
	} else {
		return null;
	}
};

// 渲染搜索新闻数据
const renderNewsHandler = (data) => {
	let newsList = data.data;
	if (newsList.length == 0) {
		return false;
	}

	$.each(newsList.rows, (i,v) => {
		v.contentUrl = window.location.pathname.replace('index.html', v.contentUrl);
	});

	// 清空新闻区域
	let newsArea = $('div.met-news-list>ul.met-page-ajax');
	newsArea.empty();

	// 渲染新闻
	let html = $('#news-line').html();
	let template = Handlebars.compile(html);
	let finishedTpl = template(newsList);
	$('ul.met-page-ajax').append(finishedTpl);

	// 冻结翻页区域按钮
	$('.met_pager>a.NextSpan').text('总页：1');
	$('.met_pager>a.Ahover').removeAttr('href').addClass('no-more-article');
};

// 新闻搜索
$(document).on('click', '.input-search>.input-search-btn', () => {
	let searchWord, categoryId;
	searchWord = $('input[name=searchword]').val();
	categoryId = getCurCategoryId();

	if (searchWord == '') {
		return false;
	}

	$.ajax({
		url: '/cms/content/queryByKey',
		data: {
			categoryId: categoryId,
			searchKeyword: searchWord
		},
		type: 'POST',
		dataType: 'json',
		success: (data) => {
			console.log(data);
			renderNewsHandler(data);
		}
	});
});

})();