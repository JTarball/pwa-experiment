import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import 'fa-icons';
import '@material/mwc-button';
import '@vaadin/button';
import { Notification } from '@vaadin/notification';

@customElement('app-menu')
class AppMenu extends LitElement {
  @property()
  version = 'STARTING';

  private _slideMenu() {
    console.log(this);
    Notification.show('Hello');
  }

  render() {
    return html`
      <div>
        <mwc-button id="myButton" raised
          ><fa-icon class="fas bars" @click="${this._slideMenu}"></fa-icon
        ></mwc-button>
      </div>
    `;
  }
}
