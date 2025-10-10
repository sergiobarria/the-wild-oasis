//  @ts-check

/** @type {import('prettier').Config} */
const config = {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 120,
    tabWidth: 4,
    plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrder: ['^react(.*)$', '^@tanstack(.*)$', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
}

export default config
