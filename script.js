/* =====================================================
   GLOBAL HELPERS
   ===================================================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =====================================================
   1. CINEMATIC LOADING SCREEN
   ===================================================== */
(function loadingSequence() {
  const lines = [
    "Preparing your surprise...",
    "Collecting memories...",
    "Loading happiness...",
    "Almost there...",
    "Welcome."
  ];
  const lineEl = $("#loadingLine");
  const fill = $("#loadingBarFill");
  const percentEl = $("#loadingPercent");
  const screen = $("#loadingScreen");

  let idx = 0;
  let progress = 0;

  function setLine() {
    lineEl.style.opacity = 0;
    setTimeout(() => {
      lineEl.textContent = lines[idx];
      lineEl.style.opacity = 1;
    }, 250);
  }
  setLine();

  const lineInterval = setInterval(() => {
    idx++;
    if (idx < lines.length) setLine();
    else clearInterval(lineInterval);
  }, 750);

  const progressInterval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
    }
    fill.style.width = progress + "%";
    percentEl.textContent = Math.floor(progress) + "%";
  }, 260);

  window.addEventListener("load", () => {
    setTimeout(() => {
      screen.classList.add("hidden");
      document.body.style.overflow = "auto";
      $("#floatingNav").classList.add("visible");
      initTypingName();
    }, 3400);
  });

  // safety fallback in case load event already fired
  setTimeout(() => {
    if (!screen.classList.contains("hidden")) {
      screen.classList.add("hidden");
      $("#floatingNav").classList.add("visible");
      initTypingName();
    }
  }, 5200);
})();

/* =====================================================
   HERO TYPING ANIMATION
   ===================================================== */
function initTypingName() {
  const el = $("#typedName");
  if (!el || el.dataset.done) return;
  el.dataset.done = "1";
  const name = "Prashanthi";
  let i = 0;
  function type() {
    if (i <= name.length) {
      el.textContent = name.slice(0, i);
      i++;
      setTimeout(type, 110);
    }
  }
  type();
}

/* =====================================================
   SCROLL PROGRESS BAR
   ===================================================== */
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  $("#scrollProgress").style.width = scrolled + "%";
}, { passive: true });

/* =====================================================
   CURSOR GLOW
   ===================================================== */
(function cursorGlow() {
  const glow = $("#cursorGlow");
  if (!glow) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  function loop() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* =====================================================
   HEART TRAIL ON CLICK / RIPPLE
   ===================================================== */
document.addEventListener("click", (e) => {
  // ripple
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = e.clientX - 10 + "px";
  ripple.style.top = e.clientY - 10 + "px";
  ripple.style.width = ripple.style.height = "20px";
  ripple.style.position = "fixed";
  ripple.style.zIndex = 2000;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);

  // occasional floating heart at click point
  if (Math.random() > 0.4) spawnHeart(e.clientX, e.clientY);
});

/* =====================================================
   FLOATING HEARTS (ambient + spawned)
   ===================================================== */
const heartsLayer = $("#floatingHearts");
function spawnHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "heart-particle";
  heart.textContent = ["🤍", "💜", "✨"][Math.floor(Math.random() * 3)];
  heart.style.left = (x != null ? x : Math.random() * window.innerWidth) + "px";
  heart.style.bottom = "0px";
  heart.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
  heart.style.animationDuration = (6 + Math.random() * 5) + "s";
  heart.style.fontSize = (12 + Math.random() * 10) + "px";
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}
setInterval(() => spawnHeart(), 1400);

/* =====================================================
   STAR FIELD CANVAS
   ===================================================== */
