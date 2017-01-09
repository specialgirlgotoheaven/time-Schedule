/**
 * Created by weie on 2016/12/27.
 */
if (typeof jQuery === 'undefined') {
    throw new Error('TimeSchedule\'s JavaScript requires jQuery')
}
(function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 2 && version[1] < 6) || (version[0] == 1 && version[1] == 6 && version[2] < 1)) {
        throw new Error('TimeSchedule\'s JavaScript requires jQuery version 1.6.1 or higher');
    }
}(jQuery));
(function($){
    var TimeSlider = function(element, options){
        this.static_date_string="2016-12-19 12:00:00",
        this.static_date = "2016-12-19";
        this.$element = null;
        this.$ruler = null;
        this.$prompts = null;
        this.options = null;
        this.init_timestamp = new Date(this.static_date_string);//初始化时间戳,获取当前时间点
        this.frozen_current_timestamp = 0;
        this.px_per_ms = 1;
        this.is_mouse_down_left = false;
        this.clicked_on = null;
        this.prev_cursor_x = 0;
        this.time_cell_selected = null;
        this.running_time_cell = null;
        this.time_caret = null;
        this.steps_by_minutes = [1, 2, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440];
        this.gt_height = 0;
        this.draw_new_timecell_obj = null,
        this.draw_new_timecell_mousedown = null,
        this.dialogInputValueObj = {},
        this.minute_per_graduation=null,
        this.init(element, options);
        return this;
    };
    TimeSlider.DEFAULTS = {
        start_timestamp: (new Date("2016-12-19 00:00:00")).getTime(),   // left border //(new Date(this.static_date_string)).getTime()
        current_timestamp: (new Date(this.static_date_string)).getTime(), // current timestamp
        hours_per_ruler: 24,                    //一把尺子上有几个小时 length of graduation ruler in hours (min 1, max 48)
        graduation_step: 10,                    //每一小格多少分钟 minimum pixels between graduations
        distance_between_gtitle: 50,            //刻度间间隔 minimum pixels between titles of graduations
        update_timestamp_interval: 1000,        // 时间同步时间间隔 interval for updating current time
        update_interval: 1000,                  // interval for updating elements
        show_ms: false,                         //是否显示微秒 whether to show the milliseconds?
        show_time_cursor:true,                  //是否显示当前时间的红色游标
        init_cells: null,                       //list of time cells or function
        ruler_enable_move: true,
        timecell_enable_move: true,
        timecell_enable_resize: true,
        on_add_timecell_callback: null,
        on_toggle_timecell_callback: null,
        on_remove_timecell_callback: null,
        on_remove_all_timecells_callback: null,
        on_dblclick_timecell_callback: null,
        on_move_timecell_callback: null,
        on_resize_timecell_callback: null,
        on_change_timecell_callback: null,
        on_dblclick_ruler_callback: null,
        on_move_ruler_callback: null,
        on_change_ruler_callback: null,
        draw_new_timecell_flag:null,
        draw_new_timecell_start_x:null,
        static_time:24,//固定24小时
    };
    TimeSlider.prototype.init = function(element, options) {
        this.$element = $(element);
        this.$element.append('<div class="graduation-title" style="display:none">init</div>');
        this.gt_height = this.$element.find('.graduation-title').height();
        this.$element.find('.graduation-title').remove();
        this.$element.append(
            '<div class="ruler" style="height:' + (this.$element.height() + this.gt_height) + 'px;"></div>' +
            '<div class="prompts" style="top:-' + (this.$element.height() * 2 + this.gt_height) + 'px;"></div>'
        );
        this.$element.height(this.$element.height() + this.gt_height);
        this.$ruler = this.$element.find('.ruler');
        this.$prompts = this.$element.find('.prompts');

        if (this.$element.attr('start_timestamp')) {
            options['start_timestamp'] = parseInt(this.$element.attr('start_timestamp'));
        }
        if (this.$element.attr('current_timestamp')) {
            this.frozen_current_timestamp = options['current_timestamp'] = parseInt(this.$element.attr('current_timestamp'));
        }
        this.options = this.get_options(options);

        this.px_per_ms = this.$element.width() / (this.options.hours_per_ruler * 3600 * 1000);

        // append background color and event layout
        this.$ruler.append(
            '<div class="bg"></div>' +
            '<div class="bg-event' + (this.options.ruler_enable_move ? '' : 'disable-move') + '"></div>'
        );
        this.add_graduations();
        
        //this.px_per_graduation = this.minute_per_graduation * 60 * 1000 * this.px_per_ms;
/*        if(this.options.show_time_cursor){
            this.add_time_caret();
        }*/

        if (this.options.init_cells) {
            if (typeof this.options.init_cells == 'function') {
                this.options.init_cells.bind(this).call();
            }
            else {
                this.add_cells(this.options.init_cells);
            }
        }
        this.add_events();

    };

})(jQuery);