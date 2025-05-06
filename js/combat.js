// ✅ Setup radio buttons & selectedStyle tracker
let selectedStyle = null;
document.querySelectorAll('input[name="combatStyle"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    selectedStyle = e.target.value;
    log([STYLE] Selected ${selectedStyle});
  });
});

// ✅ PLAYER DATA added
let playerData = JSON.parse(localStorage.getItem('playerData')) || {
  skills: {
    Attack: { level: 1, xp: 0, xpToNext: 100 },
    Strength: { level: 1, xp: 0, xpToNext: 100 },
    Defense: { level: 1, xp: 0, xpToNext: 100 },
    Magic: { level: 1, xp: 0, xpToNext: 100 },
    Ranged: { level: 1, xp: 0, xpToNext: 100 }
  },
  bankInventory: {},
  playerEquipment: {}
};

let lastSaveTimestamp = parseInt(localStorage.getItem("lastSave")) || Date.now();
let enemy = null;
let enemyHP = 0;
let playerHP = 100;
let isBattling = false;
let battleInterval;
let justRespawned = false;

function getParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function log(msg) {
  const box = document.getElementById("combat-log");
  box.innerHTML += msg + "<br>";
  box.scrollTop = box.scrollHeight;
}

function floatText(target, text, type) {
  const el = document.createElement("div");
  el.className = damage ${type};
  el.innerText = text;
  target.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function triggerLevelUpMessage(skill, level) {
  const msg = document.getElementById("level-up-popup");
  msg.innerText = You are now level ${level} in ${skill.replace('_', ' ')}!;
  msg.style.animation = 'none';
  msg.offsetHeight;
  msg.style.animation = null;
}

function updateSaveTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - lastSaveTimestamp) / 1000);
  document.getElementById("last-save-time").innerText = Time since last save: ${elapsed}s;
}

function saveProgress(showAlert = false) {
  localStorage.setItem('playerData', JSON.stringify(playerData));
  localStorage.setItem("lastSave", Date.now());
  if (showAlert) {
    alert("Progress saved to the cloud!");
  }
}

function initCombat() {
  const enemyKey = getParam("enemy");
  if (!enemyKey || !enemies[enemyKey]) {
    log([ERROR] Enemy data not found for key: ${enemyKey});
    return;
  }
  enemy = enemies[enemyKey];
  enemyHP = enemy.hp;
  document.getElementById("enemy-name").innerText = enemy.name;

  const imgElement = document.getElementById("enemy-image");
  imgElement.src = enemy.image;

  imgElement.onerror = () => {
    if (!imgElement.dataset.fallbackUsed) {
      console.warn([Image Missing] Could not load ${enemy.image}, using fallback.);
      imgElement.dataset.fallbackUsed = "true";
      imgElement.src = 'assets/monsters/default_enemy.png';
    }
  };

  document.getElementById("enemy-hp").innerText = enemyHP;
  document.getElementById("player-hp").innerText = playerHP;
  log([ENEMY] Encountered ${enemy.name} with ${enemy.hp} HP.);
}

function updateSkillTracker() {
  const container = document.getElementById('combat-skill-tracker');
  container.innerHTML = '';
  for (const skill in playerData.skills) {
    const level = playerData.skills[skill].level;
    const xp = playerData.skills[skill].xp;
    const xpToNext = playerData.skills[skill].xpToNext;
    const percent = Math.min(100, Math.floor((xp / xpToNext) * 100));
    const li = document.createElement('li');
    li.innerHTML = <a href='skill${skill}.html' style='color:#00ff99;text-decoration:none;'>
      <img src='assets/skills/${skill.toLowerCase()}.png' width='18' style='vertical-align:middle;margin-right:4px;'>
      ${skill} — Lv. ${level} (${percent}%)</a>;
    container.appendChild(li);
  }
}

