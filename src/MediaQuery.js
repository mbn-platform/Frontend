import createMediaQueryProvider from './generic/MediaQueryLib';

export const querySchema = {
  sm: '(max-width: 1023px)',
  lg: '(min-width: 1024px)',
};

export const { MediaQuery, Screen } = createMediaQueryProvider(querySchema);
