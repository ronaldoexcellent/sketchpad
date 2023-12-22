importStylesheets(["css/root.css"]);
navSlider($('nav'), "width", 80);
click($('.opennav'), () => css($('nav'), 'width:80%')), click($('.closenav'), () => css($('nav'), 'width:0'));
// General Size
// var $height = $("#canvas-container").clientHeight;
// var $width = $("#canvas-container").clientwidth;
var $height = screen.availHeight;
var $width = screen.availWidth;
// First Canvas
var bgCTX = $('#BG').getContext("2d");
$('#BG').height = $height, $('#BG').width = $width;
// gRID
// Box width
var bw = $width;
// Box height
var bh = $height;
// Padding
var p = 0;
addClass($('#BG'), 'g-off');
function displayGrid() {
    if ($('.g-off')) {
        removeClass($('#BG'), 'g-off');
        for (var x = 0; x <= bw; x += 10) {
            bgCTX.moveTo(0.5 + x + p, p);
            bgCTX.lineTo(0.5 + x + p, bh + p);
        }
        for (var x = 0; x <= bh; x += 10) {
            bgCTX.moveTo(p, 0.5 + x + p);
            bgCTX.lineTo(bw + p, 0.5 + x + p);
        }
        bgCTX.strokeStyle = "black";
        bgCTX.stroke();
    } else {
        addClass($('#BG'), 'g-off');
        bgCTX.clearRect(0, 0, $width, $height);
    }
} click($('.hide'), () => toggleClass($('.sketchpad'), 's-hide')), click($('.grid'), () => displayGrid());
// ================================================
widgets.construct('canvas'),
attrib(widget, 'draggable', false),
css(widget, 'position: absolute'),
addClasses(widget, ["sketchpad"]);
var ctx = widget.getContext("2d"),
$fill = $(".fill-color"),
$clear = $(".clear"),
$save = $(".save"); html($('.tool-ID'), "Pen");
let changeTool = tool => html($('.tool-ID'), tool);
let changeCursor = c => css(widget, `cursor: ${c}`);
let deviceActivation = (e) => {
    $offsetX = e.touches ? e.touches[0].pageX - e.touches[0].target.offsetLeft : e.offsetX;
    $offsetY = e.touches ? e.touches[0].pageY - e.touches[0].target.offsetTop : e.offsetY;
};
var prevMouseX, prevMouseY, snapshot, isDrawing = false;
load(window, () => {
    widget.height = $height, widget.width = $width;
});

let drawRect = (e) => {
    changeCursor("crosshair");
    if (!$fill.checked) {
        return ctx.strokeRect($offsetX, $offsetY, prevMouseX - $offsetX, prevMouseY - $offsetY);
    }
    ctx.fillRect($offsetX, $offsetY, prevMouseX - $offsetX, prevMouseY - $offsetY);
};
let drawCirc = (e) => {
    changeCursor("crosshair"), ctx.beginPath(); 
    var radius = Math.sqrt(Math.pow((prevMouseX - $offsetX), 2) + Math.pow((prevMouseY - $offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    $fill.checked ? ctx.fill() : ctx.stroke();
};
let drawTri = (e) => {
    changeCursor("crosshair"), ctx.beginPath(), ctx.moveTo(prevMouseX, prevMouseY), ctx.lineTo($offsetX, $offsetY), ctx.lineTo(prevMouseX * 2 - $offsetX, $offsetY), ctx.closePath(); 
    $fill.checked ? ctx.fill() : ctx.stroke();
};
$zoom = 1;
function zoomIn() {
    changeCursor('zoom-in'), changeTool('Zoom-In');
    $zoom++;
    scale($('#canvas-container'), $zoom);
}
function zoomOut() {
    changeCursor('zoom-out'), changeTool('Zoom-Out');
    $zoom--;
    if ($zoom < 2) {$zoom = 1}
    scale($('#canvas-container'), $zoom);
}
click($('.zoom'), () => toggleClass($('.zoom-tools'), 's-hide'));
click($('.zoom-in'), () => zoomIn());
click($('.zoomRst'), () => scale($('#canvas-container'), 1));
click($('.zoom-out'), () => zoomOut());
click($('#rectangle'), () => changeTool('Rectangle'));
click($('#circle'), () => changeTool('Circle'));
click($('#triangle'), () => changeTool('Triangle'));
click($$('.tools button')[0], () => {changeCursor('pointer'); changeTool("Pen")});
click($$('.tools button')[1], () => {changeCursor('pointer'); changeTool("Eraser")});
// function drawText() {
//     ctx.clearRect(0, 0, 500, 400);
//     ctx.fillStyle = "black";
//     ctx.strokeStyle = "black";
//     ctx.font = "35px Arial";
//     ctx.fillText("fname", $offsetX, $offsetY);
//     ctx.stroke();
// }
var startD = e => {
    e.preventDefault(), deviceActivation(e);
    if (e.touches) {
        e = e.touches[0];
    }
    $WBG = val($('.layout-bg'));
    css($('#BG'), `background: ${$WBG}`);
    attrib(e.target, 'draggable', 'false');
    $color = val($('#pen-color')),
    $weight = val($("#weight")),
    $tool = html($('.tool-ID'));
    isDrawing = true;
    prevMouseX = $offsetX;
    prevMouseY = $offsetY;
    ctx.beginPath();
    ctx.lineWidth = $weight;
    if (e.ctrlKey) {
        ctx.fillStyle = $WBG;
        ctx.strokeStyle = $WBG;
    } else {
        ctx.strokeStyle = $color;
        ctx.fillStyle = $color;
    }
    snapshot = ctx.getImageData(0, 0, $width, $height);
};
var endD = e => {
    e.preventDefault();
    if (e.touches) {
        e = e.touches[0];
    }
    isDrawing = false;
};
var D = e => {
    e.preventDefault(), deviceActivation(e);
    // drawText()
    if (e.touches) {
        e = e.touches[0];
    }
    if ($('.color-flash').checked) {
        css($('#BG'), `background: ${randomize(["red", "blue", "yellow", "green", "purple", "magenta", "orange", "black", "white", "cyan", "maroon", "gold", "lightgreen", "indigo", "violet", "tomato", "dodgerblue", "mediumseagreen", "crimson", "darkred", "firebrick", "coral"])}`);
    }
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if ($tool === "Pen" || $tool === "Eraser") {
        ctx.strokeStyle = $tool === "Eraser" ? $WBG : $tool === "Pen" && e.ctrlKey ? $WBG : $color;
        ctx.lineTo($offsetX, $offsetY);
        ctx.stroke(); changeCursor('pointer');
    } else if ($tool === "Rectangle") {
        drawRect(e);
    } else if ($tool === "Circle") {
        drawCirc(e);
    } else if ($tool === "Triangle") {
        drawTri(e);
    } else {
        return null;
    }
};
click($clear, () => ctx.clearRect(0, 0, $width, $height));
click($save, () => {
    ctx.fillStyle = $('#BG').style.backgroundColor;
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillRect(0, 0, $width, $height);
    var link = document.createElement("a");
    link.download = `Name - ${Date.now()}.jpg`;
    link.href = widget.toDataURL();
    link.click();
});
contextmenu(widget, () => {return false});
mousedown(widget, () => startD(event));
touchstart(widget, () => startD(event));
mouseup(widget, () => endD(event));
touchend(widget, () => endD(event));
mousemove(widget, () => D(event));
touchmove(widget, () => D(event));
renderFirstPlace($('#canvas-container'), widget);