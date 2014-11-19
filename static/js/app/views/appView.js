/**
 * Created by kozhuhds on 11/19/14.
 */
var gtd = gtd || {};
gtd.app.views.appView = (function () {
    var init;

    init = function () {

        var appView = new gtd.View({
            template: $('#appView').html(),
            elem: 'div',
            url: '/gtd_taucraft/static/js/app/data/data.json',
            events: function ( $view ) {
                $view.find('.card').dragable({
                    dropClass: '.gtd-columns__item',
                    onDrop: function ($cont, $item) {
                        var id = $item.attr('data-id'),
                            oldSection = $item.attr('data-section'),
                            currSection = $cont.attr('data-section')
                        data = appView.model.get('data'),
                            record = null;

                        data[oldSection] = _.filter(data[oldSection], function (item) {
                            if ( item.id == id ) {
                                record = item;
                            }
                            return item.id != id;
                        });

                        data[currSection].push(record);

                        appView.model.set('data', data);
                        appView.save();
                    }
                });

                $view.find('.card-delete__btn').on('click', function (e) {
                    var id = $(this).parents('.card').attr('data-id'),
                        section = $(this).parents('.card').attr('data-section'),
                        data = appView.model.get('data');

                    data[section] = _.filter(data[section], function (item) {
                        return item.id != id;
                    });

                    $(this).parents('.card').fadeOut(function () {
                        appView.model.set('data', data);
                        appView.save();

                    });
                    e.preventDefault();
                    e.stopPropagation();

                });

                var changeEditing = function (value, e) {
                    e.preventDefault();

                    var id = $(this).parents('.card').attr('data-id'),
                        section = $(this).parents('.card').attr('data-section'),
                        data = appView.model.get('data');

                    _.each(data[section], function (val, key) {
                        if ( val.id == id ) {
                            data[section][key].isEditing = value;
                            return false;
                        }
                    });

                    appView.model.set('data', data);

                };

                $view.find('.card-edit__btn').on('click', function (e) {
                    changeEditing.call(this, true, e);
                    e.stopPropagation();
                });

                $view.find('.add-task-popup__cancel').on('click', function (e) {
                    changeEditing.call(this, false, e);
                    e.stopPropagation();
                });


                $view.find('.add-task-popup__btn').on('click', function (e) {
                    var $card = $(this).parents('.card'),
                        id = $card.attr('data-id'),
                        section = $card.attr('data-section'),
                        data = appView.model.get('data');

                    _.each(data[section], function (val, key) {
                        if ( val.id == id ) {
                            data[section][key] = {
                                id: id,
                                text: $card.find('.card-edit__text').val(),
                                type: $card.find('.task-type-control').val()
                            };
                            return false;
                        }
                    });
                    appView.model.set('data', data);
                    appView.save();
                    e.stopPropagation();

                });




            }
        });

        appView.fetch();

        appView.$view.appendTo('#appContainer');


        var taskPopup = new gtd.popup({
            $btn: $('.add-card-btn'),
            closeBtn: '.add-task-popup__cancel',
            $popup: $($('#addTaskPopup').html()),
            events: function ( $popup ) {
                $popup.on('click', '.add-task-popup__btn', function () {
                    if ( $popup.find('.add-task-popup__text').val().trim() === '' ) {
                        return false
                    }
                    var data = appView.model.get('data');

                    data.todo.push({
                        "text": $popup.find('.add-task-popup__text').val(),
                        "type": $popup.find('#task-type-control').val(),
                        "id": generateID()
                    });

                    appView.model.set('data', data);

                    appView.save();

                    $popup.find('.add-task-popup__text').val('');
                    $popup.find('#task-type-control').val(0);

                    $popup.fadeOut();

                });
            }
        });

        taskPopup.init();

    };
    return {
        init: init
    }
})();