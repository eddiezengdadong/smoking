const STORAGE_KEY = "quit-smoking-v1";

const defaultState = {
  startTime: new Date().toISOString(),
  dailyCount: 20,
  packPrice: 25,
  checkins: []
};

const encouragements = [
  "先把今天过好，就是很认真地赢了一次。",
  "烟瘾会过去，但你刚刚守住的这几分钟会留下来。",
  "不用和一辈子较劲，只要处理好这一刻。",
  "今天的你，已经比昨天多了一点自由。",
  "想抽烟不是失败，抽不抽才是你的选择。"
];

const urgeTips = [
  {
    title: "先撑过 3 分钟",
    body: "站起来喝一杯水，把注意力放到喉咙和呼吸上。烟瘾通常会像浪一样过去。"
  },
  {
    title: "换一个地点",
    body: "离开现在的位置，去窗边、楼下或洗手间。身体换了场景，大脑也更容易换频道。"
  },
  {
    title: "给手找点事",
    body: "捏纸巾、转笔、洗杯子，或者把手机握紧 30 秒。先替代掉那个伸手拿烟的动作。"
  },
  {
    title: "写下这个念头",
    body: "用一句话写：我现在想抽烟，是因为____。写出来以后，它就没那么像命令了。"
  },
  {
    title: "做 6 次慢呼吸",
    body: "吸气 4 秒，停 1 秒，呼气 6 秒。重复 6 次，让身体先从紧张里下来。"
  }
];

const milestones = [
  { days: 1, label: "24 小时" },
  { days: 3, label: "3 天" },
  { days: 7, label: "1 周" },
  { days: 30, label: "1 个月" },
  { days: 100, label: "100 天" }
];

const $ = (selector) => document.querySelector(selector);

const els = {
  timeSober: $("#time-sober"),
  moneySaved: $("#money-saved"),
  cigsAvoided: $("#cigs-avoided"),
  streakDays: $("#streak-days"),
  startTime: $("#start-time"),
  dailyCount: $("#daily-count"),
  packPrice: $("#pack-price"),
  saveSettings: $("#save-settings"),
  resetDemo: $("#reset-demo"),
  checkinButton: $("#checkin-button"),
  checkinState: $("#checkin-state"),
  encouragement: $("#encouragement"),
  newTip: $("#new-tip"),
  tipTitle: $("#urge-tip-title"),
  tipBody: $("#urge-tip-body"),
  milestones: $("#milestones")
};

let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState, ...stored };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDatetimeLocal(value) {
  const date = new Date(value);
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function elapsedParts() {
  const start = new Date(state.startTime).getTime();
  const diffMs = Math.max(0, Date.now() - start);
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes, diffMs };
}

function calculateStreak() {
  const checkins = new Set(state.checkins);
  let streak = 0;
  const cursor = new Date();

  while (checkins.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function renderMilestones(days) {
  els.milestones.innerHTML = milestones
    .map((item) => {
      const unlocked = days >= item.days;
      return `
        <article class="milestone ${unlocked ? "unlocked" : ""}">
          <strong>${unlocked ? "已达成" : "未达成"}</strong>
          <span>${item.label}</span>
        </article>
      `;
    })
    .join("");
}

function updateDashboard() {
  const { days, hours, minutes, diffMs } = elapsedParts();
  const elapsedDays = diffMs / 86400000;
  const avoided = Math.floor(elapsedDays * Number(state.dailyCount || 0));
  const money = avoided * (Number(state.packPrice || 0) / 20);
  const today = localDateKey();
  const checkedIn = state.checkins.includes(today);

  els.timeSober.textContent = `${days} 天 ${hours} 小时 ${minutes} 分钟`;
  els.moneySaved.textContent = `¥${money.toFixed(2)}`;
  els.cigsAvoided.textContent = `${avoided} 根`;
  els.streakDays.textContent = `${calculateStreak()} 天`;

  els.checkinState.textContent = checkedIn ? "已打卡" : "未打卡";
  els.checkinState.classList.toggle("done", checkedIn);
  els.checkinButton.textContent = checkedIn ? "今天已完成" : "今天没有抽烟";
  els.checkinButton.classList.toggle("done", checkedIn);

  renderMilestones(days);
}

function fillForm() {
  els.startTime.value = toDatetimeLocal(state.startTime);
  els.dailyCount.value = state.dailyCount;
  els.packPrice.value = state.packPrice;
}

function saveSettings() {
  const startValue = els.startTime.value;
  state.startTime = startValue ? new Date(startValue).toISOString() : new Date().toISOString();
  state.dailyCount = Math.max(0, Number(els.dailyCount.value || 0));
  state.packPrice = Math.max(0, Number(els.packPrice.value || 0));
  saveState();
  updateDashboard();
}

function toggleCheckin() {
  const today = localDateKey();
  if (state.checkins.includes(today)) {
    state.checkins = state.checkins.filter((item) => item !== today);
  } else {
    state.checkins = [...state.checkins, today].sort();
    els.encouragement.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
  }
  saveState();
  updateDashboard();
}

function showRandomTip() {
  const tip = urgeTips[Math.floor(Math.random() * urgeTips.length)];
  els.tipTitle.textContent = tip.title;
  els.tipBody.textContent = tip.body;
}

function resetAll() {
  state = { ...defaultState, startTime: new Date().toISOString(), checkins: [] };
  saveState();
  fillForm();
  updateDashboard();
}

els.saveSettings.addEventListener("click", saveSettings);
els.checkinButton.addEventListener("click", toggleCheckin);
els.newTip.addEventListener("click", showRandomTip);
els.resetDemo.addEventListener("click", resetAll);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("service-worker.js");
}

fillForm();
showRandomTip();
updateDashboard();
setInterval(updateDashboard, 30000);
