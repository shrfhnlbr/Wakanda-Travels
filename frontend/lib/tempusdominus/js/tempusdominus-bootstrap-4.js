/* Preserve Comment */

(function ($, moment) {
  'use strict';

  // Check for required dependencies
  function checkDependencies() {
    if (typeof jQuery === 'undefined') {
      throw new Error('Tempus Dominus Bootstrap4\'s requires jQuery. jQuery must be included before Tempus Dominus Bootstrap4\'s JavaScript.');
    }

    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 2 && version[1] < 9) || (version[0] === 1 && version[1] === 9 && version[2] < 1) || (version[0] >= 4)) {
      throw new Error('Tempus Dominus Bootstrap4\'s requires at least jQuery v3.0.0 but less than v4.0.0');
    }

    if (typeof moment === 'undefined') {
      throw new Error('Tempus Dominus Bootstrap4\'s requires moment.js. Moment.js must be included before Tempus Dominus Bootstrap4\'s JavaScript.');
    }

    var momentVersion = moment.version.split('.');
    if ((momentVersion[0] <= 2 && momentVersion[1] < 17) || (momentVersion[0] >= 3)) {
      throw new Error('Tempus Dominus Bootstrap4\'s requires at least moment.js v2.17.0 but less than v3.0.0');
    }
  }

  // DateTimePicker class definition
  var DateTimePicker = function (element, options) {
    this._element = element;
    this._options = this._getOptions(options);
    this._dates = [];
    this._datesFormatted = [];
    this._viewDate = null;
    this.unset = true;
    this.component = false;
    this.widget = false;
    this.use24Hours = null;
    this.actualFormat = null;
    this.parseFormats = null;
    this.currentViewMode = null;
    this.MinViewModeNumber = 0;

    this._init();
  };

  // DateTimePicker prototype methods
  DateTimePicker.prototype = {
    constructor: DateTimePicker,

    _init: function () {
      this._checkDependencies();
      // Other initialization code...
    },

    _checkDependencies: function () {
      checkDependencies();
    },

    // Add other methods...
  };

  // jQuery plugin definition
  $.fn.datetimepicker = function (options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data(DATA_KEY);

      if (!data) {
        $this.data(DATA_KEY, (data = new DateTimePicker(this, options)));
      }

      if (typeof options === 'string') {
        if (typeof data[options] === 'undefined') {
          throw new Error('Unknown method: ' + options);
        }
        data[options]();
      }
    });
  };

})(jQuery, moment);

//noinspection JSMethodCanBeStatic

DateTimePicker.prototype._getOptions = function _getOptions(options) {
  return $.extend(true, {}, Default, options);
};

DateTimePicker.prototype._hasTimeZone = function _hasTimeZone() {
  return moment.tz !== undefined && this._options.timeZone !== undefined && this._options.timeZone !== null && this._options.timeZone !== '';
};

DateTimePicker.prototype._isEnabled = function _isEnabled(granularity) {
  if (typeof granularity !== 'string' || granularity.length > 1) {
    throw new TypeError('isEnabled expects a single character string parameter');
  }

  switch (granularity) {
    case 'y':
      return this.actualFormat.indexOf('Y') !== -1;
    case 'M':
      return this.actualFormat.indexOf('M') !== -1;
    case 'd':
      return this.actualFormat.toLowerCase().indexOf('d') !== -1;
    case 'h':
    case 'H':
      return this.actualFormat.toLowerCase().indexOf('h') !== -1;
    case 'm':
      return this.actualFormat.indexOf('m') !== -1;
    case 's':
      return this.actualFormat.indexOf('s') !== -1;
    case 'a':
    case 'A':
      return this.actualFormat.toLowerCase().indexOf('a') !== -1;
    default:
      return false;
  }
};

DateTimePicker.prototype._hasTime = function _hasTime() {
  return this._isEnabled('h') || this._isEnabled('m') || this._isEnabled('s');
};

DateTimePicker.prototype._hasDate = function _hasDate() {
  return this._isEnabled('y') || this._isEnabled('M') || this._isEnabled('d');
};

DateTimePicker.prototype._dataToOptions = function _dataToOptions() {
  var eData = this._element.data();
  var dataOptions = {};

  if (eData.dateOptions && eData.dateOptions instanceof Object) {
    dataOptions = $.extend(true, dataOptions, eData.dateOptions);
  }

  $.each(this._options, function (key) {
    var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);

    if (eData[attributeName] !== undefined) {
      dataOptions[key] = eData[attributeName];
    } else {
      delete dataOptions[key];
    }
  });

  return dataOptions;
};

DateTimePicker.prototype._notifyEvent = function _notifyEvent(e) {
  if (e.type === DateTimePicker.Event.CHANGE && (e.date && e.date.isSame(e.oldDate)) || !e.date && !e.oldDate) {
    return;
  }

  this._element.trigger(e);
};

DateTimePicker.prototype._viewUpdate = function _viewUpdate(e) {
  if (e === 'y') {
    e = 'YYYY';
  }

  this._notifyEvent({
    type: DateTimePicker.Event.UPDATE,
    change: e,
    viewDate: this._viewDate.clone()
  });
};

DateTimePicker.prototype._showMode = function _showMode(dir) {
  if (!this.widget) {
    return;
  }

  if (dir) {
    this.currentViewMode = Math.max(this.MinViewModeNumber, Math.min(3, this.currentViewMode + dir));
  }

  this.widget.find('.datepicker > div').hide().filter('.datepicker-' + DatePickerModes[this.currentViewMode].CLASS_NAME).show();
};

DateTimePicker.prototype._isInDisabledDates = function _isInDisabledDates(testDate) {
  return this._options.disabledDates[testDate.format('YYYY-MM-DD')] === true;
};

DateTimePicker.prototype._isInEnabledDates = function _isInEnabledDates(testDate) {
  return this._options.enabledDates[testDate.format('YYYY-MM-DD')] === true;
};

DateTimePicker.prototype._isInDisabledHours = function _isInDisabledHours(testDate) {
  return this._options.disabledHours[testDate.format('H')] === true;
};

DateTimePicker.prototype._isInEnabledHours = function _isInEnabledHours(testDate) {
  return this._options.enabledHours[testDate.format('H')] === true;
};

DateTimePicker.prototype._isValid = function _isValid(targetMoment, granularity) {
  if (!targetMoment.isValid()) {
    return false;
  }

  if (this._options.disabledDates && granularity === 'd' && this._isInDisabledDates(targetMoment)) {
    return false;
  }

  if (this._options.enabledDates && granularity === 'd' && !this._isInEnabledDates(targetMoment)) {
    return false;
  }

  if (this._options.minDate && targetMoment.isBefore(this._options.minDate, granularity)) {
    return false;
  }

  if (this._options.maxDate && targetMoment.isAfter(this._options.maxDate, granularity)) {
    return false;
  }

  if (this._options.daysOfWeekDisabled && granularity === 'd' && this._options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
    return false;
  }

  if (this._options.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && this._isInDisabledHours(targetMoment)) {
    return false;
  }

  if (this._options.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !this._isInEnabledHours(targetMoment)) {
    return false;
  }

  if (this._options.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
    var found = false;

    $.each(this._options.disabledTimeIntervals, function () {
      if (targetMoment.isBetween(this[0], this[1])) {
        found = true;
        return false;
      }
    });

    if (found) {
      return false;
    }
  }

  return true;
};

