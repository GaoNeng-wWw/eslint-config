import { GLOB_EXCLUDE } from '../glob';

export const ignore = (userIgnores: string[] = []) => {
  return [
    {
      name: 'ignore',
      ignores: [
        ...GLOB_EXCLUDE,
        ...userIgnores,
      ],
    },
  ];
};
