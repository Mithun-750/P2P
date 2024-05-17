var latest_news = [
    {
        image: "https://pbs.twimg.com/media/GIEzFmiW4AAZU62.jpg",
        day: "2D AGO",
        title: "The BAFTA Game Awards 2024 nominations",
        small_caption: "Find out which games are in contention for the prestigious awards",
    },

    {
        image: "https://cdn2.unrealengine.com/palia-ranking-characters-feature-image-3840x2160-a56494b943ef.jpg",
        day: "2D AGO",
        title: "Make friends with the villagers in Palia with our character guide",
        small_caption: "Palia’s characters are more diverse and complex than you may think",
    },

    {
        image: "https://images.squarespace-cdn.com/content/v1/55ef0e29e4b099e22cdc9eea/1704725408494-39Y1F6BZ29HREZMNJT5G/image+%282%29.jpg?format=1500w",
        day: "3D AGO",
        title: "Everything you need to know about Valorant's sniper shotgun, the Outlaw",
        small_caption: "Sniper? Shotgun? Why not both?",
    },

    {
        image: "https://cdn1.epicgames.com/spt-assets/1caf32ecc37545b0ad7a3fb6293fef28/melvor-idle-video-12n72.jpg",
        day: "4D AGO",
        title: "Melvor Idle beginner’s guide",
        small_caption: "Runescape as an idle game? It’s been done, and we’ve got tips on how to get stuck in",
    },

    {
        image: "https://preview.redd.it/avoid-expeditions-a-mudrunner-game-on-ps5-v0-l0b9eqgs6tlc1.jpeg?auto=webp&s=f241ef98a49cbba5e77b50cad682c33b6d0e9163",
        day: "4D AGO",
        title: "SnowRunner is a trucking game where your only enemy is earth",
        small_caption: "Under the hood of SnowRunner and the upcoming Expeditions: A Mudrunner Game",
    },

    {
        image: "https://assetsio.reedpopcdn.com/banishers-ghosts-of-new-eden-review-header.jpg?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp",
        day: "1W AGO",
        title: "Banishers: Ghosts of New Eden: Restless spirits stir in the Massachusetts wilderness",
        small_caption: "Undying love isn’t always a good thing",
    },
    {
        image: "https://editors.dexerto.com/wp-content/uploads/2022/05/04/raid-shadow-legend-1.jpg",
        day: "1W AGO",
        title: "Beginner’s guide to RAID: Shadow Legends",
        small_caption: "We were all beginners at one point",
    },

    {
        image: "https://image.api.playstation.com/vulcan/ap/rnd/202305/2313/63a2ec52c8fcc222915069ab60e7d19c14009616ecfb053d.jpg",
        day: "2W AGO",
        title: "Prince of Persia: The Lost Crown guide: 12 exploration and survival tips",
        small_caption: "Our guide has several tips to help you navigate the mysterious lands of Prince of Persia: The Lost Crown",
    },

    {
        image: "https://minireview.io/common/uploads/cache/review/5--322-8dfb8e715d1efd2dc9b62d1cf1dfdef3.webp",
        day: "2W AGO",
        title: "Poosh XL is a one-button game with remarkable depth",
        small_caption: "A super-slick, very tough vertically scrolling arcade game",
    },
    {
        image: "https://cdn2.unrealengine.com/bloodlines-2-1-1920x1080-d4010e9cec60.jpg",
        day: "3W AGO",
        title: "Everything we know about Vampire: The Masquerade—Bloodlines 2",
        small_caption: "Vampire bikers and snobbish undead aristocrats—here’s what to expect when we return to the World of Darkness",
    },
];

function addNewsToLatest(newsItems, targetDivs) {
    // Iterate over each news item and target div
    newsItems.forEach(function (newsItem, index) {
        // Get the target div for this news item
        var targetDiv = targetDivs[index];

        // Create elements for the news item
        var newsElement = document.createElement('div');
        newsElement.classList.add('latest-item');

        // Create separate div elements for image and matter
        var imageDiv = document.createElement('div');
        var matterDiv = document.createElement('div');

        // Add classes to the image and matter divs
        imageDiv.classList.add('news-image');
        matterDiv.classList.add('news-matter');

        // Add HTML content for the image and matter
        imageDiv.innerHTML = `<a href="news_more.html"><img src="${newsItem.image}" alt="News Image"></a>`;
        matterDiv.innerHTML = `
                <p class="date">${newsItem.day}</p>
                <h3><a href="news_more.html">${newsItem.title}</a></h3>
                <p class="caption">${newsItem.small_caption}</p>
                <a href="news_more.html">Read more</a>
            `;

        // Append the image and matter divs to the news item
        newsElement.appendChild(imageDiv);
        newsElement.appendChild(matterDiv);

        // Append the news item to the target div
        targetDiv.appendChild(newsElement);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Get all the divs with class "latest"
    var latestDivs = document.querySelectorAll('.latest');

    // Call the addNewsToLatest function with the news items and target divs
    addNewsToLatest(latest_news, latestDivs);
});