(function stars() {
  const canvas = $("#starCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      s: Math.random() * 0.02 + 0.005,
      o: Math.random()
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    stars.forEach(s => {
      s.o += s.s;
      const alpha = Math.abs(Math.sin(s.o));
      ctx.globalAlpha = alpha * 0.8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* =====================================================
   SCROLL REVEAL (IntersectionObserver)
   ===================================================== */
function markReveal() {
  $$(".about-card, .timeline-item, .openwhen-card, .gallery-item, .wrapped-card, .reason-card, .episode-card, .calendar-wrap, .radio-wrap, .ig-card, .analytics-wrap, .moon-stage, .dreammap-wrap, .capsule-wrap").forEach(el => {
    el.classList.add("reveal");
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* =====================================================
   TILT CARD 3D HOVER
   ===================================================== */
function initTiltCards() {
  $$(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -10;
      const ry = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

/* =====================================================
   MAGNETIC BUTTONS
   ===================================================== */
function initMagnetic() {
  $$(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0,0)"; });
  });
}

/* =====================================================
   START JOURNEY BUTTON
   ===================================================== */
$("#startJourneyBtn")?.addEventListener("click", () => {
  $("#about").scrollIntoView({ behavior: "smooth" });
});

/* =====================================================
   4. STORYBOOK
   ===================================================== */
(function storybook() {
  const pages = $$(".story-page");
  const dotsWrap = $("#storybookDots");
  let current = 0;

  pages.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(i) {
    pages[current].classList.remove("active");
    dotsWrap.children[current].classList.remove("active");
    current = (i + pages.length) % pages.length;
    pages[current].classList.add("active");
    dotsWrap.children[current].classList.add("active");
  }

  $("#storyNext")?.addEventListener("click", () => goTo(current + 1));
  $("#storyPrev")?.addEventListener("click", () => goTo(current - 1));
})();

/* =====================================================
   5. GALLERY LIGHTBOX
   ===================================================== */
(function gallery() {
  const items = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const caption = $("#lightboxCaption");

  items.forEach(item => {
    item.addEventListener("click", () => {
      caption.textContent = item.dataset.caption || "";
      lightbox.classList.add("active");
    });
  });
  $("#lightboxClose")?.addEventListener("click", () => lightbox.classList.remove("active"));
  lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("active"); });
})();

/* =====================================================
   6. TIMELINE LINE GROW ON SCROLL
   ===================================================== */
function initTimelineGrow() {
  const line = $("#timelineLine");
  const wrap = $("#timelineList");
  if (!line || !wrap) return;
  window.addEventListener("scroll", () => {
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
    line.style.height = (visible / total * 100) + "%";
  }, { passive: true });
}

/* =====================================================
   7. ENVELOPE / SECRET LETTER
   ===================================================== */
$("#envelope")?.addEventListener("click", function () {
  this.classList.toggle("open");
  const hint = $("#envelopeHint");
  hint.textContent = this.classList.contains("open") ? "click to close" : "click to open";
});

/* =====================================================
   8. MUSIC PLAYER
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const audio = document.getElementById("bgAudio");
    const btn = document.getElementById("playPauseBtn");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    const eq = document.getElementById("equalizer");
    const art = document.getElementById("albumArt");
    const progressFill = document.getElementById("musicProgressFill");
    const progressTrack = document.getElementById("musicProgressTrack");

    function updateUI(isPlaying) {
        playIcon.style.display = isPlaying ? "none" : "block";
        pauseIcon.style.display = isPlaying ? "block" : "none";

        if(eq) eq.classList.toggle("playing", isPlaying);
        if(art) art.classList.toggle("playing", isPlaying);
    }

    btn.addEventListener("click", async () => {

        try {
            if (audio.paused) {
                await audio.play();
                updateUI(true);
            } else {
                audio.pause();
                updateUI(false);
            }
        } catch (err) {
            console.error(err);
            alert("Unable to play the audio.");
        }

    });

    audio.addEventListener("timeupdate", () => {

        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + "%";
        }

    });

    progressTrack.addEventListener("click", (e) => {

        const rect = progressTrack.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;

        audio.currentTime = percent * audio.duration;

    });

    audio.addEventListener("play", () => updateUI(true));
    audio.addEventListener("pause", () => updateUI(false));

});
/* =====================================================
   9. 100 REASONS GRID
   ===================================================== */
(function reasons() {
  const grid = $("#reasonsGrid");
  if (!grid) return;

  const reasonList = [
    "Your smile", "Your kindness", "Your honesty", "Your laugh", "Your confidence",
    "Your caring nature", "Your positive energy", "How you remember little things",
    "Your loyalty", "The way you say 'Peela'", "Your patience with me", "Your courage",
    "How you make everyone feel included", "Your sense of humor", "Your hugs",
    "The way you listen", "Your stubbornness (sometimes)", "Your food taste",
    "How you never give up on people", "Your voice notes", "Your late night texts",
    "Your dance moves", "Your bad jokes", "Your good jokes", "Your advice",
    "How you fight for people you love", "Your forehead wrinkle when confused",
    "Your loud laugh", "Your quiet moments", "How safe I feel around you",
    "Your handwriting", "Your playlist choices", "Your random facts",
    "How you always show up", "Your honesty even when it's hard",
    "Your birthday excitement for others", "Your forgiving heart",
    "How you never made me feel small", "Your ambition", "Your dreams",
    "The way you cry during movies", "Your competitiveness", "Your teasing",
    "How you protect Roshni, Roshan, Swetha and me", "Your nicknames for everyone",
    "Your energy in a group", "How you turn sad days around", "Your food recommendations",
    "Your travel excitement", "Your curiosity", "Your grudges (the funny ones)",
    "How quickly you forgive", "Your opinions, always strong", "Your care for family",
    "The way you say sorry", "How you remember old memories", "Your storytelling",
    "Your reactions to gossip", "Your 'no explanation needed' support", "Your realness",
    "How you never fake anything", "Your bluntness", "Your softness underneath it",
    "How you make plans happen", "Your punctuality (sometimes)", "Your excuses (the creative ones)",
    "Your selfie poses", "Your outfit choices", "Your confidence in chaos",
    "How you handle pressure", "Your problem-solving", "Your gut feelings, always right",
    "Your intuition about people", "How you read a room", "Your generosity",
    "How you never let anyone eat alone", "Your food sharing (sometimes)",
    "Your competitive board game energy", "Your road trip playlist",
    "How you make ordinary evenings unforgettable", "Your first-trip memories",
    "How our whole friend group trusts you", "Your loud entrance energy",
    "Your quiet check-ins", "How you never forget a birthday",
    "Your 'I'm proud of you' texts", "How you show up during hard times",
    "Your resilience", "Your growth over the years", "Your unapologetic personality",
    "How you make people laugh without trying", "Your comfort food choices",
    "Your midnight thoughts", "How you never left when things got hard",
    "Your promise to always stay", "Your existence, honestly", "Being you, always",
    "The version of me I am because of you", "Every inside joke we own",
    "Every memory still unwritten", "Simply — being my Peela"
  ];

  reasonList.forEach((text, i) => {
    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-face reason-front">${String(i + 1).padStart(2, "0")}</div>
        <div class="reason-face reason-back">${text}</div>
      </div>`;
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    grid.appendChild(card);
  });
})();

/* =====================================================
   10. COMPLIMENT MACHINE
   ===================================================== */
(function complimentMachine() {
  const btn = $("#generateComplimentBtn");
  const textEl = $("#complimentText");
  if (!btn) return;

  const compliments = [
    "You make every room brighter just by walking in.", "Your laugh is genuinely one of my favourite sounds.",
    "You give the kind of loyalty most people only talk about.", "You're the friend everyone deserves but few people get.",
    "Your heart is bigger than you give yourself credit for.", "You turn ordinary days into core memories.",
    "You have this way of making people feel instantly comfortable.", "Your honesty is rare, and it matters more than you know.",
    "You're stronger than every hard day you've survived.", "You listen in a way that makes people feel actually heard.",
    "Your energy shifts an entire room, always for the better.", "You remember the small things, and that says everything about you.",
    "You forgive faster than most people even try to.", "Your confidence inspires people, even when you don't notice it.",
    "You're the definition of showing up, every single time.", "Your kindness has never once felt fake.",
    "You make people feel safe enough to be themselves.", "Your sense of humor could fix a bad day instantly.",
    "You care so deeply, and it shows in everything you do.", "Your presence alone is a comfort to the people who love you.",
    "You've grown so much, and it's beautiful to watch.", "You give advice like someone who's actually lived it.",
    "You never let the people you love feel alone.", "Your loyalty to Roshni, Roshan and Swetha says everything about your heart.",
    "You're someone people trust with their real feelings.", "Your excitement for other people's happiness is rare.",
    "You handle chaos better than you think you do.", "Your gut instincts are almost always right.",
    "You make people feel important just by remembering details.", "Your smile has genuinely made hard days easier.",
    "You're the friend people call first, and there's a reason for that.", "You never make people feel small for feeling things.",
    "Your realness is refreshing in a world full of filters.", "You protect your people fiercely, and it's beautiful.",
    "You're allowed to take up space — you deserve every bit of it.", "You've been someone's peace on their worst days.",
    "Your voice notes could turn anyone's mood around.", "You're proof that loyalty still exists.",
    "You make people feel chosen, not just included.", "Your humor and your heart make an unbeatable combination.",
    "You are, quite simply, one of the good ones.", "Your presence has made this friend group what it is.",
    "You deserve every good thing coming your way this year.", "You've never needed to try hard to be loved — you just are.",
    "Your softness and your strength coexist beautifully.", "You make people feel like their story matters.",
    "You're someone's whole 'safe place,' and you don't even realize it.", "Your friendship has never once felt conditional.",
    "You show up for people even when it's inconvenient for you.", "You are so deeply, genuinely appreciated — today and always.",
    "Happy Birthday, Peela — the world really is better with you in it."
  ];

  btn.addEventListener("click", () => {
    textEl.style.opacity = 0;
    setTimeout(() => {
      const pick = compliments[Math.floor(Math.random() * compliments.length)];
      textEl.textContent = pick;
      textEl.style.opacity = 1;
    }, 200);
    spawnHeart(btn.getBoundingClientRect().left + 40, window.innerHeight - btn.getBoundingClientRect().top);
  });
  textEl.style.transition = "opacity 0.3s ease";
})();

/* =====================================================
   11. MEMORY JAR
   ===================================================== */
(function memoryJar() {
  const jarBtn = $("#jarButton");
  const output = $("#jarOutput");
  if (!jarBtn) return;

  const memories = [
    "That stranger beside my house who introduced us — the tiny moment that started everything.",
    "The first time the four of us — me, you, Roshni and Roshan — hung out together.",
    "Our very first group trip: your house, just to eat, and somehow it became legendary.",
    "The birth of 'Peela' as your nickname, and how it stuck forever.",
    "The day 'Pesoo' happened and none of us could stop laughing.",
    "Being called 'Peela Rajesh' and you pretending to be annoyed about it.",
    "Every childhood evening where we had zero worries about the future.",
    "The comfort of knowing you and Swetha will always be there for me.",
    "A random ordinary day that turned into one of our funniest memories.",
    "The tough time you sat through with me, no questions asked.",
    "A conversation that quietly changed our entire friendship.",
    "The way our friend group of four became unbreakable over the years.",
    "A memory only the five of us — you, me, Roshni, Roshan and Swetha — would understand.",
    "The specific laugh you have when something is REALLY funny.",
    "That one joke that still makes the whole group lose it, every time.",
    "A late night talk that somehow solved everything.",
    "The first time I realized you were my safe person.",
    "A moment you showed up for me without me even having to ask.",
    "The comfort of routine — us, together, no drama, just us.",
    "A memory from your house, the very first place we all went as a group.",
    "The precious, unexplainable feeling of a friendship built to last till the end.",
    "A time you protected me without a second thought.",
    "The way our childhood was full of joy and completely worry-free.",
    "A random text from you that made an entire bad day better.",
    "The birthday tradition we've built over the years, including this website.",
    "A memory of you being the loudest, funniest one in the room.",
    "The quiet version of you that only the closest people get to see.",
    "A promise we made — that this friendship lasts until our very last day.",
    "The moment I knew: whatever happens, you and Swetha will be there.",
    "This exact memory, right now — you reading this on your birthday. 🤍"
  ];

  jarBtn.addEventListener("click", () => {
    jarBtn.style.transform = "scale(0.92) rotate(-3deg)";
    setTimeout(() => { jarBtn.style.transform = ""; }, 200);
    const pick = memories[Math.floor(Math.random() * memories.length)];
    output.style.opacity = 0;
    setTimeout(() => {
      output.innerHTML = `<p>"${pick}"</p>`;
      output.style.opacity = 1;
    }, 200);
    spawnHeart(jarBtn.getBoundingClientRect().left + 60, window.innerHeight - jarBtn.getBoundingClientRect().top);
  });
  output.style.transition = "opacity 0.3s ease";
})();

/* =====================================================
   12. FRIENDSHIP WRAPPED — COUNT UP ON SCROLL
   ===================================================== */
function initWrappedCounters() {
  const nums = $$(".wrapped-number");
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
}
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

/* =====================================================
   13. OPEN WHEN MODAL
   ===================================================== */
(function openWhen() {
  const modal = $("#owModal");
  const textEl = $("#owModalText");
  $$(".openwhen-card").forEach(card => {
    card.addEventListener("click", () => {
      textEl.textContent = card.dataset.msg;
      modal.classList.add("active");
    });
  });
  $("#owModalClose")?.addEventListener("click", () => modal.classList.remove("active"));
  modal?.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });
})();

/* =====================================================
   14. VIRTUAL CAKE
   ===================================================== */
(function cake() {
  const flames = $$(".flame");
  const cakeEl = $("#cake");
  const hint = $("#cakeHint");
  const message = $("#cakeMessage");
  if (!flames.length) return;

  let blownCount = 0;
  flames.forEach(flame => {
    flame.addEventListener("click", () => {
      if (flame.classList.contains("out")) return;
      flame.classList.add("out");
      blownCount++;
      launchConfettiBurst(flame.getBoundingClientRect().left, flame.getBoundingClientRect().top, 18);
      if (blownCount === flames.length) {
        setTimeout(() => {
          cakeEl.classList.add("cut");
          hint.textContent = "Make a wish, Peela 🤍";
          message.textContent = "Wish made. Cake cut. Here's to another beautiful year of you. 🎂";
          launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 120);
        }, 400);
      }
    });
  });
})();

/* =====================================================
   CONFETTI SYSTEM (canvas)
   ===================================================== */
const confettiCanvas = $("#confettiCanvas");
const confettiCtx = confettiCanvas?.getContext("2d");
let confettiParticles = [];
const confettiColors = ["#FF5E9C", "#9D4EDD", "#7B2CBF", "#5A189A", "#ffffff"];

function resizeConfettiCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);

function launchConfettiBurst(x, y, count = 60) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x, y,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -10 - 3,
      size: Math.random() * 7 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      life: 0,
      maxLife: 90 + Math.random() * 40
    });
  }
  if (!confettiRunning) runConfettiLoop();
}

let confettiRunning = false;
function runConfettiLoop() {
  confettiRunning = true;
  function loop() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.vy += 0.28;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rot * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life < p.maxLife && p.y < confettiCanvas.height + 50);
    if (confettiParticles.length > 0) {
      requestAnimationFrame(loop);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
  loop();
}

/* =====================================================
   FIREWORKS (finale canvas)
   ===================================================== */
const fireworksCanvas = $("#fireworksCanvas");
const fwCtx = fireworksCanvas?.getContext("2d");
let fireworkParticles = [];
let fireworksRunning = false;

function resizeFireworksCanvas() {
  if (!fireworksCanvas) return;
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}
resizeFireworksCanvas();
window.addEventListener("resize", resizeFireworksCanvas);

function launchFirework() {
  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height * 0.5 + 60;
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  const count = 45;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = Math.random() * 4 + 2;
    fireworkParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color, life: 0, maxLife: 60 + Math.random() * 30, size: Math.random() * 2 + 1.5
    });
  }
}

let fireworksInterval;
function startFireworks() {
  if (fireworksRunning) return;
  fireworksRunning = true;
  fireworksInterval = setInterval(launchFirework, 550);
  function loop() {
    if (!fireworksRunning) return;
    fwCtx.fillStyle = "rgba(8,0,15,0.18)";
    fwCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fireworkParticles.forEach(p => {
      p.vy += 0.03;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      fwCtx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      fwCtx.fillStyle = p.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fill();
    });
    fireworkParticles = fireworkParticles.filter(p => p.life < p.maxLife);
    fwCtx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}
function stopFireworks() {
  fireworksRunning = false;
  clearInterval(fireworksInterval);
  fwCtx?.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworkParticles = [];
}

/* =====================================================
   21. FINAL SURPRISE OVERLAY
   ===================================================== */
$("#finalSurpriseBtn")?.addEventListener("click", openFinale);
$("#closeFinale")?.addEventListener("click", closeFinale);

function openFinale() {
  $("#finaleOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
  startFireworks();
  launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.3, 150);
}
function closeFinale() {
  $("#finaleOverlay").classList.remove("active");
  document.body.style.overflow = "auto";
  stopFireworks();
}

/* =====================================================
   THEME TOGGLE (dark / light)
   ===================================================== */
$("#themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  $("#themeIcon").textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

/* =====================================================
   BACK TO TOP + FAB VISIBILITY
   ===================================================== */
window.addEventListener("scroll", () => {
  const fabs = $$(".fab-stack .fab");
  if (window.scrollY > 500) fabs.forEach(f => f.classList.add("visible"));
  else fabs.forEach(f => f.classList.remove("visible"));
}, { passive: true });

$("#backToTopFab")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* =====================================================
   NAV LINK SMOOTH SCROLL (extra safety for older browsers)
   ===================================================== */
$$("[data-nav]").forEach(link => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* =====================================================
   6b. MEMORY CALENDAR
   ===================================================== */
function initMemoryCalendar() {
  const grid = $("#calendarGrid");
  const monthLabel = $("#calendarMonth");
  if (!grid) return;

  const year = 2026, month = 6; // July (0-indexed)
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  monthLabel.textContent = monthNames[month];

  const marked = {
    4:  "The day a neighbour's random introduction quietly started one of the most important friendships of our lives.",
    12: "A completely ordinary afternoon that somehow turned into a core memory none of us have forgotten.",
    15: "Happy Birthday, Prashanthi! The whole reason this website exists. 🎂🤍",
    22: "The day the nicknames Peela, Pesoo and Peela Rajesh were officially born.",
    27: "The first 'trip' — just to your house, to eat. Still one of the funniest nights ever."
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = "";
  for (let i = 0; i < firstDay; i++) html += `<div class="calendar-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    if (marked[d]) {
      html += `<div class="calendar-day marked" data-msg="${marked[d].replace(/"/g, '&quot;')}">${d}</div>`;
    } else {
      html += `<div class="calendar-day">${d}</div>`;
    }
  }
  grid.innerHTML = html;

  $$(".calendar-day.marked").forEach(day => {
    day.addEventListener("click", () => openTextModal(day.dataset.msg));
  });
}

/* =====================================================
   SHARED TEXT MODAL (reused by calendar + open-when)
   ===================================================== */
function openTextModal(text) {
  const modal = $("#owModal");
  const textEl = $("#owModalText");
  if (!modal || !textEl) return;
  textEl.textContent = text;
  modal.classList.add("active");
}

/* =====================================================
   8b. FRIENDSHIP RADIO FM
   ===================================================== */
(function friendshipRadio() {
  const dial = $("#radioDial");
  const stationBtns = $$(".radio-station-btn");
  const freqEl = $("#radioFreq");
  const nameEl = $("#radioStationName");
  const msgEl = $("#radioMessage");
  const bars = $("#radioBars");
  const playBtn = $("#radioPlayBtn");
  const playIcon = $("#radioPlayIcon");
  const pauseIcon = $("#radioPauseIcon");
  if (!dial) return;

  let playing = false;

  function tuneTo(btn) {
    stationBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    dial.value = btn.dataset.station;
    freqEl.textContent = btn.dataset.freq;
    nameEl.textContent = "Peela FM — " + btn.dataset.name;
    msgEl.style.opacity = 0;
    setTimeout(() => {
      msgEl.textContent = btn.dataset.msg;
      msgEl.style.opacity = 1;
    }, 200);
  }

  stationBtns.forEach(btn => btn.addEventListener("click", () => tuneTo(btn)));
  dial.addEventListener("input", () => {
    const btn = stationBtns[Number(dial.value)];
    if (btn) tuneTo(btn);
  });

  playBtn?.addEventListener("click", () => {
    playing = !playing;
    playIcon.style.display = playing ? "none" : "block";
    pauseIcon.style.display = playing ? "block" : "none";
    bars.classList.toggle("playing", playing);
  });
})();

/* =====================================================
   11b. INSTAGRAM COUNTERS
   ===================================================== */
function initInstagramCounters() {
  const postsEl = $("#igPosts");
  const followersEl = $("#igFollowers");
  if (!postsEl) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(postsEl, 47, 1200);
      animateCount(followersEl, 4, 900);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  io.observe($("#instagram"));
}
function animateCount(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* =====================================================
   12b. FRIENDSHIP ANALYTICS
   ===================================================== */
function initAnalytics() {
  const rows = $$(".analytics-row");
  if (!rows.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      const target = Number(row.dataset.target);
      const fill = row.querySelector(".analytics-fill");
      const val = row.querySelector(".analytics-val");
      fill.style.width = target + "%";
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / 1400, 1);
        val.textContent = Math.floor(p * target) + "%";
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(row);
    });
  }, { threshold: 0.4 });
  rows.forEach(r => io.observe(r));
}

/* =====================================================
   13b. 3D MOON — click to wish
   ===================================================== */
(function moonWish() {
  const moon = $("#moon3d");
  const caption = $("#moonCaption");
  if (!moon) return;
  const wishes = [
    "🌙 Wish sent. The moon's on it, Peela.",
    "🌙 May every dream you have find its way to you.",
    "🌙 Somewhere up there, a moon just got your name.",
    "🌙 Wish received. Delivery pending — likely arriving all year."
  ];
  moon.addEventListener("click", () => {
    moon.classList.remove("wished");
    void moon.offsetWidth;
    moon.classList.add("wished");
    caption.textContent = wishes[Math.floor(Math.random() * wishes.length)];
    launchConfettiBurst(moon.getBoundingClientRect().left + moon.offsetWidth / 2, moon.getBoundingClientRect().top, 40);
  });
})();

/* =====================================================
   13c. CONSTELLATION "PRESS ❤️"
   ===================================================== */
(function constellation() {
  const canvas = $("#constellationCanvas");
  const btn = $("#drawConstellationBtn");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // heart parametric points, scaled to canvas
  function heartPoints(n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push({ x, y });
    }
    return pts;
  }

  let drawn = false;
  btn?.addEventListener("click", () => {
    if (drawn) return;
    drawn = true;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2 + 10;
    const scale = Math.min(rect.width, rect.height) / 40;
    const pts = heartPoints(26).map(p => ({ x: cx + p.x * scale, y: cy + p.y * scale }));

    let i = 0;
    function step() {
      if (i >= pts.length) return;
      ctx.clearRect(0, 0, rect.width, rect.height);
      // faint full outline
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      pts.forEach((p, idx) => idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();

      // progressive connection
      ctx.strokeStyle = "rgba(255,94,156,0.7)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let k = 0; k <= i; k++) {
        const p = pts[k];
        k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // stars
      for (let k = 0; k <= i; k++) {
        const p = pts[k];
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      i++;
      setTimeout(step, 55);
    }
    step();
    btn.textContent = "";
    btn.innerHTML = "<span>Constellation Revealed 🤍</span>";
    launchConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
  });
})();

/* =====================================================
   13d. DREAM DESTINATION MAP
   ===================================================== */
(function dreamMap() {
  const pins = $$(".dreammap-pin");
  const msg = $("#dreammapMsg");
  if (!pins.length) return;
  pins.forEach(pin => {
    pin.addEventListener("click", () => {
      msg.textContent = `${pin.dataset.place}: ${pin.dataset.note}`;
    });
  });
})();

/* =====================================================
   13e. FUTURE TIME CAPSULE (localStorage)
   ===================================================== */
(function timeCapsule() {
  const form = $("#capsuleForm");
  const sealed = $("#capsuleSealed");
  const noteInput = $("#capsuleNote");
  const dateInput = $("#capsuleDate");
  const sealBtn = $("#capsuleSealBtn");
  const resetBtn = $("#capsuleResetBtn");
  const sealedText = $("#capsuleSealedText");
  const openDateEl = $("#capsuleOpenDate");
  if (!form) return;

  const STORAGE_KEY = "birthdaySite_timeCapsule";

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function render() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      form.classList.remove("hidden");
      sealed.classList.remove("active");
      return;
    }
    const data = JSON.parse(raw);
    form.classList.add("hidden");
    sealed.classList.add("active");
    const today = new Date().toISOString().slice(0, 10);
    if (today >= data.date) {
      sealedText.textContent = "The capsule has unlocked: \u201C" + data.note + "\u201D";
      openDateEl.textContent = "Opened " + fmtDate(data.date);
    } else {
      sealedText.textContent = "A memory capsule is sealed and waiting.";
      openDateEl.textContent = "Unlocks on " + fmtDate(data.date);
    }
  }

  sealBtn?.addEventListener("click", () => {
    const note = noteInput.value.trim();
    const date = dateInput.value;
    if (!note || !date) {
      noteInput.style.borderColor = !note ? "var(--pink)" : "";
      dateInput.style.borderColor = !date ? "var(--pink)" : "";
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ note, date }));
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
    render();
  });

  resetBtn?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    noteInput.value = "";
    dateInput.value = "";
    render();
  });

  render();
})();