function startBattle() {
  const selected = document.querySelector('input[name="combatStyle"]:checked');
  if (!selected) {
    alert("⚠️ Please choose a combat style before starting the battle!");
    return;
  }

  if (isBattling) return;
  isBattling = true;

  battleInterval = setInterval(() => {
    const selectedMidBattle = document.querySelector('input[name="combatStyle"]:checked');

    if (!selectedMidBattle) {
      log('⚠️ Battle paused: No combat style selected.');
      stopBattle();
      alert("⚠️ Please choose a combat style to continue battling!");
      return;
    }

    if (justRespawned) {
      justRespawned = false;
      return;
    }

    if (playerHP <= 0) {
      log('[DEFEAT] You died. Redirecting...');
      stopBattle();
      setTimeout(() => window.location.href = 'home.html', 2000);
    } else if (enemyHP <= 0) {
      log([VICTORY] ${enemy.name} defeated.);
      const xpAmount = enemy.xp || 10;
      addXP(selectedMidBattle.value, xpAmount);
      updateSkillTracker();

      // FULL reset of monster after respawn
      const freshEnemy = enemies[getParam("enemy")];
      enemy = { ...freshEnemy };
      enemyHP = freshEnemy.hp;
      document.getElementById("enemy-hp").innerText = enemyHP;
      document.getElementById("enemy-name").innerText = enemy.name;
      document.getElementById("enemy-image").src = enemy.image;

      log(🔄 ${enemy.name} respawned!);
      justRespawned = true;
    } else {
      const dmgToEnemy = Math.floor(Math.random() * 10 + 5);
      const hitChance = Math.random();
      let dmgToPlayer = 0;
      if (hitChance < (enemy.accuracy || 0.5)) {
        dmgToPlayer = Math.floor(Math.random() * (enemy.maxHit || 5));
      }
      enemyHP -= dmgToEnemy;
      playerHP -= dmgToPlayer;
      document.getElementById("enemy-hp").innerText = Math.max(enemyHP, 0);
      document.getElementById("player-hp").innerText = Math.max(playerHP, 0);
      floatText(document.getElementById("enemy-box"), -${dmgToEnemy}, "enemy");
      if (dmgToPlayer > 0) {
        floatText(document.getElementById("player-box"), -${dmgToPlayer}, "player");
      }
    }
  }, (enemy.attackSpeed || 1) * 600);
}

function stopBattle() {
  clearInterval(battleInterval);
  isBattling = false;
}

function addXP(style, amount) {
  const skillName = mapSkillName(style);
  if (playerData.skills[skillName]) {
    playerData.skills[skillName].xp += amount;
    if (playerData.skills[skillName].xp >= playerData.skills[skillName].xpToNext) {
      playerData.skills[skillName].level++;
      playerData.skills[skillName].xp -= playerData.skills[skillName].xpToNext;
      playerData.skills[skillName].xpToNext = Math.floor(playerData.skills[skillName].xpToNext * 1.25);
      triggerLevelUpMessage(skillName, playerData.skills[skillName].level);
    }
    saveProgress();
    updateSkillTracker();
  }
}

function mapSkillName(style) {
  if (style === 'attack') return 'Attack';
  if (style === 'strength') return 'Strength';
  if (style === 'defense') return 'Defense';
  if (style === 'magic' || style === 'magic_defense') return 'Magic';
  if (style === 'ranged' || style === 'ranged_defense') return 'Ranged';
  return 'Attack';
}

// ✅ Re-added: heal function
function eatFood() {
  const healAmount = 5;
  if (playerHP < 100) {
    playerHP += healAmount;
    if (playerHP > 100) playerHP = 100;
    document.getElementById("player-hp").innerText = playerHP;
    log(🍞 You ate food and healed ${healAmount} HP.);
  } else {
    log(❌ Your HP is already full.);
  }
}

window.onload = () => {
  initCombat();
  updateSkillTracker();
  setInterval(updateSaveTimer, 1000);
};
