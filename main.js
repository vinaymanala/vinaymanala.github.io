(() => {
  // dark theme settings
  (function () {
    const themeToggle = document.querySelector(".darkmode-toggle input");
    const light = "light";
    const dark = "dark";
    let isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    // console.log(isDark);
    if (isDark) {
      document.documentElement.classList.add(dark);
      themeToggle.checked = true;
    } else {
      document.documentElement.classList.remove(dark);
      themeToggle.checked = false;
    }

    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        localStorage.theme = dark;
        document.documentElement.classList.add(dark);
      } else {
        localStorage.theme = light;
        document.documentElement.classList.remove(dark);
      }
    });
  })();

  // fetch tags in pages
  (async function () {
    let [Tags, Blogs, Shorts] = await Promise.all([
      await fetch("./tags.json"),
      await fetch("./blogs/blogs.json"),
      await fetch("./shorts/shorts.json"),
    ]);
    const { tags } = await Tags.json();
    const { blogs } = await Blogs.json();
    const { shorts } = await Shorts.json();
    tagsHtml = document.querySelector(".tags-view");
    const divTag = document.createElement("div");
    const ulTag = document.createElement("ul");
    const fragment = document.createDocumentFragment();
    tagsHtml.innerHTML = "";
    tags.map(
      (t) =>
        (ulTag.innerHTML += `
      <li>
      <a href=${t.url}><h3>#${t.tag}</h3></a></li>`)
    );

    divTag.appendChild(ulTag);
    fragment.appendChild(divTag);
    tagsHtml.appendChild(fragment);
  })();

  // blogs and shorts list creation
  async function createContentList(article, rootFilePath) {
    const list = [];
    for (let a of article) {
      const res = await fetch(rootFilePath + a.file);
      const text = (await res.text()).split("\n");
      const description =
        text.slice(1, 2).join("\n") + text.slice(3, 7).join("\n");
      const articlesList = { ...a, url: rootFilePath + a.url, description };
      list.push(articlesList);
    }
    // console.log(list);
    return list;
  }

  // format Date
  function getDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  // blog content creation
  function createContent(article) {
    const divTag = document.createElement("div");
    const innerDivTag = document.createElement("div");
    const urlTag = document.createElement("a");
    const urlInnerTag = document.createElement("a");
    const titleH1Tag = document.createElement("h3");
    const descriptionPTag = document.createElement("p");
    const dateTextTag = document.createElement("span");
    const tagsTextTag = document.createElement("span");

    titleH1Tag.textContent = article.title;
    descriptionPTag.innerHTML =
      article.description + "... " + `<a href=${article.url}>Read more</a>`;
    dateTextTag.textContent = getDate(article.date);
    urlTag.href = article.url;
    tagsTextTag.textContent = article.tags.map((t) => "#" + t).join(" ");
    urlTag.appendChild(titleH1Tag);
    innerDivTag.appendChild(urlTag);
    innerDivTag.appendChild(descriptionPTag);
    innerDivTag.appendChild(urlInnerTag);
    innerDivTag.appendChild(dateTextTag);
    innerDivTag.appendChild(tagsTextTag);

    divTag.appendChild(innerDivTag);
    return divTag.innerHTML;
  }

  // fetch blogs
  async function fetchBlogs(url) {
    const res = await fetch(url);
    const { blogs } = await res.json();
    return blogs;
  }
  // fetch shorts
  async function fetchShorts(url) {
    const res = await fetch(url);
    const { shorts } = await res.json();
    return shorts;
  }

  // render blog  articles in blogs section
  (async function () {
    const blogArticles = document.querySelector(".blogs-articles");
    const blogs = blogArticles && (await fetchBlogs((url = "./blogs.json")));
    const blogsList = await createContentList(blogs, (rootFilePath = "."));
    for (let blog of blogsList) {
      blogArticles.innerHTML += createContent(blog);
    }
  })();
  // render short articles in shorts section
  (async function () {
    const shortArticles = document.querySelector(".shorts-articles");
    const shorts =
      shortArticles && (await fetchShorts((url = "./shorts.json")));
    const shortsList = await createContentList(shorts, (rootFilePath = "."));
    for (let short of shortsList) {
      shortArticles.innerHTML += createContent(short);
    }
  })();

  // render blogs and short section
  (async function () {
    const blogsElement = document.querySelector(".blogs-view");
    const shortsElement = document.querySelector(".shorts-view");

    const blogs =
      blogsElement && (await fetchBlogs((url = "./blogs/blogs.json")));
    const blogsList = await createContentList(
      blogs,
      (rootFilePath = "./blogs")
    );

    const shorts =
      shortsElement && (await fetchShorts((url = "./shorts/shorts.json")));
    const shortsList = await createContentList(
      shorts,
      (rootFilePath = "./shorts")
    );
    // Array.from({ length: 5 }, (_, i) => i + 1);
    function* iterator(items) {
      for (let item of items) {
        yield item;
      }
    }

    let blogsIterator = iterator(blogsList);
    let shortsIterator = iterator(shortsList);

    // setInterval(async () => {
    const currentBlog = blogsIterator.next();
    if (!currentBlog.done) {
      const blog = currentBlog.value;
      blogsElement.innerHTML = createContent(blog);
    } else {
      blogsIterator = iterator(blogsList);
    }
    // }, 20000);

    // setInterval(() => {
    const currentShort = shortsIterator.next();
    if (!currentShort.done) {
      const short = currentShort.value;
      shortsElement.innerHTML = createContent(short);
    } else {
      shortsIterator = iterator(shortsList);
    }
    // }, 16000);
  })();
})();