DateTimePicker.prototype._parseInputDate = function _parseInputDate(inputDate) {
  if (this._options.parseInputDate === undefined) {
    if (!moment.isMoment(inputDate)) {
      inputDate = this.getMoment(inputDate);
    }
  } else {
    inputDate = this._options.parseInputDate(inputDate);
  }

  return inputDate;
};

DateTimePicker.prototype._keydown = function _keydown(e) {
  var handler = null,
    index = void 0,
    index2 = void 0,
    keyBindKeys = void 0,
    allModifiersPressed = void 0;
  var pressedKeys = [],
    pressedModifiers = {},
    currentKey = e.which,
    pressed = 'p';

  keyState[currentKey] = pressed;

  for (index in keyState) {
    if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
      pressedKeys.push(index);
      if (parseInt(index, 10) !== currentKey) {
        pressedModifiers[index] = true;
      }
    }
  }

  for (index in this._options.keyBinds) {
    if (this._options.keyBinds.hasOwnProperty(index) && typeof this._options.keyBinds[index] === 'function') {
      keyBindKeys = index.split(' ');

      if (keyBindKeys.length === pressedKeys.length && KeyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
        allModifiersPressed = true;

        for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
          if (!(KeyMap[keyBindKeys[index2]] in pressedModifiers)) {
            allModifiersPressed = false;
            break;
          }
        }

        if (allModifiersPressed) {
          handler = this._options.keyBinds[index];
          break;
        }
      }
    }
  }

  if (handler) {
    if (handler.call(this)) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
};

//noinspection JSMethodCanBeStatic,SpellCheckingInspection

DateTimePicker.prototype._keyup = function _keyup(e) {
    keyState[e.which] = 'r';
    if (keyPressHandled[e.which]) {
        keyPressHandled[e.which] = false;
        e.stopPropagation();
        e.preventDefault();
    }
};

DateTimePicker.prototype._indexGivenItems = function _indexGivenItems(givenArray, keyFormatter) {
    var indexedItems = {};
    var self = this;
    $.each(givenArray, function () {
        var item = self._parseInputDate(this);
        if (item.isValid()) {
            indexedItems[keyFormatter(item)] = true;
        }
    });
    return Object.keys(indexedItems).length ? indexedItems : false;
};

DateTimePicker.prototype._indexGivenDates = function _indexGivenDates(givenDatesArray) {
    return this._indexGivenItems(givenDatesArray, function (date) {
        return date.format('YYYY-MM-DD');
    });
};

DateTimePicker.prototype._indexGivenHours = function _indexGivenHours(givenHoursArray) {
    return this._indexGivenItems(givenHoursArray, function (hour) {
        return hour;
    });
};

DateTimePicker.prototype._initFormatting = function _initFormatting() {
    var format = this._options.format || 'L LT';
    var self = this;

    this.actualFormat = format.replace(/(\[[^\[]*])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
        return self._dates[0].localeData().longDateFormat(formatInput) || formatInput;
    });

    this.parseFormats = this._options.extraFormats ? this._options.extraFormats.slice() : [];
    if (!this.parseFormats.includes(format) && !this.parseFormats.includes(this.actualFormat)) {
        this.parseFormats.push(this.actualFormat);
    }

    this.use24Hours = this.actualFormat.toLowerCase().indexOf('a') < 1 && this.actualFormat.replace(/\[.*?]/g, '').indexOf('h') < 1;

    this.MinViewModeNumber = this._isEnabled('y') ? 2 : (this._isEnabled('M') ? 1 : (this._isEnabled('d') ? 0 : 0));

    this.currentViewMode = Math.max(this.MinViewModeNumber, this.currentViewMode);

    if (!this.unset) {
        this._setValue(this._dates[0], 0);
    }
};

DateTimePicker.prototype._getLastPickedDate = function _getLastPickedDate() {
    return this._dates[this._getLastPickedDateIndex()];
};

DateTimePicker.prototype._getLastPickedDateIndex = function _getLastPickedDateIndex() {
    return this._dates.length - 1;
};

//public

DateTimePicker.prototype.getMoment = function getMoment(d) {
    if (d === undefined || d === null) {
        return moment(); // TODO: Should this use format? and locale?
    }

    var returnMoment;

    if (this._hasTimeZone()) {
        // There is a string to parse and a default time zone
        // parse with the tz function which takes a default time zone if it is not in the format string
        returnMoment = moment.tz(d, this.parseFormats, this._options.locale, this._options.useStrict, this._options.timeZone);
    } else {
        returnMoment = moment(d, this.parseFormats, this._options.locale, this._options.useStrict);
    }

    if (this._hasTimeZone()) {
        returnMoment.tz(this._options.timeZone);
    }

    return returnMoment;
};

DateTimePicker.prototype.toggle = function toggle() {
    return this.widget ? this.hide() : this.show();
};

DateTimePicker.prototype.ignoreReadonly = function ignoreReadonly(_ignoreReadonly) {
    if (arguments.length === 0) {
        return this._options.ignoreReadonly;
    }

    if (typeof _ignoreReadonly !== 'boolean') {
        throw new TypeError('ignoreReadonly() expects a boolean parameter');
    }

    this._options.ignoreReadonly = _ignoreReadonly;
};

DateTimePicker.prototype.options = function options(newOptions) {
    if (arguments.length === 0) {
        return $.extend(true, {}, this._options);
    }

    if (!(newOptions instanceof Object)) {
        throw new TypeError('options() expects an object parameter');
    }

    $.extend(true, this._options, newOptions);
    var self = this;
    
    $.each(this._options, function (key, value) {
        if (self[key] !== undefined) {
            self[key](value);
        }
    });
};

DateTimePicker.prototype.date = function date(newDate, index) {
    index = index || 0;

    if (arguments.length === 0) {
        if (this.unset) {
            return null;
        }

        if (this._options.allowMultidate) {
            return this._dates.join(this._options.multidateSeparator);
        } else {
            return this._dates[index].clone();
        }
    }

    if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
        throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
    }

    this._setValue(newDate === null ? null : this._parseInputDate(newDate), index);
};

DateTimePicker.prototype.format = function format(newFormat) {
    if (arguments.length === 0) {
        return this._options.format;
    }

    if (typeof newFormat !== 'string' && (typeof newFormat !== 'boolean' || newFormat !== false)) {
        throw new TypeError('format() expects a string or boolean:false parameter ' + newFormat);
    }

    this._options.format = newFormat;
    if (this.actualFormat) {
        this._initFormatting(); // reinitialize formatting
    }
};

DateTimePicker.prototype.timeZone = function timeZone(newZone) {
    if (arguments.length === 0) {
        return this._options.timeZone;
    }

    if (typeof newZone !== 'string') {
        throw new TypeError('timeZone() expects a string parameter');
    }

    this._options.timeZone = newZone;
};

