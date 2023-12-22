// Samples ============================

// Button Component
if ($('myBtn')) {
    loopX($$('myBtn'), () => {
        widgets.construct('button');
        html(widget, 'Click Me'), css(widget, 'padding: 3%; color: white; background: blue; font-weight: 800;'), click(widget, () => alert('hello'));
        render(i, widget);
    }); // Add <myBtn></myBtn> element to your web page and preview to see the result.
}