document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.stats-filters span');

    const elements = {
        goals: { bar: document.getElementById('bar-goals'), val: document.getElementById('val-goals') },
        assists: { bar: document.getElementById('bar-assists'), val: document.getElementById('val-assists') },
        matches: { bar: document.getElementById('bar-matches'), val: document.getElementById('val-matches') },
        titles: { bar: document.getElementById('bar-titles'), val: document.getElementById('val-titles') },
        awards: { bar: document.getElementById('bar-awards'), val: document.getElementById('val-awards') }
    };

    // Updated maximums to match the official 914 career-goal record
    const maxStats = { goals: 914, assists: 416, matches: 1152, titles: 48, awards: 57 };
    let liveStatsData = {};

    // --- LIVE STATS LOGIC ---
    async function fetchStats() {
        try {
            // Cache-buster (?v=1) forces the browser to fetch the freshest data
            const response = await fetch('stats.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error('Stats not found');
            liveStatsData = await response.json();
            updateStats('total'); // Load TOTAL by default
        } catch (error) {
            console.error('Error loading live stats:', error);
        }
    }

    function updateStats(teamKey) {
        if (!liveStatsData[teamKey]) return;
        
        // Update the massive background text
        document.getElementById('bg-watermark').innerText = teamKey;
        
        const data = liveStatsData[teamKey];
        // ... rest of the existing code ...

        // Update main bars with an eased width transition and an animated count-up
        Object.keys(elements).forEach((stat) => {
            const percentage = Math.max((data[stat] / maxStats[stat]) * 100, 10);
            elements[stat].bar.style.width = percentage + '%';
            if (window.countUpValue) {
                window.countUpValue(elements[stat].val, data[stat], 800);
            } else {
                elements[stat].val.innerText = data[stat];
            }
        });

        // Update exact Sub-Stats and Ratios to match official layout
        if (data.hattricks !== undefined) {
            document.getElementById('val-repokers').innerText = `${data.repokers} REPOKER`;
            document.getElementById('val-pokers').innerText = `${data.pokers} POKER`;
            document.getElementById('val-hattricks').innerText = `${data.hattricks} HAT-TRICK`;
            document.getElementById('val-braces').innerText = `${data.braces} BRACES`;

            document.getElementById('ratio-goals').innerText = `RATIO ${data.goal_ratio}`;
            document.getElementById('ratio-assists').innerText = `RATIO ${data.assist_ratio}`;
        }
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            tabs.forEach((t) => t.classList.remove('active'));
            e.target.classList.add('active');
            updateStats(e.target.getAttribute('data-team'));
        });
    });

    // --- LIVE MATCH CENTER LOGIC ---
    const matchFieldIds = [
        'match-home-name', 'match-home-logo', 'match-away-name', 'match-away-logo',
        'match-date', 'match-time', 'match-league'
    ];

    async function fetchNextMatch() {
        try {
            // Cache-buster added here too, to prevent a stale "LOADING..." freeze
            const response = await fetch('matches.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error('Match data not found');
            const matchData = await response.json();

            document.getElementById('match-home-name').innerText = matchData.home_team;
            document.getElementById('match-home-logo').src = matchData.home_logo;

            document.getElementById('match-away-name').innerText = matchData.away_team;
            document.getElementById('match-away-logo').src = matchData.away_logo;

            document.getElementById('match-date').innerText = matchData.date;
            document.getElementById('match-time').innerText = matchData.time;
            document.getElementById('match-league').innerText = matchData.league;

            // Swap the shimmering skeleton state out for a soft fade-in
            matchFieldIds.forEach((id) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.classList.remove('skeleton');
                el.classList.add('match-fade-in');
            });
        } catch (error) {
            console.error('Error loading match data:', error);
            const dateEl = document.getElementById('match-date');
            dateEl.classList.remove('skeleton');
            dateEl.innerText = 'SCHEDULE UNAVAILABLE';
        }
    }

    // --- INITIALIZE EVERYTHING ---
    fetchStats();
    fetchNextMatch();
});