DateTimePicker.prototype.dayViewHeaderFormat = function dayViewHeaderFormat(newFormat) {
    if (arguments.length === 0) {
        return this._options.dayViewHeaderFormat;
    }

    if (typeof newFormat !== 'string') {
        throw new TypeError('dayViewHeaderFormat() expects a string parameter');
    }

    this._options.dayViewHeaderFormat = newFormat;
};

DateTimePicker.prototype.extraFormats = function extraFormats(formats) {
    if (arguments.length === 0) {
        return this._options.extraFormats;
    }

    if (formats !== false && !(formats instanceof Array)) {
        throw new TypeError('extraFormats() expects an array or false parameter');
    }

    this._options.extraFormats = formats;
    if (this.parseFormats) {
        this._initFormatting(); // reinit formatting
    }
};

DateTimePicker.prototype.disabledDates = function disabledDates(dates) {
    if (arguments.length === 0) {
        return this._options.disabledDates ? $.extend({}, this._options.disabledDates) : this._options.disabledDates;
    }

    if (!dates) {
        this._options.disabledDates = false;
        this._update();
        return true;
    }

    if (!(dates instanceof Array)) {
        throw new TypeError('disabledDates() expects an array parameter');
    }

    this._options.disabledDates = this._indexGivenDates(dates);
    this._options.enabledDates = false;
    this._update();
};

DateTimePicker.prototype.enabledDates = function enabledDates(dates) {
    if (arguments.length === 0) {
        return this._options.enabledDates ? $.extend({}, this._options.enabledDates) : this._options.enabledDates;
    }

    if (!dates) {
        this._options.enabledDates = false;
        this._update();
        return true;
    }

    if (!(dates instanceof Array)) {
        throw new TypeError('enabledDates() expects an array parameter');
    }

    this._options.enabledDates = this._indexGivenDates(dates);
    this._options.disabledDates = false;
    this._update();
};

DateTimePicker.prototype.daysOfWeekDisabled = function daysOfWeekDisabled(_daysOfWeekDisabled) {
    if (arguments.length === 0) {
        return this._options.daysOfWeekDisabled.slice(0);
    }

    if (typeof _daysOfWeekDisabled === 'boolean' && !_daysOfWeekDisabled) {
        this._options.daysOfWeekDisabled = false;
        this._update();
        return true;
    }

    if (!(_daysOfWeekDisabled instanceof Array)) {
        throw new TypeError('daysOfWeekDisabled() expects an array parameter');
    }

    this._options.daysOfWeekDisabled = _daysOfWeekDisabled.reduce(function (previousValue, currentValue) {
        currentValue = parseInt(currentValue, 10);

        if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
            return previousValue;
        }

        if (previousValue.indexOf(currentValue) === -1) {
            previousValue.push(currentValue);
        }

        return previousValue;
    }, []).sort();

    if (this._options.useCurrent && !this._options.keepInvalid) {
        for (var i = 0; i < this._dates.length; i++) {
            var tries = 0;

            while (!this._isValid(this._dates[i], 'd')) {
                this._dates[i].add(1, 'd');

                if (tries === 31) {
                    throw 'Tried 31 times to find a valid date';
                }

                tries++;
            }

            this._setValue(this._dates[i], i);
        }
    }

    this._update();
};

DateTimePicker.prototype.maxDate = function maxDate(_maxDate) {
    if (arguments.length === 0) {
        return this._options.maxDate ? this._options.maxDate.clone() : this._options.maxDate;
    }

    if (typeof _maxDate === 'boolean' && _maxDate === false) {
        this._options.maxDate = false;
        this._update();
        return true;
    }

    if (typeof _maxDate === 'string') {
        if (_maxDate === 'now' || _maxDate === 'moment') {
            _maxDate = this.getMoment();
        }
    }

    var parsedDate = this._parseInputDate(_maxDate);

    if (!parsedDate.isValid()) {
        throw new TypeError('maxDate() Could not parse date parameter: ' + _maxDate);
    }

    if (this._options.minDate && parsedDate.isBefore(this._options.minDate)) {
        throw new TypeError('maxDate() date parameter is before this.options.minDate: ' + parsedDate.format(this.actualFormat));
    }

    this._options.maxDate = parsedDate;

    for (var i = 0; i < this._dates.length; i++) {
        if (this._options.useCurrent && !this._options.keepInvalid && this._dates[i].isAfter(_maxDate)) {
            this._setValue(this._options.maxDate, i);
        }
    }

    if (this._viewDate.isAfter(parsedDate)) {
        this._viewDate = parsedDate.clone().subtract(this._options.stepping, 'm');
    }

    this._update();
};

DateTimePicker.prototype.minDate = function minDate(_minDate) {
    if (arguments.length === 0) {
        return this._options.minDate ? this._options.minDate.clone() : this._options.minDate;
    }

    if (typeof _minDate === 'boolean' && _minDate === false) {
        this._options.minDate = false;
        this._update();
        return true;
    }

    if (typeof _minDate === 'string') {
        if (_minDate === 'now' || _minDate === 'moment') {
            _minDate = this.getMoment();
        }
    }

    var parsedDate = this._parseInputDate(_minDate);

    if (!parsedDate.isValid()) {
        throw new TypeError('minDate() Could not parse date parameter: ' + _minDate);
    }

    if (this._options.maxDate && parsedDate.isAfter(this._options.maxDate)) {
        throw new TypeError('minDate() date parameter is after this.options.maxDate: ' + parsedDate.format(this.actualFormat));
    }

    this._options.minDate = parsedDate;

    for (var i = 0; i < this._dates.length; i++) {
        if (this._options.useCurrent && !this._options.keepInvalid && this._dates[i].isBefore(_minDate)) {
            this._setValue(this._options.minDate, i);
        }
    }

    if (this._viewDate.isBefore(parsedDate)) {
        this._viewDate = parsedDate.clone().add(this._options.stepping, 'm');
    }

    this._update();
};

