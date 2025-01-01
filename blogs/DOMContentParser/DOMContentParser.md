# DOMContentParser() - a savior of SSR and CMS API HTML handling in browsers

##### Date : January 01, 2024 | [#tech, #frontend]()

I know what you are thinking, the title is not correct. It should have been **DOMParser**.
You might have guessed it is something related to web API becasuse of DOM mentioned, but not sure why?. I will tell you why I have written this.
First of all let us check the standard definition from the great mdn docs:

> The **`DOMParser`** interface provides the ability to parse [XML](https://developer.mozilla.org/en-US/docs/Glossary/XML) or [HTML](https://developer.mozilla.org/en-US/docs/Glossary/HTML) source code from a string into a DOM [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document).

To parse the data, we should have html with us. you cannot stream and parse the html on the fly. This web API helps us to parse text, images, or links from raw HTML responses. That's why I have written **DOMContentParser**. It parses almost all the elements from the html / xml.

## But, Why do we need this ?

Lets talk about the SSG (Static Site Generation) - Once the browser parses the HTML it receives from the static files or the CDN, we know with the event `DOMContentLoaded` that the html is loaded and now the scripts are executed with attached listeners and adding interactivity. And If you are receiving the HTML content from a server, you need to parse the html content to render it on to the page. Here **DOMParser** helps us here to achieve this, and if we want to dynamically edit the content received then we can use this web api to parse and use our regular DOM api's to interact and modify the contents, just like we do after the html page is rendered completely on to the browser.

The best use case would be use the web api in SSR or while retrieving data from the CMS.
The SSR which stands for **Server Side Rendering** in which the content is pre-rendered on the server and then delivered to the client's browser, which can increase the performance and helps in SEO. If we need to dynamically render the HTML content before it reaches the browser, `DOMContentParser` can parse the HTML on the server and apply these modifications or you can do it on the Client side Javascript as well if you are using frameworks or libraries like (React, Vue, Nextjs). The modifications can be from adding meta tags, passing conditionally render images, updating data coming from CMS.
With CMS generally you get data in JSON format which contains the content (ex: button text, css styling, business data, etc) which needs to render on the client's browser, you can use the **DOMContentParser** if there are html content being passed into the JSON and wants to be render on the browser.

## Lets understand with a use case:

I am not going to explain in depth detail as you can better find the explanation here in the [MDN Docs ](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)

I had a problem statement in my company to render images from two servers based on where the assets are hosted. The challenge was to do this on the text editor every time the page is refreshed, the text editor shows up, while fetching the content from the server, and displaying the content when fetched.
I discussed the technical requirements which obviously I cannot share, also I cannot share in this how I coded the text editor to show images, which is out of scope of this article. You can find plenty of resources better than me explaining this stuff online. What I can say is that we used a third party text editor and added custom plugins to work as we wanted.
Ok, back to the topic , So I thought about how I would solve this, I know that I am receiving HTML content from the server. I just need to parse the html and modify the images **src** attributes everywhere in the text editor body. So I googled and found the **DOMParser**, which was exactly solving my problem. I did a few tweaks and build a small reusable function
Sharing the code :

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=seti&wt=none&l=javascript&width=680&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=function%2520renderDOMContentParser%28content%252C%2520removePrefix%2520%253D%2520false%29%257B%250A%2509let%2520body%2520%253D%2520%27%27%250A%2509const%2520dom%2520%253D%2520new%2520DOMParser%28%29%250A%2509const%2520html%2520%253D%2520dom.parseFromString%28content%252C%2520%27texthtml%27%29%250A%2509const%2520images%2520%253D%2520html.getElementByTagName%28%27img%27%29%250A%250A%2509if%2520%28%21removePrefix%29%257B%250A%2509%2509Array.from%28images%29.forEach%28img%2520%253D%253E%2520%257B%250A%2509%2509%2509const%2520src%2520%253D%2520img.getAttribute%28%27src%27%29%250A%2509%2509%2509if%2520%28%21src.toString%28%29.startsWith%28%2560YOUR%2520FIRST%2520DOMAIN%2560%29%2520%2526%2526%2520src.toString%28%29.startsWith%28%2560YOUR%2520SECOND%2520DOMAIN%2560%29%257B%250A%2509%2509%2509%2509const%2520parsedImgPath%2520%253D%2520%2560TO%2520BE%2520REPLACE%2520IMG%2520SRC%2560%250A%2509%2509%2509img.setAttribute%28%27src%27%252CparsedImgPath%29%250A%2509%2509%2509%257D%2520else%2520%257B%250A%2509%2509%2509%2509img.setAttribute%28%27src%27%252C%2560%2524%257Bsrc%257D%2560%29%250A%2509%2509%2509%257D%250A%2509%2509%257D%29%250A%2509%2509body%2520%253D%2520html.body.outerHTML%250A%2509%257D%2520else%2520%257B%250A%2509%2509Array.from%28images%29.forEach%28img%2520%253D%253E%2520%257B%250A%2509%2509const%2520src%2520%253D%2520img.getAttribute%28%27src%27%29%250A%2509%2509if%2520%28%21src.toString%28%29.startsWith%28%2560YOUR%2520FIRST%2520DOMAIN%2560%29%2520%2526%2526%2520src.toString%28%29.startsWith%28%2560YOUR%2520SECOND%2520DOMAIN%2560%29%257B%250A%2509%2509%2509const%2520parsedImgPath%2520%253D%2520src.toString%28%29.replace%28%2560SOME%2520PREFIX%2520WHICH%2520DOESNT%2520EXIST%2520ON%2520THE%2520SERVER%2560%252C%2522%2522%29%250A%2509%2509img.setAttribute%28%27src%27%252CparsedImgPath%29%250A%2509%2509%257D%2520else%2520%257B%250A%2509%2509%2509img.setAttribute%28%27src%27%252C%2560%2524%257Bsrc%257D%2560%29%250A%2509%2509%257D%250A%2509%2509%257D%29%250A%2509%2509body%2520%253D%2520html.body.outerHTML%250A%2509%257D%250A%257D"
  style=" height: 800px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

I know you might not understand the code completely and there may be improvements to be done to this small piece of code as I coded this as an example here and as I have not given the exact business requirements we wanted. But you know why and how to use **DOMParser**. My intention in this blog post was to introduce you to the **DOMParser** and the use case which I had used at my work.
