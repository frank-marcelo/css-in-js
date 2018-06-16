const headers = [
  'Package',
  'Version',
  'Automatic Vendor Prefixing',
  'Pseudo Classes',
  'Media Queries',
  'Styles As Object Literals',
  'Extract CSS File',
  'Package Stats'
]

const iconImage = ({icon, value, alt, link}) =>
  `<a href="${link}" target="_blank" title="${alt}"><img src="./ReadmeSrc/img/${icon}.svg" width="12" alt="${icon}" /></a> ${value}`

const subWithIcon = args => `<sub>${iconImage(args)}</sub>`

const divWithIcon = args => `<div>${subWithIcon(args)}</div>`

const link = obj => `[${obj.text}](${obj.href})`

const version = obj => obj

const symbol = obj => (obj === true ? '✓' : '')

const links = obj => {
  return obj
    .map((package, index) => {
      const {
        autogenerated: {githubData, npmData},
        text,
        href,
        npm
      } = package

      const spacer = index > 0 ? '<div>___________________________</div>' : ''

      const stars = `<div>${subWithIcon({
        link: `https://www.npmjs.com/package/${npm}`,
        icon: 'tag',
        value: npmData.version,
        alt: 'npm version'
      }) +
        ' ' +
        subWithIcon({
          link: `${href}/stargazers`,
          icon: 'star',
          value: githubData.stargazers_count,
          alt: 'stars on Github'
        })}</div>`

      return spacer + `[${text}](${href})` + stars
    })
    .join('')
}

const stats = obj => {
  return obj
    .map((package, index) => {
      const {
        autogenerated: {githubData, npmData},
        npm,
        href
      } = package

      const spacer = index > 0 ? '<div>____________</div>' : ''

      const issues = divWithIcon({
        link: `${href}/issues`,
        icon: 'info',
        value: githubData.open_issues + '/' + githubData.closed_issues,
        alt: 'open / closed issues'
      })

      const lastMonthDl = divWithIcon({
        link: `https://www.npmjs.com/package/${npm}`,
        icon: 'download',
        value: npmData.downloads,
        alt: 'monthly downloads'
      })

      return spacer + issues + lastMonthDl
    })
    .join('')
}

const formatters = {
  Package: links,
  Version: version,
  'Package Stats': stats,
  default: symbol
}

const defaultFallback = (options, field) => options[field] || options.default

const row = obj =>
  headers.map(header => {
    const formatter = defaultFallback(formatters, header)

    return header === 'Package' || header === 'Package Stats'
      ? formatter(
          obj[header].map((ob, index) => {
            const ddd = {
              ...obj['Package'][index],
              ...obj['Package Stats'][index]
            }
            return ddd
          })
        )
      : formatter(obj[header])
  })

function getRows(rows) {
  const out = rows.map(row)
  return out
}

module.exports = {getRows, headers}