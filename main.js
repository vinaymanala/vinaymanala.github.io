(() => {
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

  (function () {
    const blogsElement = document.querySelector(".blogs-view");
    const shortsElement = document.querySelector(".shorts-view");
    const blogsList = Array.from({ length: 5 }, (_, i) => i + 1);
    const shortsList = Array.from({ length: 5 }, (_, i) => i + 1);

    function* iterator(items) {
      for (let item of items) {
        yield item;
      }
    }
    let blogsIterator = iterator(blogsList);
    let shortsIterator = iterator(shortsList);

    setInterval(() => {
      const currentBlog = blogsIterator.next();
      if (!currentBlog.done) {
        const blog = currentBlog.value;
        blogsElement.textContent = blog;
      } else {
        blogsIterator = iterator(blogsList);
      }
    }, 2000);

    setInterval(() => {
      const currentShort = shortsIterator.next();
      if (!currentShort.done) {
        const short = currentShort.value;
        shortsElement.textContent = short;
      } else {
        shortsIterator = iterator(shortsList);
      }
    }, 1600);
  })();
})();