DateTimePicker.prototype.defaultDate = function defaultDate(_defaultDate) {
            if (arguments.length === 0) {
                return this._options.defaultDate ? this._options.defaultDate.clone() : this._options.defaultDate;
            }
            if (!_defaultDate) {
                this._options.defaultDate = false;
                return true;
            }

            if (typeof _defaultDate === 'string') {
                if (_defaultDate === 'now' || _defaultDate === 'moment') {
                    _defaultDate = this.getMoment();
                } else {
                    _defaultDate = this.getMoment(_defaultDate);
                }
            }

            var parsedDate = this._parseInputDate(_defaultDate);
            if (!parsedDate.isValid()) {
                throw new TypeError('defaultDate() Could not parse date parameter: ' + _defaultDate);
            }
            if (!this._isValid(parsedDate)) {
                throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
            }

            this._options.defaultDate = parsedDate;

            if (this._options.defaultDate && this._options.inline || this.input !== undefined && this.input.val().trim() === '') {
                this._setValue(this._options.defaultDate, 0);
            }
        };

        DateTimePicker.prototype.locale = function locale(_locale) {
            if (arguments.length === 0) {
                return this._options.locale;
            }

            if (!moment.localeData(_locale)) {
                throw new TypeError('locale() locale ' + _locale + ' is not loaded from moment locales!');
            }

            this._options.locale = _locale;

            for (var i = 0; i < this._dates.length; i++) {
                this._dates[i].locale(this._options.locale);
            }
            this._viewDate.locale(this._options.locale);

            if (this.actualFormat) {
                this._initFormatting(); // reinitialize formatting
            }
            if (this.widget) {
                this.hide();
                this.show();
            }
        };

        DateTimePicker.prototype.stepping = function stepping(_stepping) {
            if (arguments.length === 0) {
                return this._options.stepping;
            }

            _stepping = parseInt(_stepping, 10);
            if (isNaN(_stepping) || _stepping < 1) {
                _stepping = 1;
            }
            this._options.stepping = _stepping;
        };

        DateTimePicker.prototype.useCurrent = function useCurrent(_useCurrent) {
            var useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
            if (arguments.length === 0) {
                return this._options.useCurrent;
            }

            if (typeof _useCurrent !== 'boolean' && typeof _useCurrent !== 'string') {
                throw new TypeError('useCurrent() expects a boolean or string parameter');
            }
            if (typeof _useCurrent === 'string' && useCurrentOptions.indexOf(_useCurrent.toLowerCase()) === -1) {
                throw new TypeError('useCurrent() expects a string parameter of ' + useCurrentOptions.join(', '));
            }
            this._options.useCurrent = _useCurrent;
        };

        DateTimePicker.prototype.collapse = function collapse(_collapse) {
            if (arguments.length === 0) {
                return this._options.collapse;
            }

            if (typeof _collapse !== 'boolean') {
                throw new TypeError('collapse() expects a boolean parameter');
            }
            if (this._options.collapse === _collapse) {
                return true;
            }
            this._options.collapse = _collapse;
            if (this.widget) {
                this.hide();
                this.show();
            }
        };

        DateTimePicker.prototype.icons = function icons(_icons) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.icons);
            }

            if (!(_icons instanceof Object)) {
                throw new TypeError('icons() expects parameter to be an Object');
            }

            $.extend(this._options.icons, _icons);

            if (this.widget) {
                this.hide();
                this.show();
            }
        };

        DateTimePicker.prototype.tooltips = function tooltips(_tooltips) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.tooltips);
            }

            if (!(_tooltips instanceof Object)) {
                throw new TypeError('tooltips() expects parameter to be an Object');
            }
            $.extend(this._options.tooltips, _tooltips);
            if (this.widget) {
                this.hide();
                this.show();
            }
        };

        DateTimePicker.prototype.useStrict = function useStrict(_useStrict) {
            if (arguments.length === 0) {
                return this._options.useStrict;
            }

            if (typeof _useStrict !== 'boolean') {
                throw new TypeError('useStrict() expects a boolean parameter');
            }
            this._options.useStrict = _useStrict;
        };

        DateTimePicker.prototype.sideBySide = function sideBySide(_sideBySide) {
            if (arguments.length === 0) {
                return this._options.sideBySide;
            }

            if (typeof _sideBySide !== 'boolean') {
                throw new TypeError('sideBySide() expects a boolean parameter');
            }
            this._options.sideBySide = _sideBySide;
            if (this.widget) {
                this.hide();
                this.show();
            }
        };

        DateTimePicker.prototype.viewMode = function viewMode(_viewMode) {
            if (arguments.length === 0) {
                return this._options.viewMode;
            }

            if (typeof _viewMode !== 'string') {
                throw new TypeError('viewMode() expects a string parameter');
            }

            if (DateTimePicker.ViewModes.indexOf(_viewMode) === -1) {
                throw new TypeError('viewMode() parameter must be one of (' + DateTimePicker.ViewModes.join(', ') + ') value');
            }

            this._options.viewMode = _viewMode;
            this.currentViewMode = Math.max(DateTimePicker.ViewModes.indexOf(_viewMode) - 1, this.MinViewModeNumber);

            this._showMode();
        };

        DateTimePicker.prototype.calendarWeeks = function calendarWeeks(_calendarWeeks) {
            if (arguments.length === 0) {
                return this._options.calendarWeeks;
            }

            if (typeof _calendarWeeks !== 'boolean') {
                throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
            }

            this._options.calendarWeeks = _calendarWeeks;
            this._update();
        };

        DateTimePicker.prototype.buttons = function buttons(_buttons) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.buttons);
            }

            if (!(_buttons instanceof Object)) {
                throw new TypeError('buttons() expects parameter to be an Object');
            }

            $.extend(this._options.buttons, _buttons);

            if (typeof this._options.buttons.showToday !== 'boolean') {
                throw new TypeError('buttons.showToday expects a boolean parameter');
            }
            if (typeof this._options.buttons.showClear !== 'boolean') {
                throw new TypeError('buttons.showClear expects a boolean parameter');
            }
            if (typeof this._options.buttons.showClose !== 'boolean') {
                throw new TypeError('buttons.showClose expects a boolean parameter');
            }

            if (this.widget) {
                this.hide();
                this.show();
            }
        };

        DateTimePicker.prototype.keepOpen = function keepOpen(_keepOpen) {
            if (arguments.length === 0) {
                return this._options.keepOpen;
            }

            if (typeof _keepOpen !== 'boolean') {
                throw new TypeError('keepOpen() expects a boolean parameter');
            }

            this._options.keepOpen = _keepOpen;
        };

        DateTimePicker.prototype.focusOnShow = function focusOnShow(_focusOnShow) {
            if (arguments.length === 0) {
                return this._options.focusOnShow;
            }

            if (typeof _focusOnShow !== 'boolean') {
                throw new TypeError('focusOnShow() expects a boolean parameter');
            }

            this._options.focusOnShow = _focusOnShow;
        };

        DateTimePicker.prototype.inline = function inline(_inline) {
            if (arguments.length === 0) {
                return this._options.inline;
            }

            if (typeof _inline !== 'boolean') {
                throw new TypeError('inline() expects a boolean parameter');
            }

            this._options.inline = _inline;
        };

        DateTimePicker.prototype.clear = function clear() {
            this._setValue(null); //todo
        };

        DateTimePicker.prototype.keyBinds = function keyBinds(_keyBinds) {
            if (arguments.length === 0) {
                return this._options.keyBinds;
            }

            this._options.keyBinds = _keyBinds;
        };

DateTimePicker.prototype.debug = function debug(_debug) {
    this._validateBooleanParameter(_debug, 'debug');
    this._options.debug = _debug;
};

DateTimePicker.prototype.allowInputToggle = function allowInputToggle(_allowInputToggle) {
    if (arguments.length === 0) {
        return this._options.allowInputToggle;
    }

    this._validateBooleanParameter(_allowInputToggle, 'allowInputToggle');
    this._options.allowInputToggle = _allowInputToggle;
};

DateTimePicker.prototype.keepInvalid = function keepInvalid(_keepInvalid) {
    if (arguments.length === 0) {
        return this._options.keepInvalid;
    }

    this._validateBooleanParameter(_keepInvalid, 'keepInvalid');
    this._options.keepInvalid = _keepInvalid;
};

