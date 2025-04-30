// skills.js

const skillList = {
  // Combat Skills
  attack: {
    name: "Striker Protocol",
    icon: "attack.png",
    type: "combat"
  },
  strength: {
    name: "Force Module",
    icon: "strength.png",
    type: "combat"
  },
  defense: {
    name: "Barrier Matrix",
    icon: "defense.png",
    type: "combat"
  },
  magic: {
    name: "Neurohex",
    icon: "magic.png",
    type: "combat"
  },
  ranged: {
    name: "Synapsis Bowline",
    icon: "ranged.png",
    type: "combat"
  },

  // Non-Combat Skills
  slayer: {
    name: "Slayer",
    icon: "slayer.png",
    type: "noncombat"
  },
  cryptomining: {
    name: "Cryptomining",
    icon: "cryptomining.png",
    type: "noncombat"
  },
  datafishing: {
    name: "Datafishing",
    icon: "datafishing.png",
    type: "noncombat"
  },
  codecraft: {
    name: "Codecraft",
    icon: "codecraft.png",
    type: "noncombat"
  },
  forgenetics: {
    name: "Forgentics",
    icon: "forgenetics.png",
    type: "noncombat"
  },
  system_hacking: {
    name: "System Hacking",
    icon: "system_hacking.png",
    type: "noncombat"
  }
};

function getXPForLevel(level) {
  let xp = 0;
  for (let i = 1; i < level; i++) {
    xp += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  return Math.floor(xp / 4);
}

const xpTable = Array(100).fill(0).map((_, level) => getXPForLevel(level));

function renderSkillUI(skillData, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (const skill in skillList) {
    const data = skillData[skill] || { level: 1, xp: 0 };
    const level = data.level;
    const xp = data.xp;
    const nextXP = xpTable[level + 1] || xpTable[99];
    const percent = Math.min(100, Math.floor((xp / nextXP) * 100));
    const skillInfo = skillList[skill];

    const li = document.createElement('li');
    li.innerHTML = `<a href='skill${skill}.html' style='color:#00ff99;text-decoration:none;'>
      <div class='skill-row'>
        <div class='icon-box'><img src='assets/skills/${skillInfo.icon}' alt='${skill}' width='16'></div>
        <span>${skillInfo.name}</span>
        <span class='level'>Lv. ${level} (${percent}%)</span>
      </div>
    </a>`;

    container.appendChild(li);
  }
}
