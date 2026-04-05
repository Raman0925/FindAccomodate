/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import {RootStoreProvider} from '../src/app/providers/RootStoreProvider';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <RootStoreProvider>
        <App />
      </RootStoreProvider>,
    );
  });
});
