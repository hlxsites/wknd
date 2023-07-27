import React from 'react';
import * as ReactDOM from 'react-dom';
import Picker from './picker'
import {Provider, defaultTheme} from '@adobe/react-spectrum';

const app = document.getElementById("app");
if (app) {
  ReactDOM.render(<Provider theme={defaultTheme}><Picker /></Provider>, app);
}
