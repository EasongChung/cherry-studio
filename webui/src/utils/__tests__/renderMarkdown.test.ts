import { describe, expect, it } from 'vitest'

import { renderMarkdown } from '../renderMarkdown'

// A leaked virtual separator would surface as a data cell of only dashes: <td>---</td>.
const dashCells = (html: string) => html.match(/<td>-+<\/td>/g) ?? []

describe('renderMarkdown table preprocessing', () => {
  it('renders a table while streaming the header alone', () => {
    const html = renderMarkdown('前言\n| 名称 | 值 |')
    expect(html).toContain('<table>')
    expect(html).toContain('<th>名称</th>')
    expect(dashCells(html)).toHaveLength(0)
  })

  it('does not duplicate the separator while the model is mid-stream', () => {
    const html = renderMarkdown('| 名称 | 值 |\n| --- | --- |\n| CPU')
    expect(html).toContain('<table>')
    expect(dashCells(html)).toHaveLength(0)
    expect(html).toContain('<td>CPU</td>')
  })

  it('renders a completed multi-column table with no stray --- row', () => {
    const html = renderMarkdown('| 名称 | 值 |\n| --- | --- |\n| CPU | 8 |\n| RAM | 16 |')
    expect(html).toContain('<table>')
    expect(dashCells(html)).toHaveLength(0)
    expect(html).toContain('<td>CPU</td>')
    expect(html).toContain('<td>8</td>')
    expect(html).toContain('<td>RAM</td>')
    expect(html).toContain('<td>16</td>')
  })

  it('renders a single-column completed table without duplication', () => {
    const html = renderMarkdown('| 项目 |\n| --- |\n| CPU |')
    expect(html).toContain('<table>')
    expect(dashCells(html)).toHaveLength(0)
    expect(html).toContain('<td>CPU</td>')
  })
})