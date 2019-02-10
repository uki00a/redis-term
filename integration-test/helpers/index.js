import React from 'react';
import { render } from './react-blessed';

export * from './redis';
export * from './react-blessed';

import { RedisProvider } from '../../src/contexts/redis-context';
import { ThemeProvider } from '../../src/contexts/theme-context';

export const renderWithRedis = (
  component,
  redis
) => {
  return render(
    <RedisProvider value={redis}>
      <ThemeProvider>
        { component }
      </ThemeProvider>
    </RedisProvider>
  );
};