DateTimePicker.prototype.datepickerInput = function datepickerInput(_datepickerInput) {
    if (arguments.length === 0) {
        return this._options.datepickerInput;
    }

    this._validateStringParameter(_datepickerInput, 'datepickerInput');
    this._options.datepickerInput = _datepickerInput;
};

DateTimePicker.prototype.parseInputDate = function parseInputDate(_parseInputDate2) {
    if (arguments.length === 0) {
        return this._options.parseInputDate;
    }

    this._validateFunctionParameter(_parseInputDate2, 'parseInputDate');
    this._options.parseInputDate = _parseInputDate2;
};

DateTimePicker.prototype.disabledTimeIntervals = function disabledTimeIntervals(_disabledTimeIntervals) {
    if (arguments.length === 0) {
        return this._getClonedDisabledIntervals('disabledTimeIntervals');
    }

    this._setDisabledIntervals('disabledTimeIntervals', _disabledTimeIntervals);
};

DateTimePicker.prototype.disabledHours = function disabledHours(hours) {
    if (arguments.length === 0) {
        return this._getClonedDisabledIntervals('disabledHours');
    }

    this._setDisabledIntervals('disabledHours', hours, 'h');
};

DateTimePicker.prototype.enabledHours = function enabledHours(hours) {
    if (arguments.length === 0) {
        return this._getClonedDisabledIntervals('enabledHours');
    }

    this._setDisabledIntervals('enabledHours', hours, 'h');
};

DateTimePicker.prototype.viewDate = function viewDate(newDate) {
    if (arguments.length === 0) {
        return this._getViewDateClone();
    }

    this._options.viewDate = this._parseInputDate(newDate);
    this._viewUpdate();
};

DateTimePicker.prototype.allowMultidate = function allowMultidate(_allowMultidate) {
    this._validateBooleanParameter(_allowMultidate, 'allowMultidate');
    this._options.allowMultidate = _allowMultidate;
};

DateTimePicker.prototype.multidateSeparator = function multidateSeparator(_multidateSeparator) {
    if (arguments.length === 0) {
        return this._options.multidateSeparator;
    }

    this._validateStringParameter(_multidateSeparator, 'multidateSeparator');
    this._options.multidateSeparator = _multidateSeparator;
};

TempusDominusBootstrap4.prototype._createTimePickerRows = function () {
    var topRow = $('<td>').addClass('separator'),
        middleRow = $('<td>').append($('<button>').addClass('btn btn-primary').attr({
            'data-action': 'togglePeriod',
            tabindex: '-1',
            'title': this._options.tooltips.togglePeriod
        })),
        bottomRow = $('<td>').addClass('separator');

    if (!this.use24Hours) {
        return [topRow, middleRow, bottomRow];
    }

    return [middleRow];
};

TempusDominusBootstrap4.prototype._getTimePickerTemplate = function () {
    var hoursView = $('<div>').addClass('timepicker-hours').append($('<table>').addClass('table-condensed')),
        minutesView = $('<div>').addClass('timepicker-minutes').append($('<table>').addClass('table-condensed')),
        secondsView = $('<div>').addClass('timepicker-seconds').append($('<table>').addClass('table-condensed')),
        ret = [this._getTimePickerMainTemplate()];

    if (this._isEnabled('h')) {
        ret.push(hoursView);
    }
    if (this._isEnabled('m')) {
        ret.push(minutesView);
    }
    if (this._isEnabled('s')) {
        ret.push(secondsView);
    }

    return ret;
};

TempusDominusBootstrap4.prototype._createToolbarButton = function (action, icon, title) {
    return $('<a>').attr({
        href: '#',
        tabindex: '-1',
        'data-action': action,
        'title': title
    }).append($('<span>').addClass(icon));
};

TempusDominusBootstrap4.prototype._getToolbar = function () {
    var buttons = [];

    if (this._options.buttons.showToday) {
        buttons.push(this._createToolbarButton('today', this._options.icons.today, this._options.tooltips.today));
    }

    if (!this._options.sideBySide && this._hasDate() && this._hasTime()) {
        var title, icon;

        if (this._options.viewMode === 'times') {
            title = this._options.tooltips.selectDate;
            icon = this._options.icons.date;
        } else {
            title = this._options.tooltips.selectTime;
            icon = this._options.icons.time;
        }

        buttons.push(this._createToolbarButton('togglePicker', icon, title));
    }

    if (this._options.buttons.showClear) {
        buttons.push(this._createToolbarButton('clear', this._options.icons.clear, this._options.tooltips.clear));
    }

    if (this._options.buttons.showClose) {
        buttons.push(this._createToolbarButton('close', this._options.icons.close, this._options.tooltips.close));
    }

    return buttons.length === 0 ? '' : $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(buttons)));
};

TempusDominusBootstrap4.prototype._getTemplate = function () {
    var template = $('<div>').addClass('bootstrap-datetimepicker-widget dropdown-menu'),
        dateView = $('<div>').addClass('datepicker').append(this._getDatePickerTemplate()),
        timeView = $('<div>').addClass('timepicker').append(this._getTimePickerTemplate()),
        content = $('<ul>').addClass('list-unstyled'),
        toolbar = $('<li>').addClass('picker-switch' + (this._options.collapse ? ' accordion-toggle' : '')).append(this._getToolbar());

    if (this._options.inline) {
        template.removeClass('dropdown-menu');
    }

    if (this.use24Hours) {
        template.addClass('usetwentyfour');
    }

    if (this._isEnabled('s') && !this.use24Hours) {
        template.addClass('wider');
    }

    if (this._options.sideBySide && this._hasDate() && this._hasTime()) {
        template.addClass('timepicker-sbs');
        if (this._options.toolbarPlacement === 'top') {
            template.append(toolbar);
        }
        template.append($('<div>').addClass('row').append(dateView.addClass('col-md-6')).append(timeView.addClass('col-md-6')));
        if (this._options.toolbarPlacement === 'bottom' || this._options.toolbarPlacement === 'default') {
            template.append(toolbar);
        }
        return template;
    }

    if (this._options.toolbarPlacement === 'top') {
        content.append(toolbar);
    }

    if (this._hasDate()) {
        content.append($('<li>').addClass(this._options.collapse && this._hasTime() ? 'collapse' : '').addClass(this._options.collapse && this._hasTime() && this._options.viewMode === 'times' ? '' : 'show').append(dateView));
    }

    if (this._options.toolbarPlacement === 'default') {
        content.append(toolbar);
    }

    if (this._hasTime()) {
        content.append($('<li>').addClass(this._options.collapse && this._hasDate() ? 'collapse' : '').addClass(this._options.collapse && this._hasDate() && this._options.viewMode === 'times' ? 'show' : '').append(timeView));
    }

    if (this._options.toolbarPlacement === 'bottom') {
        content.append(toolbar);
    }

    return template.append(content);
};

TempusDominusBootstrap4.prototype._place = function (e) {
    var self = e && e.data && e.data.picker || this,
        vertical = self._options.widgetPositioning.vertical,
        horizontal = self._options.widgetPositioning.horizontal,
        parent;
    var position = (self.component && self.component.length ? self.component : self._element).position(),
        offset = (self.component && self.component.length ? self.component : self._element).offset();

    if (self._options.widgetParent) {
        parent = self._options.widgetParent.append(self.widget);
    } else if (self._element.is('input')) {
        parent = self._element.after(self.widget).parent();
    } else if (self._options.inline) {
        parent = self._element.append(self.widget);
        return;
    } else {
        parent = self._element;
        self._element.children().first().after(self.widget);
    }
};

