import React from 'react';

function PlayerProfile({ player }) {
  return (
    <div>
      <h2>{player.name}</h2>
      <p>Age: {player.age}</p>
      <p>School: {player.schoolName}</p> {/* Render player's school name */}
    </div>
  );
}

export default PlayerProfile;
