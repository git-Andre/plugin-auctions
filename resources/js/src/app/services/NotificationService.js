module.exports = (function($)
{

    var notificationCount = 0;
    var notifications     = new NotificationList();

    var handlerList     = [];
    // var printStackTrace = true;

    return {
        log: _log,
        info: _info,
        warn: _warn,
        error: _error,
        success: _success,
        getNotifications: getNotifications,
        listen: _listen
    };

    function _listen(handler)
{
        handlerList.push(handler);
    }

    function trigger()
{
        for (var i = 0; i < handlerList.length; i++)
{
            handlerList[i].call({}, notifications.all());
        }
    }

    function _log(message, prefix)
{
        var notification = new Notification(message);

        console.log((prefix || "") + "[" + notification.code + "] " + notification.message);

        for (var i = 0; i < notification.stackTrace.length; i++)
{
            _log(notification.stackTrace[i], " + ");
        }

        return notification;
    }

    function _info(message)
{
        var notification = new Notification(message, "info");

        _printNotification(notification);

        return notification;
    }

    function _warn(message)
{
        var notification = new Notification(message, "warning");

        _printNotification(notification);

        return notification;
    }

    function _error(message)
{
        var notification = new Notification(message, "danger");

        _printNotification(notification);

        return notification;
    }

    function _success(message)
{
        var notification = new Notification(message, "success");

        _printNotification(notification);

        return notification;
    }

    function getNotifications()
{
        return notifications;
    }

    function _printNotification(notification)
{
        notifications.add(notification);
        _log(notification);

        trigger();

        return notification;
    }

    function Notification(data, context)
{
        if (!this.printStackTrace && typeof (data) === "object")
{
            data.stackTrace = [];
        }
        var id   = notificationCount++;
        var self = {
            id: id,
            code: data.code || null,
            message: data.message || data || "",
            context: context || "info",
            stackTrace: data.stackTrace || [],
            close: close,
            closeAfter: closeAfter,
            trace: trace
        };

        return self;

        function close()
{
            notifications.remove(self);
            trigger();
        }

        function closeAfter(timeout)
{
            setTimeout(function()
{
                notifications.remove(self);
                trigger();
            }, timeout);
        }

        function trace(message, code)
{
            if (this.printStackTrace)
{
                self.stackTrace.push({
                    code: code || 0,
                    message: message
                });
            }
        }
    }

    function NotificationList()
{
        var elements = [];

        return {
            all: all,
            add: add,
            remove: remove
        };

        function all()
{
            return elements;
        }

        function add(notification)
{
            elements.push(notification);
        }

        function remove(notification)
{
            for (var i = 0; i < elements.length; i++)
{
                if (elements[i].id === notification.id)
{
                    elements.splice(i, 1);
                    break;
                }
            }
        }
    }

})(jQuery);
