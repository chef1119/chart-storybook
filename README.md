# React Charts

<a href="https://travis-ci.org/react-charts/react-charts" target="\_parent">
  <img alt="" src="https://travis-ci.org/react-charts/react-charts.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-charts" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-charts.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/react-charts/react-charts" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/react-charts/react-charts.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

Simple, immersive &amp; interactive charts for React

## Features

- Line, Bar, Bubble, Area.
- Hyper Responsive
- Powered by D3
- React Hooks Ready
- Flexible data model

## [Demos](https://react-charts.js.org)

## Intro

React Charts is currently in **beta**! This means:

- The existing API is mostly stable. Expect only subtle changes/additions as use-cases become polished.
- It's safe for **most** production sites, as long as you lock in the alpha version.

## Table of Contents

- [Installation](#installation)
- [Quick Example](#quick-example)
- [Examples](https://react-charts.js.org)

## Installation

```bash
$ yarn add react-charts
# or
$ npm i react-charts --save
```

## Quick Start

React

This will render a very basic line chart:

```javascript
import React from 'react'
import { Chart } from 'react-charts'

function MyChart() {
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const lineChart = (
    // A react-chart hyper-responsively and continuusly fills the available
    // space of its parent element automatically
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  )
}
```

## Documentation

Complete documentation is **coming soon**. The most detailed usage examples are visible by [browsing the website's examples](https://github.com/react-tools/react-charts/tree/master/www/src/containers).

Any sparse documentation available in this Readme is being progressively improved as the API evolves.

## API

React Charts exposes these top-level exports:

- `Chart` - The Chart component used to render charts
- Series Type Components
  - `Line`
  - `Bar`
  - `Bubble`
  - `Area`
- Curve Functions
  - `curveBasisClosed`
  - `curveBasisOpen`
  - `curveBasis`
  - `curveBundle`
  - `curveCardinalClosed`
  - `curveCardinalOpen`
  - `curveCardinal`
  - `curveCatmullRomClosed`
  - `curveCatmullRomOpen`
  - `curveCatmullRom`
  - `curveLinearClosed`
  - `curveLinear`
  - `curveMonotoneX`
  - `curveMonotoneY`
  - `curveNatural`
  - `curveStep`
  - `curveStepAfter`
  - `curveStepBefore`
- Position Constants
  - `positionTop`
  - `positionRight`
  - `positionBottom`
  - `positionLeft`
- Grouping Constants
  - `groupingSingle`
  - `groupingSeries`
  - `groupingPrimary`
  - `groupingSecondary`
- Tooltip Alignment Constants
  - `alignAuto`
  - `alignRight`
  - `alignTopRight`
  - `alignBottomRight`
  - `alignLeft`
  - `alignTopLeft`
  - `alignBottomLeft`
  - `alignTop`
  - `alignBottom`
- Axis Type Constants
  - `axisTypeOrdinal`
  - `axisTypeTime`
  - `axisTypeUtc`
  - `axisTypeLinear`
  - `axisTypeLog`
- Tooltip Anchor Constants
  - `anchorPointer`
  - `anchorClosest`
  - `anchorCenter`
  - `anchorTop`
  - `anchorBottom`
  - `anchorLeft`
  - `anchorRight`
  - `anchorGridTop`
  - `anchorGridBottom`
  - `anchorGridLeft`
  - `anchorGridRight`
- Focus Mode Constants
  - `focusAuto`
  - `focusClosest`
  - `focusElement`

## Memoize your Props!

As you'll see in every example, the React Charts `<Chart>` component expects all props and options to be memoized using either `React.useMemo` or `React.useCallback`. While passing an unmemoized option/prop to the `<Chart>` component won't severly break any visible functionality, your charts will be severly non-performant. Internally, React Charts uses the immutable nature of thes options/props to detect changes to the configuration and update accordingly.

While this may feel heavy at first, it gives you, the dev, full control over when you want to update your charts. To trigger and update, simply trigger one of your `React.useMemo` or `React.useCallback` hooks on the part of the config that you would like to update!

## Data Model

React Charts uses a common and very flexible data model based on arrays of **series** and arrays of **datums**. You can either use the model defaults directly, or use **data accessors** to materialize this structure.

Typical visualization data can come in practically any shape and size. The following examples show data structures that are all reasonably equivalent **at some level** since they each contain an array of **series[]** and **datums[]**. They also show how to parse that data.

In the following example, there is no need to use any accessors. The **default** accessors are able to easily understand this format:

```javascript
function MyChart() {
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
      },
      {
        label: 'Series 2',
        data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
      },
      {
        label: 'Series 3',
        data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
      }
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  )
}
```

In the following example, there is no need to use any accessors. The **default** accessors are able to easily understand this format, but **please note** that this format limits you from passing any **meta data** about your series and datums.

```javascript
function MyChart() {
  const data = React.useMemo(
    () => [
      [[1, 10], [2, 10], [3, 10]],
      [[1, 10], [2, 10], [3, 10]],
      [[1, 10], [2, 10], [3, 10]]
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  )
}
```

#### Data Accessors

When data isn't in a convenient format for React Charts, **your first instinct will be to transform your data into the above formats**. Don't do that! There is an easier way 🎉 We can use the `Chart` components' **accessor props** to point things in the right direction. **Accessor props** pass the original data and the series/datums you return down the line to form a new data model. See the [`<Chart>` component](#chart) for all available accessors.

In the following example, the data is in a very funky format, but at it's core is the same as the previous examples.

```javascript
function MyChart() {
  // Use any data object you want
  const originalData = React.useMemo(
    () => ({
      axis: [1, 2, 3],
      lines: [
        { data: [{ value: 10 }, { value: 10 }, { value: 10 }] },
        { data: [{ value: 10 }, { value: 10 }, { value: 10 }] },
        { data: [{ value: 10 }, { value: 10 }, { value: 10 }] }
      ]
    }),
    []
  )

  // Make data.lines represent the different series
  const data = React.useMemo(data => originalData.lines, [originalData])

  // Use data.lines[n].data to represent the different datums for each series
  const getDatums = React.useCallback(series => series.data, [])

  // Use the original data object and the datum index to reference the datum's primary value.
  const getPrimary = React.useCallback(
    (datum, i, series, seriesIndex, data) => originalData.axis[i],
    []
  )

  // Use data.lines[n].data[n].value as each datums secondary value
  const getSecondary = React.useCallback(datum => datum.value, [])

  return (
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart
        data={data}
        getSeries={getSeries}
        getDatums={getDatums}
        getPrimary={getPrimary}
        getSecondary={getSecondary}
      />
    </div>
  )
}
```

#### Series Labels

Multiple series are often useless without labels. By default, React Charts looks for the `label` value on the series object you pass it. If not found, it will simply label your series as `Series [n]`, where `[n]` is the zero-based `index` of the series, plus `1`.

If the default label accessor doesn't suit your needs, then you can use the `<Chart>` component's `getLabel` accessor prop:

```javascript
function MyChart() {
  const data = React.useMemo(
    () => [
      {
        specialLabel: 'Hello World!',
        data: [
          //...
        ]
      }
    ],
    []
  )

  const getLabel = React.useCallback(series => series.specialLabel, [])

  return (
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} getLabel={getLabel} />
    </div>
  )
}
```

## Axes & Scales

React Charts supports an `axes` prop that handles both the underlying scale and visual rendering. These axes can be combined and configured to plot data in many ways. To date, we have the following scale types available:

- Cartesian
  - `linear` - A continuous axis used for plotting numerical data on an evenly distributed scale. Works well both as a **primary and secondary** axis.
  - `ordinal` - A banded axis commonly used to plot categories or ordinal information. Works well as the **primary** axis for bar charts.
  - `time` - A continuous axis used for plotting localized times and dates on an evenly distributed scale. Works well as a **primary** axis.
  - `utc` - Similar to the `time` scale, but supports UTC datetimes instead of localized datetimes. Works well as a **primary** axis.
  - `log` - A continuous axis used for plotting numerical data on a logarithmically distributed scale. Works well as a **secondary** axis
    <!-- - Radial
  - `pie` - A standalone numerical axis used for plotting arc lengths on a pie chart. Use this as the only axis when plotting a Pie chart. -->

Axes are a required component of a React Chart and can used like so:

```javascript
import { Chart } from 'react-charts'

function MyChart() {
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart axes={axes} />
    </div>
  )
}
```

For more information on usage and API, see the [`axes` prop](#axes)

## Series Types

- Cartesian
  - `line`
  - `area`
  - `bar`
  - `bubble`
- Radial
  - `pie`

Example

```javascript
function MyChart() {
  const series = React.useMemo(() => ({ curve: 'cardinal' }), [])

  return <Chart series={series} />
}
```

# Advanced API

**`<Chart />` Props**

- `getSeries()` - Responsible for returning an array of series.
  - Default - `() => null`
  - Arguments:
    - `data` - The original
  - Returns an `Object`
- `getLabel()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getSeriesID()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getDatums()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getPrimary()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`
- `getSecondary()`
  - Default - `() => null`
  - Arguments:
    - Thing
  - Returns an `Object`

**Curve Types**

All series types that support lines or curves can be configured to use any [curve function from `d3-shape`](https://github.com/d3/d3-shape#curves) by passing one of the following strings as the `curve` prop to a series component. You may also pass your own curve function directly from d3 or if you're feeling powerful, even create your own!

Note the following string correspond to their respective d3 curve functions but with the `curve` prefix removed.

- `basisClosed`
- `basisOpen`
- `basis`
- `bundle`
- `cardinalClosed`
- `cardinalOpen`
- `cardinal`
- `catmullRomClosed`
- `catmullRomOpen`
- `catmullRom`
- `linearClosed`
- `linear`
- `monotoneX` (default)
- `monotoneY`
- `natural`
- `step`
- `stepAfter`
- `stepBefore`
