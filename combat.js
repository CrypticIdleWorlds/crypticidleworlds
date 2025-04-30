// scripts/combat.js

const xpTable = Array(100).fill(0).map((_, level) => {
  let xp = 0;
  for (let i = 1; i < level; i++) xp += Math.floor(i + 300 * Math.pow(2, i / 7));
  return Math.floor(xp / 4);
});

let skillData = JSON.parse(localStorage.getItem("skillData")) || {
  attack: { xp: 0, level: 1 },
  strength: { xp: 0, level: 1 },
  defense: { xp: 0, level: 1 },
  magic: { xp: 0, level: 1 },
  ranged: { xp: 0, level: 1 }
};

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

function updateCombatLevelDisplay() {
  const cbLevel = calcCombatLevel();
  document.getElementById("combat-level").innerText = cbLevel;
}

function calcCombatLevel() {
  const atk = skillData.attack.level;
  const str = skillData.strength.level;
  const def = skillData.defense.level;
  const mag = skillData.magic.level;
  const rng = skillData.ranged.level;
  return Math.floor(((def + Math.max(str, rng, mag) + atk) / 3));
}

function initCombat() {
  const enemyKey = getParam("enemy");
  const enemies = JSON.parse(localStorage.getItem("enemyData")) || {};
  if (!enemyKey || !enemies[enemyKey]) return;
  enemy = enemies[enemyKey];
  enemyHP = enemy.hp;
  document.getElementById("enemy-name").innerText = enemy.name;
  document.getElementById("enemy-image").src = enemy.image;
  document.getElementById("enemy-hp").innerText = enemyHP;
  document.getElementById("player-hp").innerText = playerHP;
  log(`[ENEMY] Encountered ${enemy.name} with ${enemy.hp} HP.`);
  updateCombatLevelDisplay();
}

function grantXP(style, xp) {
  if (style.includes('_')) {
    const split = style.split('_');
    split.forEach(s => {
      skillData[s].xp += Math.floor(xp / split.length);
      log(`[XP] +${Math.floor(xp / split.length)} ${s} XP`);
      checkLevelUp(s);
    });
  } else {
    skillData[style].xp += xp;
    log(`[XP] +${xp} ${style} XP`);
    checkLevelUp(style);
  }
  updateCombatLevelDisplay();
}

function checkLevelUp(skill) {
  for (let lvl = 1; lvl <= 99; lvl++) {
    if (skillData[skill].xp >= xpTable[lvl] && skillData[skill].level < lvl) {
      skillData[skill].level = lvl;
      log(`[LEVEL UP] ${skill} is now Lv. ${lvl}!`);
      triggerLevelUpMessage(skill, lvl);
    }
  }
  localStorage.setItem("skillData", JSON.stringify(skillData));
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
      grantXP(selectedStyle, enemy.xp);
      enemyHP = enemy.hp;
      document.getElementById("enemy-hp").innerText = enemyHP;
      isBattling = false;
      startBattle();
    } else {
      const dmgToEnemy = Math.floor(Math.random() * 10 + 5);
      const dmgToPlayer = Math.floor(Math.random() * 5);
      enemyHP -= dmgToEnemy;
      playerHP -= dmgToPlayer;
      document.getElementById("enemy-hp").innerText = Math.max(enemyHP, 0);
      document.getElementById("player-hp").innerText = Math.max(playerHP, 0);
      floatText(document.getElementById("enemy-box"), `-${dmgToEnemy}`, "enemy");
      floatText(document.getElementById("player-box"), `-${dmgToPlayer}`, "player");
    }
  }, 1000);
}

function eatFood() {
  if (playerHP < 100) {
    playerHP = Math.min(100, playerHP + 5);
    document.getElementById("player-hp").innerText = playerHP;
    log("[FOOD] Ate bread. Healed 5 HP.");
  } else {
    log("[FOOD] HP is already full.");
  }
}

function saveProgress() {
  localStorage.setItem("skillData", JSON.stringify(skillData));
  localStorage.setItem("lastSave", Date.now());
  lastSaveTimestamp = Date.now();
  log("[SAVE] Progress saved.");
}

function updateSaveTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - lastSaveTimestamp) / 1000);
  document.getElementById("last-save-time").innerText = `Time since last save: ${elapsed}s`;
}

function updateSkillTracker() {
  const container = document.getElementById('combat-skill-tracker');
  container.innerHTML = '';
  for (const skill in skillData) {
    const level = skillData[skill].level;
    const xp = skillData[skill].xp;
    const nextXP = xpTable[level + 1] || xpTable[99];
    const percent = Math.min(100, Math.floor((xp / nextXP) * 100));
    const li = document.createElement('li');
    li.innerHTML = `<a href='skill${skill}.html' style='color:#00ff99;text-decoration:none;'>
      <img src='assets/skills/${skill}.png' width='18' style='vertical-align:middle;margin-right:4px;'>
      ${skill.replace('_',' ')} — Lv. ${level} (${percent}%)</a>`;
    container.appendChild(li);
  }
}

window.onload = () => {
  initCombat();
  updateSkillTracker();
  setInterval(updateSaveTimer, 1000);
};
