const canvasHTML = document.querySelector("#canvas");
const fontResizeHTML = document.querySelector("#resize-font");
const changeSpeedHTML = document.querySelector("#change-speed");
const modeSelectHTML = document.querySelector("#mode-select");
const pickColorHTML = document.querySelector("#color-pick");
const settingsBtnHTML = document.querySelector(".settings-btn");
const settingsPanelHTML = document.querySelector(".settings-panel");
const radioInputsHTML = document.querySelector(".settings-panel");
const multiColorSwitchHTML = document.querySelector(".multicolor form");
const glowChangeHTML = document.querySelector(".glow input");
const closeButtonHTML = document.querySelector(".x-btn");
const ctx = canvasHTML.getContext("2d");

canvasHTML.height = window.innerHeight;
canvasHTML.width = window.innerWidth;

ctx.textAlign = "center";

class TextTrail {
  constructor(effect, x) {
    this.effect = effect;
    this.setVariables(x);
    this.attachNodes();
  }
  /*runs at creation of each instance and reset that basically appends
   as many nodes as this.trailLength allows*/
  attachNodes() {
    for (let i = 0; i < this.trailLength; i++) {
      this.nodes.push({
        y: this.y + this.fontSize * -i,
        char: this.randomizeChar(),
      });
    }
  }
  //runs at each iteration of requestAnimationFrame interface that sets the whole thing in motion
  update() {
    this.counter++;
    if (this.counter % (21 - this.effect.speed) === 0) {
      this.counter = 0;
      this.y += this.fontSize + 1;

      if (this.y < canvasHTML.height) {
        this.nodes.push({ y: this.y, char: this.randomizeChar() });
      }
      if (this.nodes.length === 0) this.reset();
      this.nodes.shift();
    }
    this.draw();
  }
  //resets the variables set by constructor block but switches start column to a new one
  reset() {
    this.setVariables(this.x);
    this.switchCol();
    this.attachNodes();
  }
  //contains the general statements used by both constructor and reset
  setVariables(x) {
    this.x = x;
    this.y = -this.fontSize;
    this.trailLength = Math.floor(Math.random() * 50) + 10;
    this.nodes = [{ y: this.y, char: this.randomizeChar() }];
    this.fontSize = this.effect.fontSize;
    this.counter = 0;
    this.color =
      this.effect.colors[Math.floor(Math.random() * this.effect.colors.length)];
  }

  switchCol() {
    this.effect.cols[
      this.effect.cols.findIndex((col) => col.pos === this.x)
    ].busy = false;
    let availableCols = this.effect.cols.filter((col) => !col.busy);

    this.x =
      availableCols[Math.floor(Math.random() * availableCols.length)].pos;
    this.effect.cols[
      this.effect.cols.findIndex((col) => col.pos === this.x)
    ].busy = true;
  }
  //draws the characters onto the screen using the 2d context interface provided for dealing with canvas
  draw() {
    ctx.font = `${this.fontSize}px monospace`;
    this.nodes.forEach((node, i) => {
      if (this.nodes.length - 1 === i && this.y < canvasHTML.height) {
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = this.effect.glow;
        ctx.shadowColor = "#fff";
      } else {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.effect.glow - 1;
        ctx.shadowColor = this.color;
      }
      ctx.fillText(node.char, this.x, node.y);
    });
  }
  //returns a new random character based on what mode the user has selected
  randomizeChar() {
    let funcs = [
      () => String.fromCharCode(Math.floor(Math.random() * 0x5e) + 0x21),
      () => {
        let randRange = [
          [96, 0x30a0],
          [86, 0x3041],
          [20991, 0x4e00],
        ][Math.floor(Math.random() * 3)];
        return String.fromCharCode(
          Math.floor(Math.random() * randRange[0]) + randRange[1]
        );
      },
    ];
    switch (this.effect.mode) {
      case "binary":
        return Math.round(Math.random());
      case "hex":
        return Math.floor(Math.random() * 16).toString(16);
      case "ascii":
        return funcs[0]();
      case "samurai":
        return funcs[1](); //0x3041 86     0x30a0 96
      case "mixed":
        return funcs[Math.round(Math.random())]();
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvasHTML.width, canvasHTML.height);
  effect.trails.forEach((trail) => trail.update());
  requestAnimationFrame(animate);
}

class Effect {
  constructor(mode, fontSize) {
    this.mode = mode;
    this.fontSize = fontSize;
    this.trails = [];
    this.colsNum = Math.floor(canvasHTML.width / this.fontSize);
    this.cols = [];
    this.colors = [pickColorHTML.value];
    this.glow = glowChangeHTML.value;
    this.speed = Number(changeSpeedHTML.value);
    this.init();
  }
  //pushes new instances of TextTrail class to the this.trails array as many times as this.colsNum allows
  init() {
    for (let i = 0; i < this.colsNum; i++) {
      this.cols.push({ pos: i * this.fontSize, busy: false });
      if (Math.round(Math.random())) {
        this.trails.push(new TextTrail(this, i * this.fontSize));
        this.cols[i].busy = true;
      }
    }
    requestAnimationFrame(animate);
  }
  //recieves a color in hex as a base and returns an array of 5 colors with similar characteristics
  randomColorPalette(baseColor) {
    let colors = [baseColor];
    let rgb = baseColor
      .match(/[\da-f]{2}/g)
      .map((hexStr) => Number(`0x${hexStr}`));
    let primaryToModify = Math.max(...rgb);
    for (let i = 0; i < 4; i++) {
      let modifiedPrimary = Math.floor(
        Math.random() * 15 + primaryToModify / 2
      );
      colors.push(
        `#${rgb
          .map((n, i) =>
            i === rgb.indexOf(primaryToModify)
              ? modifiedPrimary.toString(16).padStart(2, "0")
              : n.toString(16).padStart(2, "0")
          )
          .join("")}`
      );
    }
    return colors;
  }

