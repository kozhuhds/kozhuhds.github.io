/**
 * Created by kozhuhds on 11/18/14.
 */

(function( $ ) {
    var Draggable = function ( $elem, opts ) {
        $elem.on('mousedown', function ( e ) {
            if( e.target.nodeName === 'TEXTAREA' || e.target.nodeName === 'SELECT' ) {
                return true;
            }
            var notHasEvent = $._data( e.target, 'events') ?  !$._data( e.target, 'events').click : true;

            if ( notHasEvent ) {
                var $clone = $elem.clone(),
                    dx = e.clientX - $elem.offset().left,
                    dy = e.clientY - $elem.offset().top;

                $(document).on('mousemove', function ( e ) {
                    $elem.css('visibility', 'hidden');

                    $clone.css({
                        position: 'absolute',
                        left: e.clientX - dx,
                        top: e.clientY - dy,
                        width: $elem.outerWidth(),
                        cursor: 'default',
                        'z-index': 9999,
                        '-moz-transform': 'rotate(1deg)',
                        '-ms-transform': 'rotate(1deg)',
                        '-webkit-transform': 'rotate(1deg)',
                        '-o-transform': 'rotate(1deg)',
                        'transform': 'rotate(1deg)'
                    });

                    $clone.insertAfter($elem);
                });

                $(document).on('mouseup', function ( e ) {
                    $(opts.dropClass).each(function (key, item) {
                        var bounds = item.getBoundingClientRect(),
                            clx = e.clientX,
                            cly = e.clientY;

                        if ( clx >= bounds.left && clx <= bounds.right && cly <= bounds.bottom && cly >= bounds.top ) {
                            opts.onDrop && opts.onDrop( $(item), $clone);
                            return false;
                        }

                    });

                    $clone.remove();
                    $elem.css('visibility', 'visible');
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    e.stopPropagation();
                });
            }


        });
    };

    $.fn.dragable = function( opts ) {

        this.each(function (key, item) {
            new Draggable($(item), opts);
        });

        $(document).on('selectstart', function ( e ) {
            e.preventDefault();
        });

        return this;
    };

})(jQuery);