TempusDominusBootstrap4.prototype._calculateVerticalPosition = function () {
    var vertical = this._options.widgetPositioning.vertical,
        offset = this._getOffset(),
        windowHeight = $(window).height(),
        scrollTop = $(window).scrollTop();

    if (vertical === 'auto') {
        if (offset.top + this.widget.height() * 1.5 >= windowHeight + scrollTop && this.widget.height() + this._element.outerHeight() < offset.top) {
            vertical = 'top';
        } else {
            vertical = 'bottom';
        }
    }

    this._applyVerticalPosition(vertical, offset);
};

TempusDominusBootstrap4.prototype._calculateHorizontalPosition = function () {
    var horizontal = this._options.widgetPositioning.horizontal,
        parent = this._getParent(),
        offset = this._getOffset();

    if (horizontal === 'auto') {
        if (parent.width() < offset.left + this.widget.outerWidth() / 2 && offset.left + this.widget.outerWidth() > $(window).width()) {
            horizontal = 'right';
        } else {
            horizontal = 'left';
        }
    }

    this._applyHorizontalPosition(horizontal, offset, parent);
};

TempusDominusBootstrap4.prototype._applyVerticalPosition = function (vertical, offset) {
    if (vertical === 'top') {
        this.widget.addClass('top').removeClass('bottom');
    } else {
        this.widget.addClass('bottom').removeClass('top');
    }

    this.widget.css({
        top: vertical === 'top' ? 'auto' : offset.top + this._element.outerHeight() + 'px',
        bottom: vertical === 'top' ? this._getParent().outerHeight() - (this._getParent() === this._element ? 0 : offset.top) + 'px' : 'auto'
    });
};

TempusDominusBootstrap4.prototype._applyHorizontalPosition = function (horizontal, offset, parent) {
    if (horizontal === 'right') {
        this.widget.addClass('float-right');
    } else {
        this.widget.removeClass('float-right');
    }

    if (parent.css('position') !== 'relative') {
        parent = this._getRelativeParent(parent);
    }

    if (parent.length === 0) {
        throw new Error('datetimepicker component should be placed within a relative positioned container');
    }

    this.widget.css({
        left: horizontal === 'left' ? (parent === this._element ? 0 : offset.left) + 'px' : 'auto',
        right: horizontal === 'left' ? 'auto' : parent.outerWidth() - this._element.outerWidth() - (parent === this._element ? 0 : offset.left) + 'px'
    });
};

TempusDominusBootstrap4.prototype._fillDow = function () {
    var row = $('<tr>'),
        currentDate = this._viewDate.clone().startOf('w').startOf('d');

    if (this._options.calendarWeeks === true) {
        row.append($('<th>').addClass('cw').text('#'));
    }

    while (currentDate.isBefore(this._viewDate.clone().endOf('w'))) {
        row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
        currentDate.add(1, 'd');
    }
    this.widget.find('.datepicker-days thead').append(row);
};

TempusDominusBootstrap4.prototype._fillMonths = function () {
    var spans = [],
        monthsShort = this._viewDate.clone().startOf('y').startOf('d');
    while (monthsShort.isSame(this._viewDate, 'y')) {
        spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
        monthsShort.add(1, 'M');
    }
    this.widget.find('.datepicker-months td').empty().append(spans);
};

TempusDominusBootstrap4.prototype._updateMonths = function () {
    var monthsView = this.widget.find('.datepicker-months'),
        monthsViewHeader = monthsView.find('th'),
        months = monthsView.find('tbody').find('span'),
        self = this;

    monthsViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevYear);
    monthsViewHeader.eq(1).attr('title', this._options.tooltips.selectYear);
    monthsViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextYear);

    monthsView.find('.disabled').removeClass('disabled');

    this._updateNavigationButtons(monthsViewHeader, months, 'y', 'month');

    months.each(function (index) {
        self._updateDisabledView($(this), self._viewDate.clone().month(index), 'M');
    });
};

TempusDominusBootstrap4.prototype._getStartEndYear = function (factor, year) {
    var step = factor / 10,
        startYear = Math.floor(year / factor) * factor,
        endYear = startYear + step * 9,
        focusValue = Math.floor(year / step) * step;
    return [startYear, endYear, focusValue];
};

TempusDominusBootstrap4.prototype._updateYears = function () {
    var yearsView = this.widget.find('.datepicker-years'),
        yearsViewHeader = yearsView.find('th'),
        yearCaps = this._getStartEndYear(10, this._viewDate.year()),
        startYear = this._viewDate.clone().year(yearCaps[0]),
        endYear = this._viewDate.clone().year(yearCaps[1]);
    var html = '';

    yearsViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevDecade);
    yearsViewHeader.eq(1).attr('title', this._options.tooltips.selectDecade);
    yearsViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextDecade);

    yearsView.find('.disabled').removeClass('disabled');

    this._updateNavigationButtons(yearsViewHeader, null, 'y', 'year');

    html += '<span data-action="selectYear" class="year old' + (!this._isValid(startYear, 'y') ? ' disabled' : '') + '">' + (startYear.year() - 1) + '</span>';
    while (!startYear.isAfter(endYear, 'y')) {
        html += '<span data-action="selectYear" class="year' + (startYear.isSame(this._getLastPickedDate(), 'y') && !this.unset ? ' active' : '') + (!this._isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
        startYear.add(1, 'y');
    }
    html += '<span data-action="selectYear" class="year old' + (!this._isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';

    yearsView.find('td').html(html);
};

TempusDominusBootstrap4.prototype._updateNavigationButtons = function (headers, items, unit, action) {
    headers.eq(1).text(this._getNavigationHeader(unit));
    if (items) {
        this._updateDisabledView(items, this._viewDate.clone().subtract(1, unit), unit);
        this._updateDisabledView(items, this._viewDate.clone().add(1, unit), unit);
    }
};

TempusDominusBootstrap4.prototype._updateDisabledView = function (item, date, unit) {
    if (!this._isValid(date, unit)) {
        item.addClass('disabled');
    }
};

TempusDominusBootstrap4.prototype._updateDecades = function _updateDecades() {
    var decadesView = this.widget.find('.datepicker-decades');
    var decadesViewHeader = decadesView.find('th');
    var yearCaps = this._getStartEndYear(100, this._viewDate.year());
    var startDecade = this._viewDate.clone().year(yearCaps[0]);
    var endDecade = this._viewDate.clone().year(yearCaps[1]);

    decadesViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevCentury);
    decadesViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextCentury);

    decadesView.find('.disabled').removeClass('disabled');

    this._updateNavigation(startDecade, endDecade, decadesViewHeader);

    var html = this._generateDecadesHTML(startDecade, endDecade);
    decadesView.find('td').html(html);
};