  /* ------------------ event handlers -----------------*/
  onWindowResize(e) {
    canvasHTML.height = e.target.innerHeight;
    canvasHTML.width = e.target.innerWidth;
    this.colsNum = Math.floor(canvasHTML.width / this.fontSize);
    this.cols = [];
    this.trails = [];
    for (let i = 0; i < this.colsNum; i++) {
      this.cols.push({ pos: i * this.fontSize, busy: false });
      if (Math.round(Math.random())) {
        this.trails.push(new TextTrail(this, i * this.fontSize));
        this.cols[i].busy = true;
      }
    }
  }
  onFontResize(e) {
    this.fontSize = Number(e.target.value);
    e.target.nextElementSibling.innerText = e.target.value + "px";
    this.colsNum = Math.floor(canvasHTML.width / this.fontSize);
    this.trails = [];
    this.cols = [];
    for (let i = 0; i < this.colsNum; i++) {
      this.cols.push({ pos: i * this.fontSize, busy: false });
      if (Math.round(Math.random())) {
        this.trails.push(new TextTrail(this, i * this.fontSize));
        this.cols[i].busy = true;
      }
    }
  }
  onModeChange(e) {
    this.mode = e.target.value;
    this.trails = [];
    this.cols.forEach((col) => (col.busy = false));
    for (let i = 0; i < this.colsNum; i++) {
      if (Math.round(Math.random())) {
        this.trails.push(new TextTrail(this, i * this.fontSize));
        this.cols[i].busy = true;
      }
    }
  }
  onColorChange(e) {
    //for the purposes of checking if this.colors should be a single color or a range of closely related ones
    this.onMultiColorSwitch({
      target: document.querySelector('[name="i1"]:checked'),
    });
    document.querySelectorAll("input").forEach((elem) => {
      elem.style.accentColor = e.target.value;
    });
  }
  onSpeedChange(e) {
    this.speed = Number(e.target.value);
    e.target.nextElementSibling.innerText = e.target.value;
  }
  onMultiColorSwitch(e) {
    this.colors =
      e.target.value === "on"
        ? this.randomColorPalette(pickColorHTML.value)
        : [pickColorHTML.value];
  }
  onGlowChange(e) {
    this.glow = Number(e.target.value);
    e.target.nextElementSibling.innerText = e.target.value;
  }
  /* -------------------------------------------------- */
}

let effect = new Effect("ascii", 16);

window.addEventListener("resize", (e) => effect.onWindowResize(e));
fontResizeHTML.addEventListener("input", (e) => effect.onFontResize(e));
modeSelectHTML.addEventListener("input", (e) => effect.onModeChange(e));
pickColorHTML.addEventListener("input", (e) => effect.onColorChange(e));
changeSpeedHTML.addEventListener("input", (e) => effect.onSpeedChange(e));
multiColorSwitchHTML.addEventListener("input", (e) =>
  effect.onMultiColorSwitch(e)
);
glowChangeHTML.addEventListener("input", (e) => effect.onGlowChange(e));

settingsBtnHTML.addEventListener("click", (e) => {
  settingsPanelHTML.id = settingsPanelHTML.id === "" ? "hidden" : "";
});
closeButtonHTML.addEventListener(
  "click",
  () => (settingsPanelHTML.id = "hidden")
);
