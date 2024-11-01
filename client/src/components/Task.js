function Task() {
    mobiscroll.setOptions({
        theme: 'ios',
        themeVariant: 'light',
      });
      
      var inst = mobiscroll.eventcalendar('#demo-daily-agenda', {
        view: {
          calendar: { type: 'week' },
          agenda: { type: 'day' },
        },
        onEventClick: function (args) {
          mobiscroll.toast({
            message: args.event.title,
          });
        },
      });
      
      mobiscroll.getJson(
        'https://trial.mobiscroll.com/events/?vers=5',
        function (events) {
          inst.setEvents(events);
        },
        'jsonp',
      );
}

export default Task;