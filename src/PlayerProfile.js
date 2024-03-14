import React from 'react';

function PlayerProfile({ player }) {
  return (
    <div>
      <h2>{player.name}</h2>
      <p>Age: {player.age}</p>
      <p>School: {player.school}</p>
    </div>
  );
}

export default PlayerProfile;
