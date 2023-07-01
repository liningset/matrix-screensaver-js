# The Matrix Screensaver Effect

---

## Technologies used

This project was developed using HTML, CSS and JavaScript, with extensive help from the canvas element in HTML.  
fontawesome icon library was used for the icons, except that no other external libraries or cdns were used.

---

## Effect customizability

Upon opening the ./index.html the user can see a settings button on top-right corner. Once clicked a panel will show up allowing for the following changes in visual effects:

### **Mode**

There are 5 main modes to switch to with the following char sets:

- binary mode ------------- 0-1
- hexadecimal mode -------- 0-9 && a-f
- ASCII mode -------------- \x21-\x7f
- Samurai mode ------------ \u30a0-\u3100 && \u3041-\u3097 && \u4e00-\u9fff
- ASCII+Samurai ----------- ASCII && Samurai

the default is set to ASCII.

---

### **Text size**

user can modify the text size

the default is set to 16 pixels. (1px~50px)

---

### **Speed**

user can change the speed in which the characters move .

the default is set to 20 (1~20)

---

### **Blur intensity (glow)**

user can choose the intensity of glow effect on characters provided that they want it in the first place.

the default is set to 5 (1~10)

---

### **Base color**

user can change the base color of characters

the default is set to #45ff00 (green)

---

### **Multi-coloredness**

if this option is set to on, a color palette consisting of 5 similar colors including the base color will be generated and applied randomly to each trail of falling characters.

if the option set to off, only the base color will be used.

the default is set to off

---

## Inspired by

There may be several variants and implementations of the matrix effect, however this project has focused on achieving the one presented by https://github.com/abishekvashok/cmatrix with an added glow effect and few other customizable features in mind.

---

## find me on

github - https://github.com/liningset
website - coming soon :)
