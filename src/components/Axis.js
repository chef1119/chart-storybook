import React, { PureComponent } from 'react'
import { Animate, Transition } from 'react-move'
//
import measure from './Axis.measure'
import updateScale from './Axis.updateScale'

import Path from '../primitives/Path'
import Line from '../primitives/Line'
import Text from '../primitives/Text'

import Connect from '../utils/Connect'
import Selectors from '../utils/Selectors'

export const positionTop = 'top'
export const positionRight = 'right'
export const positionBottom = 'bottom'
export const positionLeft = 'left'

const fontSize = 10

const detectVertical = position => [positionLeft, positionRight].indexOf(position) > -1

class Axis extends PureComponent {
  static defaultProps = {
    tickArguments: [],
    tickValues: null,
    tickFormat: null,
    tickSizeInner: 6,
    tickSizeOuter: 6,
    tickPadding: 3,
    maxLabelRotation: 50,
    barPaddingInner: 0.1,
    barPaddingOuter: 0.1,
    showGrid: true,
    cursor: {}
  }
  // Lifecycle
  constructor () {
    super()
    this.rotation = 0
    this.visibleLabelStep = 1
    this.measure = measure.bind(this)
    this.updateScale = updateScale.bind(this)
  }
  componentWillReceiveProps (newProps) {
    const oldProps = this.props
    if (oldProps.axis !== newProps.axis && oldProps.axis) {
      this.prevAxis = oldProps.axis
    }
  }
  componentDidMount () {
    this.updateScale(this.props)
    this.measure()
  }
  componentWillUpdate (newProps) {
    const oldProps = this.props
    const {
      position
    } = newProps

    // If any of the following change,
    // we need to update the axis
    if (
      newProps.axes !== oldProps.axes ||
      newProps.primary !== oldProps.primary ||
      newProps.type !== oldProps.type ||
      newProps.invert !== oldProps.invert ||
      newProps.accessedData !== oldProps.accessedData ||
      newProps.height !== oldProps.height ||
      newProps.width !== oldProps.width ||
      // TODO: (
        // newProps.cursor || oldProps.cursor
        // newProps.cursor.option !== oldProps.cursor.option
      // )
      position !== oldProps.position
    ) {
      this.updateScale(newProps)
    }
  }
  componentDidUpdate () {
    window.requestAnimationFrame(this.measure)
  }
  render () {
    const {
      axis,
      position,
      width,
      height,
      showGrid,
      tickArguments,
      tickValues,
      tickFormat,
      tickSizeInner,
      tickSizeOuter,
      tickPadding,
      centerTicks
    } = this.props

    const {
      rotation,
      visibleLabelStep
    } = this

    // Render Dependencies
    if (!axis) {
      return null
    }

    const scale = axis.scale

    const vertical = detectVertical(position)
    const max =
      position === positionBottom ? -height
      : position === positionLeft ? width
      : position === positionTop ? height
      : -width
    const RTL = (position === positionTop || position === positionLeft) ? -1 : 1
    const transform = !vertical ? translateX : translateY
    const ticks = this.ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues
    const format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat
    const spacing = Math.max(tickSizeInner, 0) + tickPadding
    const range = scale.range()
    const range0 = range[0] + 0.5
    const range1 = range[1] + 0.5
    const itemWidth = centerTicks ? axis.barWidth : 1
    // const seriesPadding = centerTicks ? axis.barPaddingOuter * axis.stepSize : 0
    const seriesPadding = 0
    const tickPosition = seriesPadding + (itemWidth / 2)

    return (
      <Animate
        data={{
          width,
          height,
          max,
          range0,
          range1,
          RTL,
          tickSizeOuter,
          tickPosition
        }}
      >
        {({
          width,
          height,
          max,
          range0,
          range1,
          RTL,
          tickSizeOuter,
          tickPosition
        }) => {
          let axisPath
          if (vertical) {
            if (position === positionLeft) {
              axisPath = `
                M ${-tickSizeOuter}, ${range0}
                H 0
                V ${range1}
                H ${-tickSizeOuter}
              `
            } else {
              axisPath = `
                M ${tickSizeOuter}, ${range0}
                H 0
                V ${range1}
                H ${tickSizeOuter}
              `
            }
          } else {
            if (position === positionBottom) {
              axisPath = `
                M 0, ${tickSizeOuter}
                V 0
                H ${range1}
                V ${tickSizeOuter}
              `
            } else {
              axisPath = `
                M 0, ${-tickSizeOuter}
                V 0
                H ${range1}
                V ${-tickSizeOuter}
              `
            }
          }

          return (
            <g
              className='Axis'
              fill='black'
              fontSize='10'
              fontFamily='sans-serif'
              transform={position === positionRight ? translateX(width) : position === positionBottom ? translateY(height) : undefined}
            >
              <Path
                className='domain'
                d={axisPath}
                style={{
                  stroke: '#acacac',
                  strokeWidth: '1',
                  fill: 'transparent'
                }}
              />
              <Transition
                data={ticks.map((d, i) => ({tick: d, index: i}))}
                getKey={(d, i) => String(d.tick)}
                update={d => ({
                  tick: scale(d.tick),
                  visibility: d.index % visibleLabelStep === 0 ? 1 : 0,
                  // visibility: 1,
                  measureable: 1,
                  rotation
                })}
                enter={d => ({
                  tick: this.prevAxis.scale(d.tick),
                  visibility: 0,
                  measureable: 1,
                  rotation: 0
                })}
                leave={d => ({
                  tick: scale(d.tick),
                  visibility: 0,
                  measureable: 0,
                  rotation
                })}
                ignore={['measureable']}
              >
                {(inters) => {
                  return (
                    <g
                      className='ticks'
                      ref={el => { this.el = el }}
                    >
                      {inters.map((inter) => {
                        return (
                          <g
                            key={inter.key}
                            className={'tick' + (inter.state.measureable ? ' -measureable' : '')}
                            transform={transform(inter.state.tick)}
                          >
                            <Line
                              x1={vertical ? '0.5' : tickPosition}
                              x2={vertical ? RTL * tickSizeInner : tickPosition}
                              y1={vertical ? tickPosition : '0.5'}
                              y2={vertical ? tickPosition : RTL * tickSizeInner}
                              style={{
                                strokeWidth: 1
                              }}
                              opacity={inter.state.visibility * 0.2}
                            />
                            {showGrid && (
                              <Line
                                x1={vertical ? '0.5' : '0.5'}
                                x2={vertical ? max : '0.5'}
                                y1={vertical ? '0.5' : '0.5'}
                                y2={vertical ? '0.5' : max}
                                style={{
                                  strokeWidth: 1
                                }}
                                opacity={inter.state.visibility * 0.2}
                              />
                            )}
                            <Text
                              opacity={inter.state.visibility}
                              fontSize={fontSize}
                              transform={`
                                translate(${vertical ? RTL * spacing : tickPosition}, ${vertical ? tickPosition : RTL * spacing})
                                rotate(${-rotation})
                              `}
                              dominantBaseline={rotation ? 'central' : position === positionBottom ? 'hanging' : position === positionTop ? 'alphabetic' : 'central'}
                              textAnchor={rotation ? 'end' : position === positionRight ? 'start' : position === positionLeft ? 'end' : 'middle'}
                            >
                              {format(inter.data.tick)}
                            </Text>
                          </g>
                        )
                      })}
                    </g>
                  )
                }}
              </Transition>
            </g>
          )
        }}
      </Animate>
    )
  }
}

export default Connect((state, props) => {
  const {
    type,
    position
  } = props

  const id = `${type}_${position}`

  return {
    id,
    accessedData: state.accessedData,
    width: Selectors.gridWidth(state),
    height: Selectors.gridHeight(state),
    primaryAxis: Selectors.primaryAxis(state),
    axis: state.axes && state.axes[id],
    showGrid: state.showGrid,
    tickArguments: state.tickArguments,
    tickValues: state.tickValues,
    tickFormat: state.tickFormat,
    tickSizeInner: state.tickSizeInner,
    tickSizeOuter: state.tickSizeOuter,
    tickPadding: state.tickPadding
  }
})(Axis)

function identity (x) {
  return x
}

function translateX (x) {
  return 'translate(' + x + ', 0)'
}

function translateY (y) {
  return 'translate(0, ' + y + ')'
}
