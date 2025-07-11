const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        files: ['src/**/*.ts', 'test/**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.base.json',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'writable',
                module: 'writable',
                require: 'readonly',
                global: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            'prefer-const': 'error',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-undef': 'off', // TypeScript handles this
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        files: ['examples/**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.base.json',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'writable',
                module: 'writable',
                require: 'readonly',
                global: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            'prefer-const': 'error',
            'no-console': 'off', // Allow console in examples
            'no-unused-vars': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        ignores: ['dist/', 'node_modules/', 'coverage/', '*.js'],
    },
];
