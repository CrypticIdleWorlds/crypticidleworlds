let selectedStyle = 'attack';
document.querySelectorAll('input[name="combatStyle"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    selectedStyle = e.target.value;
    log(`[STYLE] Selected ${selectedStyle}`);
  });
});

let lastSaveTimestamp = parseInt(localStorage.getItem("lastSave")) || Date.now();
let enemy = null;
let enemyHP = 0;
let playerHP = 100;
let isBattling = false;

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
  el.className = `damage ${type}`;
  el.innerText = text;
  target.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function triggerLevelUpMessage(skill, level) {
  const msg = document.getElementById("level-up-popup");
  msg.innerText = `You are now level ${level} in ${skill.replace('_', ' ')}!`;
  msg.style.animation = 'none';
  msg.offsetHeight;
  msg.style.animation = null;
}

function updateSaveTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - lastSaveTimestamp) / 1000);
  document.getElementById("last-save-time").innerText = `Time since last save: ${elapsed}s`;
}

function initCombat() {
  const enemyKey = getParam("enemy");
  if (!enemyKey || !enemies[enemyKey]) {
    log(`[ERROR] Enemy data not found for key: ${enemyKey}`);
    return;
  }
  enemy = enemies[enemyKey];
  enemyHP = enemy.hp;
  document.getElementById("enemy-name").innerText = enemy.name;

  const imgElement = document.getElementById("enemy-image");

  // ✅ Auto-fix the path if needed
  if (enemy.image.startsWith('monsters/')) {
      imgElement.src = 'assets/' + enemy.image;  // Patch the path dynamically
  } else {
      imgElement.src = enemy.image;
  }

  // 🛡️ Fallback if image is missing (only triggers once)
  imgElement.onerror = () => {
    if (!imgElement.dataset.fallbackUsed) {
      console.warn(`[Image Missing] Could not load ${enemy.image}, using fallback.`);
      imgElement.dataset.fallbackUsed = "true";
      imgElement.src = 'assets/monsters/default_enemy.png';  // Fallback image location
    }
  };

  document.getElementById("enemy-hp").innerText = enemyHP;
  document.getElementById("player-hp").innerText = playerHP;
  log(`[ENEMY] Encountered ${enemy.name} with ${enemy.hp} HP.`);
}

function updateSkillTracker() {
  const container = document.getElementById('combat-skill-tracker');
  container.innerHTML = '';
  for (const skill in playerSkills) {
    const level = playerSkills[skill].level;
    const xp = playerSkills[skill].xp;
    const nextLevelXP = (window.xpTable || []).find(x => x.level === level + 1)?.xp || xp;
    const percent = Math.min(100, Math.floor((xp / nextLevelXP) * 100));
    const li = document.createElement('li');
    li.innerHTML = `<a href='skill${skill}.html' style='color:#00ff99;text-decoration:none;'>
      <img src='assets/skills/${skill}.png' width='18' style='vertical-align:middle;margin-right:4px;'>
      ${skill.replace('_',' ')} — Lv. ${level} (${percent}%)</a>`;
    container.appendChild(li);
  }
}

function startBattle() {
  if (isBattling) return;
  isBattling = true;

  const loop = setInterval(() => {
    if (enemyHP <= 0 || playerHP <= 0) {
      if (playerHP <= 0) {
        log('[DEFEAT] You died. Redirecting...');
        clearInterval(loop);
        isBattling = false;
        setTimeout(() => window.location.href = 'home.html', 2000);
        return;
      }
      log(`[VICTORY] ${enemy.name} defeated.`);

      const xpAmount = enemy.xp || 10;  // fallback XP if enemy.xp is missing

      // ✅ Add XP using the new global addXP()
      addXP(selectedStyle, xpAmount);

      updateSkillTracker();
      enemyHP = enemy.hp;
      document.getElementById("enemy-hp").innerText = enemyHP;
      isBattling = false;
      startBattle();  // auto-loop
    } else {
      const dmgToEnemy = Math.floor(Math.random() * 10 + 5);
      const hitChance = Math.random();
      let dmgToPlayer = 0;
      if (hitChance < (enemy.accuracy || 0.5)) {  // Default accuracy if missing
        dmgToPlayer = Math.floor(Math.random() * (enemy.maxHit || 5));  // Default maxHit if missing
      }
      enemyHP -= dmgToEnemy;
      playerHP -= dmgToPlayer;
      document.getElementById("enemy-hp").innerText = Math.max(enemyHP, 0);
      document.getElementById("player-hp").innerText = Math.max(playerHP, 0);
      floatText(document.getElementById("enemy-box"), `-${dmgToEnemy}`, "enemy");
      if (dmgToPlayer > 0) {
        floatText(document.getElementById("player-box"), `-${dmgToPlayer}`, "player");
      }
    }
  }, (enemy.attackSpeed || 1) * 600);  // Default attack speed if missing
}

// 🚀 Initialize everything
window.onload = () => {
  initCombat();
  updateSkillTracker();
  setInterval(updateSaveTimer, 1000);
};
