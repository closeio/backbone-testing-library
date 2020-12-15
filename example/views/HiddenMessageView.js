import Backbone from 'backbone';

const HiddenMessageView = Backbone.View.extend({
  events: {
    'change #toggle': 'setShowMessage',
  },

  initialize({ model }) {
    this.model = model;
    this.model.on('change', this.render.bind(this));
  },

  setShowMessage(e) {
    this.model.set('showMessage', e.target.checked);
  },

  template({ showMessage, message }) {
    return `<div>
      <label for="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        ${showMessage ? 'checked' : ''}
      />
      ${showMessage ? message : ''}
    </div>`;
  },

  render() {
    this.$el.html(this.template(this.model.attributes));
  },
});

export default HiddenMessageView;
