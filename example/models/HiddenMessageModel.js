import Backbone from 'backbone';

const HiddenMessageModel = Backbone.Model.extend({
  defaults: {
    message: '',
    showMessage: false,
  },
});

export default HiddenMessageModel;
