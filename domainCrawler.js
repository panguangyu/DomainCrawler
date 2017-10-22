/**

 domainCrawler.js
 
 #@usage grab a url and get the domain in the grabbed hyperlink

 #@author panguangyu
 
 #@github panguangyu/domainCrawler
 
 */

var http = require('http');

var fs = require('fs');

var cheerio = require('cheerio');										//nodejs下一个jquery库

var url = 'http://www.baidu.com';										//设置一个开始爬取的网站url
        
http.get(url, function(res) {
            
	var html = '';
           
    res.on('data', function(data) {	
	
        html += data;													// 获取页面数据
    
	});
            
    res.on('end', function() {
                
        filterUrl(html);												// 通过过滤信息获取a标签中的超链接
               
        printInfo();													// 打印信息
				
    });
        
}).on('error', function() {
        
	console.log('Url Fail');											//url打开失败报错
        
    process.exit();
			
});

        
let printData = new Set();												//设置一个用于保存域名的集合，不可重复
                                          
var suffixSet = [];														//设置一个用于保存后缀的集合，可重复
                                      
var count = 0; 															//计数器：用于统计爬取页面所含连接数


/* 

过滤页面信息 

@params html string html页面的内容
@return none

*/


function filterUrl(html) {
    
	if (html) {
                
        var $ = cheerio.load(html);
                
        var urlList = $('a');											//根据id获取a标签的内容

               
        urlList.each(function(item) {									//遍历a标签的内容

            count++;													//计数器开始统计
        
            var url = $(this);
                    
            var url_href = url.attr('href');							//找到a标签并获取href属性
        
            var regexp = /^((https|http):\/\/){1}([^\/]+)/i				//网址符合http或https开始的才分析

            var regexpIp = /^\d{1,3}.\d{1,3}$/							//匹配IP地址后两段，如192.168.0.1则匹配0.1
                    
            if(url_href!=null&&regexp.test(url_href)){					//不为空并且网址有http协议则计数
        
                const tldjs = require('tldjs');							//引入强大的tldjs来分析连接的域名
                    
                var domainInfo = tldjs.parse(url_href);
        
                var domain = domainInfo['domain'].toLowerCase();		//获取网址所在的网站域名
        
                var suffix = domainInfo['publicSuffix'].toLowerCase();	//获取域名的主后缀
                        
                if(!regexpIp.test(domain)){								//经过滤后的域名不等于IP后两段则成功

                    printData.add(domain);	
                         
                    suffixSet.push(suffix);

                }

        
            }
        
        });
               
            return ;
				
    } else {
        
		console.log('No Href');
    
	}
    
}
    

    
/* 

打印信息 

@return none

*/


function printInfo() {
	
	console.log("---------------------\ngrabbed domains : \n---------------------");	

    printData.forEach(function(item) {

        var url_href = item;
                
        console.log(url_href);											// 打印抓取到的域名列表

               
    });

    console.log("---------------------\ntotal links : "+count);			// 输出统计数字
}
        