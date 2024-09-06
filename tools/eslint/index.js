import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import antfu from '@antfu/eslint-config';

/** @type {import('@dedushkaalex/eslint').Eslint} */
export const eslint = ({jsxA11y = false, next = false, ...options}, ...configs) => {
  const stylistic = options.stylistic ?? false;

  if (jsxA11y) {
    configs.unshift({
      plugins: {
        'dedushkaalex-jsx-a11y': pluginJsxA11y
      },
      name: 'dedushkaalex-jsx-a11y',
      rules: {
        ...Object.entries(pluginJsxA11y.flatConfigs.recommended.rules).reduce(
          (acc, [key, value]) => {
            acc[key.replace('jsx-a11y', 'dedushkaalex-jsx-a11y')] = value;
            return acc;
          },
          {}
        )
      }
    })
  }

  if (options.react) {
    configs.unshift({
      name: 'dedushkaalex/react',
      plugins: {
        'dedushkaalex-react': pluginReact
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        ...Object.entries(pluginReact.configs.recommended.rules).reduce((acc, [key, value]) => {
          acc[key.replace('react', 'dedushkaalex-react')] = value;
          return acc;
        }, {}),
        'dedushkaalex-react/react-in-jsx-scope': 'off',
        'dedushkaalex-react/function-component-definition': [
          'error',
          {
            namedComponents: ['arrow-function'],
            unnamedComponents: 'arrow-function'
          }
        ]
      }
    });
  }

  if (stylistic) {
    configs.unshift({
      name: 'dedushkaalex/formatter',
      rules: {
        'style/multiline-ternary': 'off',
        'style/jsx-curly-newline': 'off',
        'style/jsx-one-expression-per-line': 'off',
        'style/member-delimiter-style': 'off',
        'style/quote-props': 'off',
        'style/operator-linebreak': 'off',
        'style/brace-style': 'off',

        'style/max-len': [
          'error',
          100,
          2,
          { ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true }
        ],
        'style/quotes': ['error', 'single', { allowTemplateLiterals: true }],
        'style/jsx-quotes': ['error', 'prefer-single'],
        'style/comma-dangle': ['error', 'never'],
        'style/semi': ['error', 'always'],
        'style/indent': ['error', 2, { SwitchCase: 1 }],
        'style/no-tabs': 'error',
        'style/linebreak-style': ['error', 'unix'],
        'style/arrow-parens': ['error', 'always']
      }
    });
  }

  return antfu(
    {...options, stylistic},
    {
      name: 'dedushkaalex/rewrite',
      rules: {
        'antfu/top-level-function': 'off',
        'antfu/if-newline':'off',
        'antfu/curly': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'no-console': 'warn',
      }
    },
    {
      name: 'dedushkaalex/imports',
      plugins: {
        'plugin-simple-import-sort': pluginSimpleImportSort
      },
      rules: {
        'sort-imports': 'off',
        'import/order': 'off',
        'import/extensions': 'off',
        'plugin-simple-import-sort/exports': 'error',
        'plugin-simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^react', '^@?\\w'],
              ['^@(dedushkaalex-core/.*|$)'],
              ['^@(([\\/.]?\\w)|assets|test-utils)'],
              ['^\\u0000'],
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              ['^.+\\.s?css$']
            ]
          }
        ]
      }
    },
    ...configs
  )
}
