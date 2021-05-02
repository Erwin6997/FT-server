function setupPage(limit, data) {
  if (!data) {
    return null;
  } else {
    main.innerHTML = "";
    const newData = data;
    if (typeof data === "string") {
      newData = JSON.parse(data);
    }
    if (newData.page === 1) {
      pagination1.innerHTML = "-";
      pagination2.innerHTML = "1";
      pagination3.innerHTML = `${newData.length / limit > 1 ? 2 : "-"}`;
    } else if (newData.page > 1) {
      pagination1.innerHTML = `${newData.page - 1}`;
      pagination2.innerHTML = newData.page;
      pagination3.innerHTML = `${
        newData.length / limit > newData.page ? newData.page + 1 : "-"
      }`;
    }
    if (pagination1.innerHTML === "-") {
      pagination1.className = "deactive";
      paginationPrevious.className = "deactive";
    } else {
      pagination1.className = "pagination1";
      paginationPrevious.className = "paginationPrevious";
    }
    if (pagination3.innerHTML === "-") {
      pagination3.className = "deactive";
      paginationNext.className = "deactive";
    } else {
      pagination3.className = "pagination3";
      paginationNext.className = "paginationNext";
    }

    newData.article.forEach((element) => {
      createNews(element);
    });
  }
}
function createNews(news) {
  const containerNews = document.createElement("div");
  main.appendChild(containerNews);
  containerNews.classList.add("containerNews");

  const containerTitle = document.createElement("div");
  containerNews.appendChild(containerTitle);
  containerTitle.classList.add("containerTitle");
  const title = document.createElement("a");
  containerTitle.appendChild(title);
  title.innerHTML = news.title.title;
  title.href = news.location.uri;
  title.classList.add("title");

  const containerSummery = document.createElement("div");
  containerNews.appendChild(containerSummery);
  containerSummery.classList.add("containerSummery");
  const summery = document.createElement("p");
  containerSummery.appendChild(summery);
  summery.innerHTML = news.summary.excerpt;
  summery.classList.add("summery");

  const containerEditorial = document.createElement("div");
  containerNews.appendChild(containerEditorial);
  containerEditorial.classList.add("containerEditorial");
  const subheading = document.createElement("a");
  containerEditorial.appendChild(subheading);
  subheading.innerHTML = news.editorial.subheading;
  subheading.href = news.location.uri;
  subheading.classList.add("subheading");

  const containerByline = document.createElement("div");
  containerNews.appendChild(containerByline);
  containerByline.classList.add("containerByline");
  const byline = document.createElement("p");
  containerByline.appendChild(byline);
  if (news.editorial.byline) {
    byline.innerHTML = news.editorial.byline;
    byline.classList.add("byline");
  } else {
    byline.innerHTML = null;
    byline.classList.add("byline");
  }

  const containerDate = document.createElement("div");
  containerByline.appendChild(containerDate);
  containerDate.classList.add("containerDate");
  const dateT = document.createElement("p");
  const timeD = document.createElement("p");
  containerDate.appendChild(dateT).className = "date";
  containerDate.appendChild(timeD).className = "date";
  if (news.lifecycle.initialPublishDateTime) {
    var date = news.lifecycle.initialPublishDateTime.split("T")[0];
    var time = news.lifecycle.initialPublishDateTime
      .split("T")[1]
      .split(".")[0]
      .split(":")
      .slice(0, 2)
      .join(":");
  }
  dateT.innerHTML = date;
  timeD.innerHTML = time;
}

function fetchOne({ page, limit }) {
  fetch(`https://ft-server-meisam.herokuapp.com/api?page=${page}&limit=${limit}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => setupPage(limit, data))
    .catch((error) => console.log(error));
}

const searchNews = (page, limit) => {
  const searchInput = document.getElementById("search-input").value;
  const key = searchInput;
  fetch(
    `https://ft-server-meisam.herokuapp.com/search/?key=${key.trim()}&page=${page}&limit=${limit}`
  )
    .then((res) => res.json())
    .then((data) => setupPage(limit, data))
    .catch((error) => console.log(error));
};

function setup() {
  var limit = 5;
  var page = 1;
  const searchButton = document.getElementById("search-button");
  const itemsPerPage = document.getElementById("itemsPerPage");
  const pageNumberItems = document.getElementById("pageNumberItems");
  const item_1 = document.getElementById("item-1");
  const item_2 = document.getElementById("item-2");
  const item_3 = document.getElementById("item-3");
  const main = document.getElementById("main");
  searchButton.addEventListener("click", (event) => {
    searchNews(1, limit);
    event.preventDefault();
  });
  itemsPerPage.addEventListener("click", (event) => {
    event.preventDefault();
    pageNumberItems.style.display = "block";
  });
  item_1.addEventListener("click", (event) => {
    event.preventDefault();
    itemsPerPage.innerHTML = event.target.innerHTML;
    pageNumberItems.style.display = "none";
    limit = 5;
    page = 1;
    searchNews(page, limit);
  });
  item_2.addEventListener("click", (event) => {
    event.preventDefault();
    itemsPerPage.innerHTML = event.target.innerHTML;
    pageNumberItems.style.display = "none";
    limit = 10;
    page = 1;
    searchNews(page, limit);
  });
  item_3.addEventListener("click", (event) => {
    event.preventDefault();
    itemsPerPage.innerHTML = event.target.innerHTML;
    pageNumberItems.style.display = "none";
    limit = 20;
    page = 1;
    searchNews(page, limit);
  });

  const paginationPrevious = document.getElementById("paginationPrevious");
  paginationPrevious.addEventListener("click", (event) => {
    if (pagination1.innerHTML !== "-") {
      page--;
      searchNews(page, limit);
    }
    event.preventDefault();
  });
  const pagination1 = document.getElementById("pagination1");
  pagination1.addEventListener("click", (event) => {
    if (event.target.innerHTML !== "-") {
      page = event.target.innerHTML;
      searchNews(page, limit);
    }
    event.preventDefault();
  });
  const pagination2 = document.getElementById("pagination2");
  pagination2.addEventListener("click", (event) => {
    event.preventDefault();
  });
  const pagination3 = document.getElementById("pagination3");
  pagination3.addEventListener("click", (event) => {
    if (event.target.innerHTML !== "-") {
      page = event.target.innerHTML;
      searchNews(page, limit);
    }
    event.preventDefault();
  });
  const paginationNext = document.getElementById("paginationNext");
  paginationNext.addEventListener("click", (event) => {
    if (pagination3.innerHTML !== "-") {
      page++;
      searchNews(page, limit);
    }
    event.preventDefault();
  });
  fetchOne({ page, limit });
}
window.onload = setup;
