import React, { useState } from 'react';
import './NewDashboard_AchievementsPage.css'; // CSS for this page

const BadgeCard = ({ icon, title, description, rarity, earnedDate, points, progress, required, isEarned, cardColor }) => {
    const progressPercent = isEarned ? 100 : (progress / required) * 100;
    return (
        <div className={`badge-card ${isEarned ? 'earned' : 'in-progress'}`} style={{'--card-accent-color': cardColor}}>
            <div className="badge-rarity-tag">{rarity}</div>
            <div className="badge-icon">{icon}</div>
            <h3 className="badge-title">{title}</h3>
            <p className="badge-description">{description}</p>
            {isEarned ? (
                <>
                    <p className="badge-earned-date">✔️ Earned {earnedDate}</p>
                    <p className="badge-points-earned">+{points} points</p>
                </>
            ) : (
                <>
                    <div className="badge-progress-bar-container">
                        <div className="badge-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="badge-progress-text">{progress}/{required} complete</p>
                    <p className="badge-points-potential">Earn {points} points</p>
                </>
            )}
        </div>
    );
};

const FilterButton = ({ label, icon, isActive, onClick }) => (
    <button className={`achievements-filter-button ${isActive ? 'active' : ''}`} onClick={onClick}>
        {icon && <span className="filter-icon">{icon}</span>} {label}
    </button>
);


const NewDashboard_AchievementsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All Badges');
  const filters = ['All Badges', 'Learning', 'Friends', 'Creative', 'Special'];

  // Dummy badge data - in a real app, this would come from state/API
  const badges = [
    { id: 1, icon: '👶', title: 'First Steps', description: 'Complete your very first activity', rarity: 'COMMON', earnedDate: '2 weeks ago', points: 20, isEarned: true, category: 'Learning', cardColor: '#a7f3d0' },
    { id: 2, icon: '🧩', title: 'Puzzle Master', description: 'Solve 10 amazing puzzles', rarity: 'RARE', earnedDate: '1 week ago', points: 30, isEarned: true, category: 'Learning', cardColor: '#bfdbfe' },
    { id: 3, icon: '🔥', title: 'Super Streak', description: 'Learn for 7 days in a row', rarity: 'EPIC', earnedDate: 'Yesterday', points: 50, isEarned: true, category: 'Learning', cardColor: '#fecaca' },
    { id: 4, icon: '🧑‍🤝‍🧑', title: 'Social Star', description: 'Made 5 new friends', rarity: 'COMMON', earnedDate: '3 days ago', points: 25, isEarned: true, category: 'Friends', cardColor: '#fbcfe8' },
    { id: 5, icon: '🎨', title: 'Creative Genius', description: '15 creative tasks', rarity: 'EPIC', progress: 8, required: 15, points: 60, isEarned: false, category: 'Creative', cardColor: '#fed7aa' },
    { id: 6, icon: '🤝', title: 'Helper Hero', description: 'Help 3 friends with activities', rarity: 'RARE', progress: 1, required: 3, points: 35, isEarned: false, category: 'Friends', cardColor: '#d1fae5' },
    { id: 7, icon: '🌟', title: 'Kindness Star', description: 'Show kindness in 20 activities', rarity: 'EPIC', progress: 12, required: 20, points: 60, isEarned: false, category: 'Special', cardColor: '#e0e7ff'},
    { id: 8, icon: '🚀', title: 'Ultimate Explorer', description: 'Try every type of activity', rarity: 'LEGENDARY', progress: 3, required: 6, points: 100, isEarned: false, category: 'Special', cardColor: '#fef08a'}
  ];

  const filteredBadges = activeFilter === 'All Badges'
    ? badges
    : badges.filter(badge => badge.category === activeFilter);


  return (
    <div className="new-dashboard-page new-dashboard-achievements-page">
      <header className="new-dashboard-page-header">
        <span className="new-dashboard-header-icon achievements-header-icon">🏆</span>
        <div>
          <h1 className="new-dashboard-page-title">My Super Badges!</h1>
          <p className="new-dashboard-page-subtitle">Look at all the amazing things you've achieved!</p>
        </div>
      </header>

      <section className="achievements-summary-banner">
        <h2>✨ Badge Collection</h2>
        <div className="summary-stats">
          <div><span>4</span> Badges Earned</div>
          <div className="summary-icon">🏆</div>
          <div><span>105</span> Total Points</div>
        </div>
      </section>

      <nav className="achievements-filter-nav">
        {filters.map(filter => (
            <FilterButton
                key={filter}
                label={filter}
                isActive={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
            />
        ))}
      </nav>

      <section className="badges-grid-container">
        {filteredBadges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
      </section>

      <section className="achievements-footer-message">
        <h2>💖 You're Amazing!</h2>
        <p>Every badge you earn shows how smart and capable you are!</p>
        <button className="earn-more-badges-button">
            <span role="img" aria-label="rocket icon">🚀</span> Earn More Badges!
        </button>
      </section>

      <section className="next-challenge-section">
        <h3 className="next-challenge-title">🎯 Next Challenge</h3>
        <div className="next-challenge-card">
            <div className="next-challenge-icon">🎨</div>
            <div className="next-challenge-details">
                <h4>Creative Genius</h4>
                <p>Complete 7 more creative activities!</p>
                <div className="next-challenge-progress-bar-container">
                    <div className="next-challenge-progress-bar-fill" style={{width: `${(8/15)*100}%`}}></div>
                </div>
                <p className="next-challenge-progress-text">8 of 15 complete</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default NewDashboard_AchievementsPage;