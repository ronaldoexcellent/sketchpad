importStylesheets(["css/root.css"]);
navSlider($('nav'), "width", 80);
click($('.opennav'), () => css($('nav'), 'width:80%'));
var closenav = () => css($('nav'), 'width:0');
click($('.closenav'), () => closenav());
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
let changeTool = tool => {html($('.tool-ID'), tool), closenav()};
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
let drawTxt = (e) => {
    $text = val($('.text-to-draw')),
    $fontStyle = '',
    $fontWeight = '',
    $fontSize = val($('.font-size')) + 'px';
    $fontFamily = html($('.font-family [selected]'));
    alert(html($('.font-family [selected]')));
    ($('.italic').checked) ? $fontStyle = "italic" : $fontStyle = "";
    ($('.bold').checked) ? $fontWeight = "bolder" : $fontWeight = "";
    changeCursor("text"), ctx.font = $fontStyle + ' ' + $fontWeight + ' ' + $fontSize + ' ' + $fontFamily;
    $('.text-fill').checked ? ctx.fillText($text, $offsetX, $offsetY) : ctx.strokeText($text, $offsetX, $offsetY);
};
click($('#rectangle'), () => changeTool('Rectangle'));
click($('#circle'), () => changeTool('Circle'));
click($('#triangle'), () => changeTool('Triangle'));
click($('#text'), () => {closenav(); addClass($('#text-controls'), 's-show')});
submit($('#text-controls form'), () => {
    changeTool('Text');
    removeClass($('#text-controls'), 's-show');
});
click($('.cls-text-controls'), () => removeClass($('#text-controls'), 's-show'));
click($$('.tools button')[0], () => {changeCursor('pointer'); changeTool("Pen")});
click($$('.tools button')[1], () => {changeCursor('pointer'); changeTool("Eraser")});
var startD = e => {
    e.preventDefault(), deviceActivation(e);
    if (e.touches) {
        e = e.touches[0];
    }
    closenav();
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
    } else if ($tool === "Text") {
        drawTxt(e);
    } else {
        return null;
    }
};
click($clear, () => ctx.clearRect(0, 0, $width, $height));
click($save, () => addClass($('#save-data'), 's-show'));
submit($('#save-data form'), () => {
    removeClass($('#save-data'), 's-show');
    alert('Saved');
    ctx.fillStyle = $('#BG').style.backgroundColor;
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillRect(0, 0, $width, $height);
    var sName = val($('.yName'));
    var sType = "";
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