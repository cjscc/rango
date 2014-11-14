'use strict';

var Immutable = require('immutable');
var Fluxxor   = require('fluxxor');

var Constants = require('../constants');
var Rango     = require('../api');

var EditorStore = Fluxxor.createStore({

  initialize: function () {

    this.state = Immutable.fromJS({

      // path to the currently edited file
      path: '',

      // the directories and pages in the current path
      page: {
        content: '',
        metadata: {},
      },

    });

    this.bindActions({
      OPEN_PAGE: 'handleOpenPage',
    });
  },

  // fetch the page metadata and content from the server
  fetchPage: function () {
    var self = this;

    // empty content while we are waiting
    this.state = this.state.set('page', Immutable.fromJS({
      metadata:  {},
      content:   '',
    }));
    self.emit('change');

    Rango.readPage(this.state.get('path')).then(function (page) {
      self.state = self.state.set('page', Immutable.fromJS(page));
      self.emit('change');
    });
  },

  // open a page in the editor
  handleOpenPage: function (filename) {
    this.state = this.state.set('path', filename);
    this.fetchPage();
  },

});

module.exports = EditorStore;