TempusDominusBootstrap4.prototype._updateNavigation = function _updateNavigation(startDecade, endDecade, decadesViewHeader) {
    if (startDecade.year() === 0 || (this._options.minDate && this._options.minDate.isAfter(startDecade, 'y'))) {
        decadesViewHeader.eq(0).addClass('disabled');
    }

    decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());

    if (this._options.maxDate && this._options.maxDate.isBefore(endDecade, 'y')) {
        decadesViewHeader.eq(2).addClass('disabled');
    }
};

TempusDominusBootstrap4.prototype._generateDecadesHTML = function _generateDecadesHTML(startDecade, endDecade) {
    var html = '';

    if (startDecade.year() - 10 < 0) {
        html += '<span>&nbsp;</span>';
    } else {
        html += '<span data-action="selectDecade" class="decade old" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() - 10) + '</span>';
    }

    while (!startDecade.isAfter(endDecade, 'y')) {
        html += this._generateDecadeSpan(startDecade);
        startDecade.add(10, 'y');
    }

    html += this._generateDecadeSpan(startDecade); // Add the last span

    return html;
};

TempusDominusBootstrap4.prototype._generateDecadeSpan = function _generateDecadeSpan(startDecade) {
    var endDecadeYear = startDecade.year() + 11;
    var minDateDecade = this._options.minDate && this._options.minDate.isAfter(startDecade, 'y') && this._options.minDate.year() <= endDecadeYear;
    var maxDateDecade = this._options.maxDate && this._options.maxDate.isAfter(startDecade, 'y') && this._options.maxDate.year() <= endDecadeYear;

    var spanClass = 'decade' +
        (this._getLastPickedDate().isAfter(startDecade) && this._getLastPickedDate().year() <= endDecadeYear ? ' active' : '') +
        (!this._isValid(startDecade, 'y') && !minDateDecade && !maxDateDecade ? ' disabled' : '');

    return '<span data-action="selectDecade" class="' + spanClass + '" data-selection="' + (startDecade.year() + 6) + '">' + startDecade.year() + '</span>';
};

TempusDominusBootstrap4.prototype._doAction = function _doAction(e, action) {
    const lastPicked = this._getLastPickedDate();

    if ($(e.currentTarget).is('.disabled')) {
        return false;
    }

    action = action || $(e.currentTarget).data('action');

    const actionFunctions = {
        'next': () => this._navigate(DateTimePicker.DatePickerModes[this.currentViewMode].NAV_STEP),
        'previous': () => this._navigate(-DateTimePicker.DatePickerModes[this.currentViewMode].NAV_STEP),
        'pickerSwitch': () => this._showMode(1),
        'selectMonth': () => this._selectMonth(e),
        'selectYear': () => this._selectYear(e),
        'selectDecade': () => this._selectDecade(e),
        'selectDay': () => this._selectDay(e),
        'incrementHours': () => this._incrementHours(),
        'incrementMinutes': () => this._incrementMinutes(),
        'incrementSeconds': () => this._incrementSeconds(),
        'decrementHours': () => this._decrementHours(),
        'decrementMinutes': () => this._decrementMinutes(),
        'decrementSeconds': () => this._decrementSeconds(),
        'togglePeriod': () => this._togglePeriod(),
        'togglePicker': () => this._togglePicker(e),
        'showPicker': () => this._showPicker(),
        'showHours': () => this._showTimepickerSection('.timepicker-hours'),
        'showMinutes': () => this._showTimepickerSection('.timepicker-minutes'),
        'showSeconds': () => this._showTimepickerSection('.timepicker-seconds'),
        'selectHour': () => this._selectTime(e, 'hours'),
        'selectMinute': () => this._selectTime(e, 'minutes'),
        'selectSecond': () => this._selectTime(e, 'seconds'),
        'clear': () => this.clear(),
        'close': () => this.hide(),
        'today': () => this._selectToday(),
    };

    if (actionFunctions[action]) {
        actionFunctions[action]();
    }

    return false;
};

// Helper functions

TempusDominusBootstrap4.prototype._navigate = function (step) {
    const navFnc = DateTimePicker.DatePickerModes[this.currentViewMode].NAV_FUNCTION;
    this._viewDate.add(step, navFnc);
    this._fillDate();
    this._viewUpdate(navFnc);
};

TempusDominusBootstrap4.prototype._selectMonth = function (e) {
    const month = $(e.target).closest('tbody').find('span').index($(e.target));
    this._viewDate.month(month);

    if (this.currentViewMode === this.MinViewModeNumber) {
        this._setValue(lastPicked.clone().year(this._viewDate.year()).month(this._viewDate.month()), this._getLastPickedDateIndex());
        if (!this._options.inline) {
            this.hide();
        }
    } else {
        this._showMode(-1);
        this._fillDate();
    }

    this._viewUpdate('M');
};

TempusDominusBootstrap4.prototype._selectYear = function (e) {
    const year = parseInt($(e.target).text(), 10) || 0;
    this._viewDate.year(year);

    if (this.currentViewMode === this.MinViewModeNumber) {
        this._setValue(lastPicked.clone().year(this._viewDate.year()), this._getLastPickedDateIndex());
        if (!this._options.inline) {
            this.hide();
        }
    } else {
        this._showMode(-1);
        this._fillDate();
    }

    this._viewUpdate('YYYY');
};

TempusDominusBootstrap4.prototype._selectDecade = function (e) {
    const year = parseInt($(e.target).data('selection'), 10) || 0;
    this._viewDate.year(year);

    if (this.currentViewMode === this.MinViewModeNumber) {
        this._setValue(lastPicked.clone().year(this._viewDate.year()), this._getLastPickedDateIndex());
        if (!this._options.inline) {
            this.hide();
        }
    } else {
        this._showMode(-1);
        this._fillDate();
    }

    this._viewUpdate('YYYY');
};

TempusDominusBootstrap4.prototype._selectDay = function (e) {
    const day = this._viewDate.clone();
    
    if ($(e.target).is('.old')) {
        day.subtract(1, 'M');
    }
    
    if ($(e.target).is('.new')) {
        day.add(1, 'M');
    }

    const selectDate = day.date(parseInt($(e.target).text(), 10));
    let index = 0;

    if (this._options.allowMultidate) {
        index = this._datesFormatted.indexOf(selectDate.format('YYYY-MM-DD'));
        
        if (index !== -1) {
            this._setValue(null, index); // Deselect multidate
        } else {
            this._setValue(selectDate, this._getLastPickedDateIndex() + 1);
        }
    } else {
        this._setValue(selectDate, this._getLastPickedDateIndex());
    }

    if (!this._hasTime() && !this._options.keepOpen && !this._options.inline && !this._options.allowMultidate) {
        this.hide();
    }
};

TempusDominusBootstrap4.prototype._incrementHours = function () {
    const newDate = lastPicked.clone().add(1, 'h');
    
    if (this._isValid(newDate, 'h')) {
        this._setValue(newDate, this._getLastPickedDateIndex());
    }
};

TempusDominusBootstrap4.prototype._incrementMinutes = function () {
    const newDate = lastPicked.clone().add(this._options.stepping, 'm');
    
    if (this._isValid(newDate, 'm')) {
        this._setValue(newDate, this._getLastPickedDateIndex());
    }
};

