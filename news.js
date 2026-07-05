document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');

    async function loadNews() {
        try {
            const response = await fetch('news.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error('News file not found');
            const newsData = await response.json();

            newsContainer.innerHTML = '';

            if (newsData.length === 0) {
                newsContainer.innerHTML = '<p style="color:white;">No recent news found.</p>';
                return;
            }

            newsData.forEach((item, index) => {
                const article = document.createElement('article');
                article.className = 'news-card reveal-hidden';
                article.style.transitionDelay = `${Math.min(index * 0.07, 0.6)}s`;

                const date = new Date(item.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                article.innerHTML = `
                    <div class="news-content">
                        <span class="news-meta">${date}</span>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
                    </div>
                `;
                newsContainer.appendChild(article);
            });

            // Double rAF: let the browser paint the hidden state first, then
            // remove it so the transition actually animates instead of jumping.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    newsContainer.querySelectorAll('.news-card.reveal-hidden').forEach((card) => {
                        card.classList.remove('reveal-hidden');
                    });
                });
            });
        } catch (error) {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p style="color:white; text-align:center;">Updates are currently syncing. Please check back later.</p>';
        }
    }

    loadNews();
});
