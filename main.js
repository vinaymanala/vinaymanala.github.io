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
    console.log(isDark);
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

  // blogs list creation
  async function createBlogsList(blogs, rootFilePath) {
    const list = [];
    for (let blog of blogs) {
      const res = await fetch(rootFilePath + blog.file);
      const text = (await res.text()).split("\n");
      const description =
        text.slice(1, 2).join("\n") + text.slice(3, 5).join("\n");
      const blogList = { ...blog, url: rootFilePath + blog.url, description };
      list.push(blogList);
    }
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
  function createBlogContent(blog) {
    const blogDivTag = document.createElement("div");
    const innerDivTag = document.createElement("div");
    const urlTag = document.createElement("a");
    const urlInnerTag = document.createElement("a");
    const titleH1Tag = document.createElement("h3");
    const descriptionPTag = document.createElement("p");
    const dateTextTag = document.createElement("span");
    const tagsTextTag = document.createElement("span");

    titleH1Tag.textContent = blog.title;
    descriptionPTag.textContent = blog.description + "...";
    dateTextTag.textContent = getDate(blog.date);
    urlTag.href = blog.url;
    tagsTextTag.textContent = blog.tags.map((t) => "#" + t.tag).join("");
    urlTag.appendChild(titleH1Tag);
    innerDivTag.appendChild(urlTag);
    innerDivTag.appendChild(descriptionPTag);
    innerDivTag.appendChild(urlInnerTag);
    innerDivTag.appendChild(dateTextTag);
    innerDivTag.appendChild(tagsTextTag);

    blogDivTag.appendChild(innerDivTag);
    return blogDivTag.innerHTML;
  }

  // fetch blogs
  async function fetchBlogs(url) {
    const res = await fetch(url);
    const { blogs } = await res.json();
    return blogs;
  }

  // render blog articles in blogs section
  (async function () {
    const blogArticles = document.querySelector(".blogs-articles");
    const blogs = blogArticles && (await fetchBlogs((url = "./blogs.json")));
    const blogsList = await createBlogsList(blogs, (rootFilePath = "."));
    for (let blog of blogsList) {
      blogArticles.innerHTML += createBlogContent(blog);
    }
  })();

  // render blogs and short section
  (async function () {
    const blogsElement = document.querySelector(".blogs-view");
    const shortsElement = document.querySelector(".shorts-view");

    const blogs =
      blogsElement && (await fetchBlogs((url = "./blogs/blogs.json")));
    const blogsList = await createBlogsList(blogs, (rootFilePath = "./blogs"));

    const shortsList = [];
    // Array.from({ length: 5 }, (_, i) => i + 1);
    function* iterator(items) {
      for (let item of items) {
        yield item;
      }
    }

    let blogsIterator = iterator(blogsList);
    let shortsIterator = iterator(shortsList);

    setInterval(async () => {
      const currentBlog = blogsIterator.next();
      if (!currentBlog.done) {
        const blog = currentBlog.value;

        blogsElement.innerHTML = createBlogContent(blog);
      } else {
        blogsIterator = iterator(blogsList);
      }
    }, 2000);

    setInterval(() => {
      const currentShort = shortsIterator.next();
      if (!currentShort.done) {
        const short = currentShort.value;
        shortsElement.innerHTML = short;
      } else {
        shortsIterator = iterator(shortsList);
      }
    }, 1600);
  })();
})();
