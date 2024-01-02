const navSlider = (target, direction, length) => {
    css($('layout'), "cursor:pointer");
    if (direction == "width") {
        let isSliding = false;
        const onStart = evt => {
            if (evt.touches) {
                evt = evt.touches[0];
            }
            attrib(target, 'draggable', false);
            isSliding = evt.clientX <= screen.width * (1 / 64) ? true : target.style.width == `${length}%` ? true : false;
        };
        const onEnd = evt => {
            if (evt.touches) {
                evt = evt.touches[0];
            }
            isSliding = false;
            if (target.style.width <= `${length * (1/2)}%`) {
                css(target, `${direction}: 0`);
            } else {
                css(target, `${direction}: ${length}%`);
            }
        };
        const onMove = evt => {
            if (evt.touches) {
                evt = evt.touches[0];
            }
            if (!isSliding) {
                return;
            }
            $('nav').style.transition = ".3s";
            attrib(target, 'draggable', false);
            if (evt.clientX * (length / 100) > length) {
                css(target, `${direction}: ${length}%`);
            } else {
                css(target, `${direction}: ${evt.clientX * (length/100)}%`);
            }
        };
        mousedown($('body'), () => onStart(event));
        touchstart($('body'), () => onStart(event));
        mouseup($('body'), () => onEnd(event));
        touchend($('body'), () => onEnd(event));
        mousemove($('body'), () => onMove(event));
        touchmove($('body'), () => onMove(event));
    }
    else if (direction == "height") {
        let isSliding = false;
        const onStart = evt => {
            if (evt.touches) {
                evt = evt.touches[0];
            }
            attrib(target, 'draggable', false);
            isSliding = evt.clientY <= screen.height * (1 / 64) ? true : target.style.height == `${length}%` ? true : false;
        };
        const onEnd = evt => {
            if (evt.touches) {
                evt = evt.touches[0];
            }
            isSliding = false;
            if (target.style.height <= `${length * (1/2)}%`) {
                css(target, `${direction}: 0`);
            } else {
                css(target, `${direction}: ${length}%`);
            }
        };
        const onMove = evt => {
            if (evt.touches) {
                evt = evt.touches[0];
            }
            if (!isSliding) {
                return;
            }
            $('nav').style.transition = ".3s";
            attrib(target, 'draggable', false);
            if (evt.clientY * (length / 100) > length) {
                css(target, `${direction}: ${length}%`);
            } else {
                css(target, `${direction}: ${evt.clientY * (length/100)}%`);
            }
        };
        mousedown($('body'), () => onStart(event));
        touchstart($('body'), () => onStart(event));
        mouseup($('body'), () => onEnd(event));
        touchend($('body'), () => onEnd(event));
        mousemove($('body'), () => onMove(event));
        touchmove($('body'), () => onMove(event));
    }
};