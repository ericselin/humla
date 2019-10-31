import { getConfig } from './lib/firebase.js';
import HaList from './ha-list.js';
import HaCompleted from './ha-completed.js';
import HaLink from './ui/ha-link.js';
import HaContext from './ha-context.js';
import HaHeading from './ui/ha-heading.js';
import HaNew from './ha-new.js';
import HaOverlay from './ui/ha-overlay.js';
import HaOverlayButton from './ui/ha-overlay-button.js';
import HaTags from './ha-tags.js';
import HaTitle from './todo/ha-title.js';
import HaTodo from './todo/ha-todo.js';
import HaMeetings from './ha-meetings.js';

customElements.define(HaList.elementName, HaList);
customElements.define(HaCompleted.elementName, HaCompleted);
customElements.define(HaLink.elementName, HaLink);
customElements.define(HaContext.elementName, HaContext);
customElements.define(HaHeading.elementName, HaHeading);
customElements.define(HaNew.elementName, HaNew);
customElements.define(HaOverlay.elementName, HaOverlay);
customElements.define(HaOverlayButton.elementName, HaOverlayButton);
customElements.define(HaTags.elementName, HaTags);
customElements.define(HaTitle.elementName, HaTitle);
customElements.define(HaTodo.elementName, HaTodo);
getConfig('meetings').then((activated) => {
  if (activated) customElements.define(HaMeetings.elementName, HaMeetings);
});
