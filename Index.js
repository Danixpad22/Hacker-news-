document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('newsList');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  let newsIds = [];
  let currentIndex = 0;

  const fetchNewsIds = async () => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
      const data = await response.json();
      newsIds = data;
      loadNewsDetails(newsIds.slice(0, 10));
    } catch (error) {
      console.error('Error fetching news IDs:', error);
    }
  };

  const fetchNewsDetails = async (id) => {
    try {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching news details:', error);
    }
  };

  const loadNewsDetails = async (ids) => {
    const newsDetailsPromises = ids.map(id => fetchNewsDetails(id));
    const newsDetails = await Promise.all(newsDetailsPromises);

    newsDetails.forEach(news => {
      const listItem = document.createElement('li');

      const link = document.createElement('a');
      link.href = news.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = news.title;

      const date = document.createElement('p');
      const dateObj = new Date(news.time * 1000);
      date.textContent = dateObj.toLocaleString();

      listItem.appendChild(link);
      listItem.appendChild(date);
      newsList.appendChild(listItem);
    });

    currentIndex += 10;
  };

  loadMoreBtn.addEventListener('click', () => {
    const nextIds = newsIds.slice(currentIndex, currentIndex + 10);
    loadNewsDetails(nextIds);
  });

  fetchNewsIds();
});
