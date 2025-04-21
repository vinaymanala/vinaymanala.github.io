(() => {
  let blogsIntervalId, shortsIntervalId;

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
    const tagsEl = document.querySelector(".tags-view");
    if (tagsEl) {
      let Tags = await fetch("./tags.json");
      const { tags } = await Tags.json();
      tagsHtml = document.querySelector(".tags-view");
      const divTag = document.createElement("div");
      const ulTag = document.createElement("ul");
      const fragment = document.createDocumentFragment();
      tagsHtml.innerHTML = "";
      tags.map(
        (t) =>
          (ulTag.innerHTML += `
        <li>
        <a href=${`tags${t.url}`}><h3>#${t.tag}</h3></a></li>`)
      );

      divTag.appendChild(ulTag);
      fragment.appendChild(divTag);
      tagsHtml.appendChild(fragment);
    }
  })();

  // fetch blogs and shorts filtered by tags
  (async function () {
    const pageTag = window.location.pathname.split("/")[3];
    console.log(pageTag);
    const tagArticles = document.querySelector(".tags-articles");
    if (tagArticles) {
      const blogs = await fetchBlogs((url = "../../blogs/blogs.json"));
      const shorts = await fetchShorts((url = "../../shorts/shorts.json"));

      filteredBlogsByTags = [
        ...blogs.filter((blog) => blog.tags.includes(pageTag.toLowerCase())),
      ];
      filteredShortsByTags = [
        ...shorts.filter((short) => short.tags.includes(pageTag.toLowerCase())),
      ];
      const filteredBlogs = await createContentList(
        filteredBlogsByTags,
        (rootFilePath = "../../blogs")
      );

      const filteredShorts = await createContentList(
        filteredShortsByTags,
        (rootFilePath = "../../shorts")
      );

      if (!filteredBlogs.length && !filteredShorts.length) {
        tagArticles.innerHTML = `<div>
            <p style="text-align: center;">No results to view</p>
          </div>`;
      }

      for (let content of [...filteredBlogs, ...filteredShorts]) {
        if (content) {
          tagArticles.innerHTML += createContent(content);
        }
      }
    }
  })();

  // blogs and shorts list creation
  async function createContentList(article, rootFilePath) {
    const list = [];
    for (let a of article) {
      const res = await fetch(rootFilePath + a.file);
      const text = (await res.text()).split("\n");
      const description =
        text.slice(1, 2).join("\n") + text.slice(3, 6).join("\n");
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
    if (blogArticles) {
      const blogs = await fetchBlogs((url = "./blogs.json"));
      const blogsList = await createContentList(blogs, (rootFilePath = "."));
      for (let blog of blogsList) {
        blogArticles.innerHTML += createContent(blog);
      }
    }
  })();
  // render short articles in shorts section
  (async function () {
    const shortArticles = document.querySelector(".shorts-articles");
    if (shortArticles) {
      const shorts = await fetchShorts((url = "./shorts.json"));
      const shortsList = await createContentList(shorts, (rootFilePath = "."));
      for (let short of shortsList) {
        shortArticles.innerHTML += createContent(short);
      }
    }
  })();

  // render blogs and short section
  (async function () {
    const blogsElement = document.querySelector(".blogs-view");
    const shortsElement = document.querySelector(".shorts-view");

    let blogsList, shortsList;
    if (blogsElement || shortsElement) {
      const blogs = await fetchBlogs((url = "./blogs/blogs.json"));
      blogsList = await createContentList(blogs, (rootFilePath = "./blogs"));

      const shorts = await fetchShorts((url = "./shorts/shorts.json"));
      shortsList = await createContentList(shorts, (rootFilePath = "./shorts"));

      let currentBlogIndex = 0;
      let currentShortIndex = 0;
      // Array.from({ length: 5 }, (_, i) => i + 1);
      function* blogsIteratorFn(items) {
        // for (let item of items) {
        //   yield item;
        // }
        while (true) {
          yield items[currentBlogIndex];
        }
      }

      function* shortsIteratorFn(items) {
        // for (let item of items) {
        //   yield item;
        // }
        while (true) {
          yield items[currentShortIndex];
        }
      }

      // let blogsIterator = iterator(blogsList);
      // let shortsIterator = shortsIteratorFn(shortsList);

      // if (blogsIntervalId) {
      //   clearInterval(blogsIntervalId);
      // }

      // let currentBlog = blogsIterator.next();
      // blogsElement.innerHTML = createContent(currentBlog.value);
      // blogsIntervalId = setInterval(() => {
      // const currentBlog = blogsIterator.next();
      // if (!currentBlog.done) {
      //   const blog = currentBlog.value;
      //   const buttons = document.getElementById("blog-buttons");
      //   blogsElement.innerHTML = createContent(blog);
      //   blogsElement.appendChild(buttons);
      // } else {
      //   blogsIterator = iterator(blogsList);
      // }
      // }, 2000);

      // if (shortsIntervalId) {
      //   clearInterval(shortsIntervalId);
      // }
      // const currentShort = shortsIterator.next();
      // shortsElement.innerHTML = await createContent(currentShort.value);
      // shortsIntervalId = setInterval(() => {
      // const currentShort = shortsIterator.next();
      // if (!currentShort.done) {
      //   const short = currentShort.value;
      //   shortsElement.innerHTML = createContent(short);
      // } else {
      //   shortsIterator = shortsIteratorFn(shortsList);
      // }
      // }, 1600);

      function updateBlogContent() {
        let blogsIterator = blogsIteratorFn(blogsList);

        const currentBlog = blogsIterator.next();
        if (!currentBlog.done) {
          const blog = currentBlog.value;
          const buttons = document.getElementById("blog-buttons");
          blogsElement.removeChild(buttons);
          blogsElement.innerHTML = createContent(blog);
          blogsElement.appendChild(buttons);
        } else {
          blogsIterator = blogsIteratorFn(blogsList);
        }
      }

      function updateShortsContent() {
        let shortsIterator = shortsIteratorFn(shortsList);
        const currentShort = shortsIterator.next();
        if (!currentShort.done) {
          const short = currentShort.value;
          const buttons = document.getElementById("shorts-buttons");
          // shortsElement.removeChild(buttons);
          shortsElement.innerHTML = createContent(short);
          shortsElement.appendChild(buttons);
        } else {
          shortsIterator = shortsIteratorFn(shortsList);
        }
      }

      document.getElementById("prev-blog-btn").addEventListener("click", () => {
        currentBlogIndex = (currentBlogIndex - 1 + blogs.length) % blogs.length;
        updateBlogContent();
      });

      document.getElementById("next-blog-btn").addEventListener("click", () => {
        currentBlogIndex = (currentBlogIndex + 1) % blogs.length;
        updateBlogContent();
      });

      document
        .getElementById("prev-short-btn")
        .addEventListener("click", () => {
          currentShortIndex =
            (currentShortIndex - 1 + shorts.length) % shorts.length;
          updateShortsContent();
        });

      document
        .getElementById("next-short-btn")
        .addEventListener("click", () => {
          currentShortIndex = (currentShortIndex + 1) % shorts.length;
          updateShortsContent();
        });
      updateBlogContent();
      updateShortsContent();
    }
  })();
})();
