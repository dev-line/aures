const list = [{
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "/public/Upload/ImgUpload-1558009369523.png",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 0,
        "_id": "5cdd562a489e892879913451",
        "Date": "2019-05-16T12:23:06.697Z",
        "Content": "<p><br>I ran into this error as well for a while. I think (hope) I&#39;ve wrapped my head around it, wanted to write it here for reference.</p><p>When you add middleware to&nbsp;<a href=\"https://github.com/senchalabs/connect\" rel=\"noreferrer\">connect</a> or&nbsp;<a href=\"https://github.com/visionmedia/express\" rel=\"noreferrer\">express</a> (which is built on connect) using the&nbsp;<code>app.use</code>method, you&#39;re appending items to&nbsp;<code>Server.prototype.stack</code> in connect (At least with the current&nbsp;<code>npm install connect</code>, which looks quite different from the one github as of this post). When the server gets a request, it iterates over the stack, calling the&nbsp;<code>(request, response, next)</code> method.</p><p>The problem is, if in one of the middleware items writes to the response body or headers (it looks like it&#39;s either/or for some reason),&nbsp;<strong>but doesn&#39;t call&nbsp;<code>response.end()</code> and you call&nbsp;<code>next()</code></strong> then as the core&nbsp;<code>Server.prototype.handle</code> method completes, it&#39;s going to notice that:</p><ol><li>there are no more items in the stack, and/or</li><li>that&nbsp;<code>response.headerSent</code> is true.</li></ol><p>So, it throws an error. But the error it throws is just this basic response (from the connect&nbsp;<code>http.js</code>source code:</p><pre><code>res.statusCode = 404;\nres.setHeader(&#39;Content-Type&#39;, &#39;text/plain&#39;);\nres.end(&#39;Cannot &#39; + req.method + &#39; &#39; + req.url);</code></pre><p>Right there, it&#39;s calling&nbsp;<code>res.setHeader(&#39;Content-Type&#39;, &#39;text/plain&#39;);</code>, which you are likely to have set in your&nbsp;<code>render</code> method,&nbsp;<strong>without calling response.end()</strong>, something like:</p><pre><code>response.setHeader(&quot;Content-Type&quot;, &quot;text/html&quot;);\nresponse.write(&quot;&lt;p&gt;Hello World&lt;/p&gt;&quot;);</code></pre><p>The way everything needs to be structured is like this:</p><h3>Good Middleware</h3><pre><code>// middleware that does not modify the response body\nvar doesNotModifyBody = function(request, response, next) {\n  request.params = {\n    a: &quot;b&quot;\n  };\n  // calls next because it hasn&#39;t modified the header\n  next();\n};\n\n// middleware that modify the response body\nvar doesModifyBody = function(request, response, next) {\n  response.setHeader(&quot;Content-Type&quot;, &quot;text/html&quot;);\n  response.write(&quot;&lt;p&gt;Hello World&lt;/p&gt;&quot;);\n  response.end();\n  // doesn&#39;t call next()\n};\n\napp.use(doesNotModifyBody);\napp.use(doesModifyBody);</code></pre>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "/public/Upload/ImgUpload-1558009369523.png",
        "Categ": [
            "News"
        ],
        "Comments": [],
        "Views": 29,
        "_id": "5cdd564b6ff2d02923ba627a",
        "Date": "2019-05-16T12:23:39.923Z",
        "Content": "<p><br>I ran into this error as well for a while. I think (hope) I've wrapped my head around it, wanted to write it here for reference.</p><p>When you add middleware to&nbsp;<a href=\"https://github.com/senchalabs/connect\" rel=\"noreferrer\">connect</a> or&nbsp;<a href=\"https://github.com/visionmedia/express\" rel=\"noreferrer\">express</a> (which is built on connect) using the&nbsp;<code>app.use</code>method, you're appending items to&nbsp;<code>Server.prototype.stack</code> in connect (At least with the current&nbsp;<code>npm install connect</code>, which looks quite different from the one github as of this post). When the server gets a request, it iterates over the stack, calling the&nbsp;<code>(request, response, next)</code> method.</p><p>The problem is, if in one of the middleware items writes to the response body or headers (it looks like it's either/or for some reason),&nbsp;<strong>but doesn't call&nbsp;<code>response.end()</code> and you call&nbsp;<code>next()</code></strong> then as the core&nbsp;<code>Server.prototype.handle</code> method completes, it's going to notice that:</p><ol><li>there are no more items in the stack, and/or</li><li>that&nbsp;<code>response.headerSent</code> is true.</li></ol><p>So, it throws an error. But the error it throws is just this basic response (from the connect&nbsp;<code>http.js</code>source code:</p><pre><code>res.statusCode = 404;\nres.setHeader('Content-Type', 'text/plain');\nres.end('Cannot ' + req.method + ' ' + req.url);</code></pre><p>Right there, it's calling&nbsp;<code>res.setHeader('Content-Type', 'text/plain');</code>, which you are likely to have set in your&nbsp;<code>render</code> method,&nbsp;<strong>without calling response.end()</strong>, something like:</p><pre><code>response.setHeader(\"Content-Type\", \"text/html\");\nresponse.write(\"&lt;p&gt;Hello World&lt;/p&gt;\");</code></pre><p>The way everything needs to be structured is like this:</p><h3>Good Middleware</h3><pre><code>// middleware that does not modify the response body\nvar doesNotModifyBody = function(request, response, next) {\n  request.params = {\n    a: \"b\"\n  };\n  // calls next because it hasn't modified the header\n  next();\n};\n\n// middleware that modify the response body\nvar doesModifyBody = function(request, response, next) {\n  response.setHeader(\"Content-Type\", \"text/html\");\n  response.write(\"&lt;p&gt;Hello World&lt;/p&gt;\");\n  response.end();\n  // doesn't call next()\n};\n\napp.use(doesNotModifyBody);\napp.use(doesModifyBody);</code></pre>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c3bd8651d12fce51537",
        "Date": "2019-05-28T11:32:11.839Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c46d8651d12fce51538",
        "Date": "2019-05-28T11:32:22.378Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c4dd8651d12fce51539",
        "Date": "2019-05-28T11:32:29.334Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c52d8651d12fce5153a",
        "Date": "2019-05-28T11:32:34.897Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c58d8651d12fce5153b",
        "Date": "2019-05-28T11:32:40.091Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c5cd8651d12fce5153c",
        "Date": "2019-05-28T11:32:44.705Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c62d8651d12fce5153d",
        "Date": "2019-05-28T11:32:50.110Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c67d8651d12fce5153e",
        "Date": "2019-05-28T11:32:55.659Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c6fd8651d12fce5153f",
        "Date": "2019-05-28T11:33:03.196Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد ",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1c96d8651d12fce51540",
        "Date": "2019-05-28T11:33:42.378Z",
        "Content": "<p>LKDQHFKLQ&lt;JKDLQS</p>",
        "__v": 0
    },
    {
        "Title": "في الجمعة 11 على التوالي من الحراك بداية توافد المتظاهرين على ساحة البريد المركزي",
        "Thumbnail": "",
        "Categ": [
            "أخبار"
        ],
        "Comments": [],
        "Views": 2,
        "_id": "5ced1e9a5291ff165f35bd5f",
        "Date": "2019-05-28T11:42:18.824Z",
        "Content": "<p>fQLKHFKLQJDKLFJKLMJDFLMJQKLJDFLKQ</p>",
        "__v": 0
    }
]
const resultat = list.find(fruit => fruit.Title === "في الجمعة 11 على التوالي من الحراك بداية توافد ");
console.log(resultat);
// function show(query) {
//     return query.Title === "في الجمعة 11 على التوالي من الحراك بداية توافد "
// }
// console.log(list.find(show));