/* =====================================================
   15. END CREDITS ROLL ON SCROLL INTO VIEW
   ===================================================== */
function initCreditsRoll() {
  const crawl = $("#creditsCrawl");
  const section = $("#credits");
  if (!crawl || !section) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        crawl.classList.add("roll");
        io.unobserve(section);
      }
    });
  }, { threshold: 0.3 });
  io.observe(section);
}

/* =====================================================
   HIDDEN SECRET ENDING (tap "peela ✨" 5x)
   ===================================================== */
(function secretEnding() {
  const brand = $(".nav-brand");
  const overlay = $("#secretOverlay");
  const closeBtn = $("#closeSecretBtn");
  if (!brand || !overlay) return;

  let taps = 0, resetTimer = null;
  brand.style.cursor = "pointer";
  brand.addEventListener("click", () => {
    taps++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (taps = 0), 1800);
    if (taps >= 5) {
      taps = 0;
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.3, 90);
    }
  });

  closeBtn?.addEventListener("click", () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
})();

/* =====================================================
   INIT everything that depends on DOM being ready
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  markReveal();
  initTiltCards();
  initMagnetic();
  initTimelineGrow();
  initWrappedCounters();
  initMemoryCalendar();
  initInstagramCounters();
  initAnalytics();
  initCreditsRoll();
});
