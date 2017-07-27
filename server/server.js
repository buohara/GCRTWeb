var http 	= require('http');
var fs 		= require('fs');
var url 	= require('url');
var path 	= require('path');

http.createServer(function(request, response)
{
	var q = url.parse(request.url, true);
	var fileName = ".." + q.pathname;
	var ext = path.extname(fileName);
	
	var type;

	if (fileName == '../')
	{
		fileName = '../index.html';
	}

	if (ext == ".js")
	{
		type = 'text/javascript'
	}
	else if (ext == '.ico')
	{
		return;
	}
	else
	{
		type = 'text/html'
	}

	fs.readFile(fileName, function(err, data)
	{
		response.writeHead(200, {'Content-Type': type});
		response.write(data);
		response.end();
	});
}).listen(8080);