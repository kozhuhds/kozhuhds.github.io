/**
 * Created by kozhuhds on 11/18/14.
 */

var gtd = gtd || {};

gtd.View = function (opts) {
    this.template = opts.template,
    this.$view = $(document.createElement(opts.elem));
    this.model = new gtd.Model( this );
    this.url = opts.url;
    this.events = opts.events;
    opts.events( this.$view );
};

gtd.View.prototype = {
    fetch: function ( cb ) {
        var self = this;

        if ( !localStorage.getItem('data') ) {
            $.ajax({
                type: 'GET',
                url: self.url,
                dataType: 'json',
                success: function ( resp ) {
                    self.model.set('data', resp);
                    cb && cb();
                }
            });
        } else {
            self.model.set('data', JSON.parse(localStorage.getItem('data')));
        }

    },

    save: function () {
        localStorage.setItem('data', JSON.stringify(this.model.get('data')));
    },

    render: function () {
        var compiled = _.template(this.template),
            self = this;

        this.$view.html(compiled(this.model));

        setTimeout(function () {
            self.events( self.$view );
        }, 0);


    }
};