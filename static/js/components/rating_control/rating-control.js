/**
 * Created by kozhuhds on 11/20/14.
 */

Polymer('rating-control', {
    ready: function() {
        var count = 5;


        if ( localStorage && !localStorage.getItem('stars') ) {
            this.stars = [];

            for (var i = 1; i <= count; i++) {
                this.stars.push({
                    activeClass: false,
                    number: i
                });
            }

            this.save();
        } else{
            this.stars = JSON.parse(localStorage.getItem('stars'))
        }

    },

    save: function () {
        localStorage.setItem('stars', JSON.stringify(this.stars));
    },

    onHovered: function (e, detail, target) {
        var number = target.attributes['data-number'].value;

        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].activeClass = false;
        }

        for(var i = number-1; i >= 0 ; i--) {
            this.stars[i].activeClass = true;
        }
    },


    onParentUnhovered: function (event, detail, target){
        var e = event.toElement || event.relatedTarget;

        //check for all children levels (checking from bottom up)
        while(e && e.parentNode && e.parentNode != window) {
            if (e.parentNode == target ||  e == target) {
                if(e.preventDefault) e.preventDefault();
                return false;
            }
            e = e.parentNode;
        }
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].activeClass = false;
        }
    },

    setRating: function (event, detail, target){
        var number = target.attributes['data-number'].value;

        event.preventDefault();

        for (var i = 1; i < this.stars.length; i++) {
            this.stars[i].markedClass = false;
        }

        if ( number == 1 ) {
            this.stars[number-1].markedClass = !this.stars[number-1].markedClass
            return
        }


        for(var i = number-1; i >= 0 ; i--) {
            this.stars[i].markedClass = true;
        }

        this.save();

    }


});