TempusDominusBootstrap4.prototype._incrementSeconds = function () {
    const newDate = lastPicked.clone().add(1, 's');
    
    if (this._isValid(newDate, 's')) {
        this._setValue(newDate, this._getLastPickedDateIndex());
    }
};

TempusDominusBootstrap4.prototype._decrementHours = function () {
    const newDate = lastPicked.clone().subtract(1, 'h');
    
    if (this._isValid(newDate, 'h')) {
        this._setValue(newDate, this._getLastPickedDateIndex());
    }
};

TempusDominusBootstrap4.prototype._decrementMinutes = function () {
    const newDate = lastPicked.clone().subtract(this._options.stepping, 'm');
    
    if (this._isValid(newDate, 'm')) {
        this._setValue(newDate, this._getLastPickedDateIndex());
    }
};

TempusDominusBootstrap4.prototype._decrementSeconds = function () {
    const newDate = lastPicked.clone().subtract(1, 's');
    
    if (this._isValid(newDate, 's')) {
        this._setValue(newDate, this._getLastPickedDateIndex());
    }
};

TempusDominusBootstrap4.prototype._togglePeriod = function () {
    this._setValue(lastPicked.clone().add(lastPicked.hours() >= 12 ? -12 : 12, 'h'), this._getLastPickedDateIndex());
};

TempusDominusBootstrap4.prototype._togglePicker = function (e) {
    const $this = $(e.target);
    const $link = $this.closest('a');
    const $parent = $this.closest('ul');
    const expanded = $parent.find('.show');
    const closed = $parent.find('.collapse:not(.show)');
    const $span = $this.is('span') ? $this : $this.find('span');
    let collapseData;

    if (expanded && expanded.length) {
        collapseData = expanded.data('collapse');
        
        if (collapseData && collapseData.transitioning) {
            return true;
        }
        
        if (expanded.collapse) {
            expanded.collapse('hide');
            closed.collapse('show');
        } else {
            expanded.removeClass('show');
            closed.addClass('show');
        }

        $span.toggleClass(this._options.icons.time + ' ' + this._options.icons.date);

        if ($span.hasClass(this._options.icons.date)) {
            $link.attr('title', this._options.tooltips.selectDate);
        } else {
            $link.attr('title', this._options.tooltips.selectTime);
        }
    }
};

TempusDominusBootstrap4.prototype._showPicker = function () {
    this.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
    this.widget.find('.timepicker .timepicker-picker').show();
};

TempusDominusBootstrap4.prototype._showTimepickerSection = function (sectionClass) {
    this.widget.find('.timepicker .timepicker-picker').hide();
    this.widget.find(sectionClass).show();
};

TempusDominusBootstrap4.prototype._selectTime = function (e, unit) {
    const hour = parseInt($(e.target).text(), 10);

    if (!this.use24Hours) {
        if (lastPicked.hours() >= 12) {
            if (hour !== 12) {
                hour += 12;
            }
        } else {
            if (hour === 12) {
                hour = 0;
            }
        }
    }

    this._setValue(lastPicked.clone().set(unit, hour), this._getLastPickedDateIndex());

    if (!this._isEnabled('a') && !this._isEnabled('m') && !this._options.keepOpen && !this._options.inline) {
        this.hide();
    } else {
        this._doAction(e, 'showPicker');
    }
};

TempusDominusBootstrap4.prototype._selectToday = function () {
    const todaysDate = this.getMoment();

    if (this._isValid(todaysDate, 'd')) {
        this._setValue(todaysDate, this._getLastPickedDateIndex());
    }
};

(function ($) {
    'use strict';

    var DateTimePicker = function () {
        // ... (existing code for DateTimePicker class)
    }(jQuery);

    var getSelectorFromElement = function ($element) {
        // Implementation of getSelectorFromElement
    };

    /**
     * ------------------------------------------------------------------------
     * TempusDominusBootstrap4
     * ------------------------------------------------------------------------
     */

    var TempusDominusBootstrap4 = function (DateTimePicker) {
        // Existing TempusDominusBootstrap4 implementation
        // ...

        return TempusDominusBootstrap4;
    }(DateTimePicker);

    // Public methods
    TempusDominusBootstrap4.prototype.hide = function hide() {
        // Implementation of hide method
        // ...
    };

    TempusDominusBootstrap4.prototype.show = function show() {
        // Implementation of show method
        // ...
    };

    TempusDominusBootstrap4.prototype.destroy = function destroy() {
        // Implementation of destroy method
        // ...
    };

    TempusDominusBootstrap4.prototype.disable = function disable() {
        // Implementation of disable method
        // ...
    };

    TempusDominusBootstrap4.prototype.enable = function enable() {
        // Implementation of enable method
        // ...
    };

    TempusDominusBootstrap4.prototype.toolbarPlacement = function toolbarPlacement(_toolbarPlacement) {
        // Implementation of toolbarPlacement method
        // ...
    };

    TempusDominusBootstrap4.prototype.widgetPositioning = function widgetPositioning(_widgetPositioning) {
        // Implementation of widgetPositioning method
        // ...
    };

    TempusDominusBootstrap4.prototype.widgetParent = function widgetParent(_widgetParent) {
        // Implementation of widgetParent method
        // ...
    };

    // Static methods
    TempusDominusBootstrap4._jQueryHandleThis = function _jQueryHandleThis(me, option, argument) {
        // Implementation of _jQueryHandleThis method
        // ...
    };

    TempusDominusBootstrap4._jQueryInterface = function _jQueryInterface(option, argument) {
        // Implementation of _jQueryInterface method
        // ...
    };

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $(document)
        .on(DateTimePicker.Event.CLICK_DATA_API, DateTimePicker.Selector.DATA_TOGGLE, function () {
            // Implementation of click event for data API
            // ...
        })
        .on(DateTimePicker.Event.CHANGE, '.' + DateTimePicker.ClassName.INPUT, function (event) {
            // Implementation of change event for input
            // ...
        })
        .on(DateTimePicker.Event.BLUR, '.' + DateTimePicker.ClassName.INPUT, function (event) {
            // Implementation of blur event for input
            // ...
        })
        .on(DateTimePicker.Event.KEYDOWN, '.' + DateTimePicker.ClassName.INPUT, function (event) {
            // Implementation of keydown event for input
            // ...
        })
        .on(DateTimePicker.Event.KEYUP, '.' + DateTimePicker.ClassName.INPUT, function (event) {
            // Implementation of keyup event for input
            // ...
        })
        .on(DateTimePicker.Event.FOCUS, '.' + DateTimePicker.ClassName.INPUT, function (event) {
            // Implementation of focus event for input
            // ...
        });

    $.fn[DateTimePicker.NAME] = TempusDominusBootstrap4._jQueryInterface;
    $.fn[DateTimePicker.NAME].Constructor = TempusDominusBootstrap4;
    $.fn[DateTimePicker.NAME].noConflict = function () {
        $.fn[DateTimePicker.NAME] = JQUERY_NO_CONFLICT;
        return TempusDominusBootstrap4._jQueryInterface;
    };

    return TempusDominusBootstrap4;
}(jQuery));

