import { ScaleBand, ScaleLinear, ScaleOrdinal, ScaleTime } from 'd3-scale'
import { CurveFactory, stackOffsetNone } from 'd3-shape'
import { SetStateAction } from 'jotai'
import { CSSProperties } from 'react'
import * as TSTB from 'ts-toolbelt'

import { TooltipRendererProps } from './components/TooltipRenderer'
import { SetAtom } from 'jotai/core/atom'

export type ChartOptions<TDatum> = {
  data: UserSerie<TDatum>[]
  primaryAxis: AxisOptions<TDatum>
  secondaryAxes: AxisOptions<TDatum>[]
  getSeriesStyle?: (
    series: Series<TDatum>,
    status: SeriesFocusStatus
  ) => SeriesStyles
  getDatumStyle?: (
    series: Datum<TDatum>,
    status: DatumFocusStatus
  ) => DatumStyles
  getSeriesOrder?: (series: Series<TDatum>[]) => Series<TDatum>[]
  groupingMode?: GroupingMode
  showVoronoi?: boolean
  showDebugAxes?: boolean
  defaultColors?: string[]
  initialWidth?: number
  initialHeight?: number
  brush?: {
    style?: CSSProperties
    onSelect?: (selection: {
      pointer: Pointer
      start: unknown
      end: unknown
    }) => void
  }
  onFocusDatum?: (datum: Datum<TDatum> | null) => void
  onClickDatum?: (
    datum: Datum<TDatum> | null,
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => void
  dark?: boolean
  renderSVG?: () => React.ReactSVGElement
  primaryCursor?: boolean | CursorOptions
  secondaryCursor?: boolean | CursorOptions
  tooltip?: boolean | TooltipOptions
}

export type RequiredChartOptions<TDatum> = TSTB.Object.Required<
  ChartOptions<TDatum>,
  | 'getSeriesStyle'
  | 'getDatumStyle'
  | 'getSeriesOrder'
  | 'groupingMode'
  | 'showVoronoi'
  | 'defaultColors'
  | 'initialWidth'
  | 'initialHeight'
>

export type ChartContextValue<TDatum> = {
  getOptions: () => RequiredChartOptions<TDatum>
  gridDimensions: GridDimensions
  primaryAxis: Axis<TDatum>
  secondaryAxes: Axis<TDatum>[]
  axesInfo: AxesInfo
  series: Series<TDatum>[]
  orderedSeries: Series<TDatum>[]
  groupedDatums: Map<any, Datum<TDatum>[]>
  width: number
  height: number
  getSeriesStatusStyle: (
    series: Series<TDatum>,
    focusedDatum: Datum<TDatum> | null
  ) => SeriesStyles
  getDatumStatusStyle: (
    datum: Datum<TDatum>,
    focusedDatum: Datum<TDatum> | null
  ) => DatumStyles
  usePointerAtom: () => [Pointer, SetAtom<SetStateAction<Pointer>>]
  useChartOffsetAtom: () => [ChartOffset, SetAtom<SetStateAction<ChartOffset>>]
  useAxisDimensionsAtom: () => [
    AxisDimensions,
    SetAtom<SetStateAction<AxisDimensions>>
  ]
  useFocusedDatumAtom: () => [
    Datum<TDatum> | null,
    SetAtom<SetStateAction<Datum<TDatum> | null>>
  ]
}

export type TooltipOptions<TDatum> = {
  align?: AlignMode
  alignPriority?: AlignPosition[]
  padding?: number
  tooltipArrowPadding?: number
  anchor?: AnchorMode
  arrowPosition?: AlignPosition
  render?: (props: TooltipRendererProps<TDatum>) => React.ReactNode
  formatSecondary?: (d: unknown) => string | number
  formatTertiary?: (d: unknown) => string | number
  invert?: boolean
}

export type ResolvedTooltipOptions<TDatum> = TSTB.Object.Required<
  TooltipOptions<TDatum>,
  | 'align'
  | 'alignPriority'
  | 'padding'
  | 'tooltipArrowPadding'
  | 'anchor'
  | 'render'
>

export type SeriesStyles = CSSProperties & {
  area?: CSSProperties
  line?: CSSProperties
  circle?: CSSProperties
  rectangle?: CSSProperties
}

export type DatumStyles = CSSProperties & {
  area?: CSSProperties
  line?: CSSProperties
  circle?: CSSProperties
  rectangle?: CSSProperties
}

export type Position = 'top' | 'right' | 'bottom' | 'left'

export type GroupingMode = 'single' | 'series' | 'primary' | 'secondary'

export type AlignMode =
  | 'auto'
  | 'right'
  | 'topRight'
  | 'bottomRight'
  | 'left'
  | 'topLeft'
  | 'bottomLeft'
  | 'top'
  | 'bottom'
  | 'center'

export type AlignPosition =
  | 'right'
  | 'topRight'
  | 'bottomRight'
  | 'left'
  | 'topLeft'
  | 'bottomLeft'
  | 'top'
  | 'bottom'

export type AxisType = 'ordinal' | 'time' | 'localTime' | 'linear' | 'log'

export type AnchorMode =
  | 'pointer'
  | 'closest'
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'gridTop'
  | 'gridBottom'
  | 'gridLeft'
  | 'gridRight'
  | 'gridCenter'

export type Side = 'left' | 'right' | 'top' | 'bottom'

type PointerBase = {
  x: number
  y: number
  svgHovered: boolean
}

export type PointerUnpressed = PointerBase & {
  dragging: false
}

export type PointerPressed = PointerBase & {
  dragging: true
  startX: number
  startY: number
}

export type Pointer = PointerUnpressed | PointerPressed

export type ChartOffset = {
  left: number
  top: number
}

export type AxisDimension = {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

export type AxisDimensions = {
  left: Record<string, AxisDimension>
  right: Record<string, AxisDimension>
  top: Record<string, AxisDimension>
  bottom: Record<string, AxisDimension>
}

export type AxisOptionsBase = {
  isPrimary?: boolean
  primaryAxisId?: string
  elementType?: 'line' | 'area' | 'bar'
  showDatumElements?: boolean
  showOrphanDatumElements?: boolean
  curve?: CurveFactory
  invert?: boolean
  position: Position
  tickCount?: number
  minTickCount?: number
  maxTickCount?: number
  tickValues?: unknown[]
  format?: (value: unknown, index: number, scaleLabel: string) => string
  tickSizeInner?: number
  tickSizeOuter?: number
  tickPadding?: number
  labelRotation?: number
  innerPadding?: number
  outerPadding?: number
  showGrid?: boolean
  showTicks?: boolean
  filterTicks?: <T extends string>(ticks: T[]) => T[]
  show?: boolean
  stacked?: boolean
  stackOffset?: typeof stackOffsetNone
  id?: string
  styles?: CSSProperties & {
    line?: CSSProperties
    tick?: CSSProperties
  }
}

export type AxisTimeOptions<TDatum> = AxisOptionsBase & {
  scaleType: 'time' | 'localTime'
  getValue: (datum: TDatum) => ChartValue<Date>
  min?: number
  max?: number
  hardMin?: number
  hardMax?: number
  base?: number
}

export type AxisOrdinalOptions<TDatum> = AxisOptionsBase & {
  scaleType: 'ordinal'
  getValue: (datum: TDatum) => ChartValue<any>
}

export type AxisBandOptions<TDatum> = AxisOptionsBase & {
  scaleType: 'band'
  getValue: (datum: TDatum) => ChartValue<any>
  minBandSize?: number
}

export type AxisLinearOptions<TDatum> = AxisOptionsBase & {
  scaleType: 'linear' | 'log'
  getValue: (datum: TDatum) => ChartValue<number>
  min?: number
  max?: number
  hardMin?: number
  hardMax?: number
  base?: number
}

export type AxisOptions<TDatum> =
  | AxisTimeOptions<TDatum>
  | AxisOrdinalOptions<TDatum>
  | AxisBandOptions<TDatum>
  | AxisLinearOptions<TDatum>

export type ResolvedAxisOptions<TAxisOptions> = TSTB.Object.Required<
  TAxisOptions & {},
  | 'tickCount'
  | 'minTickCount'
  | 'maxTickCount'
  | 'tickSizeInner'
  | 'tickSizeOuter'
  | 'tickPadding'
  | 'labelRotation'
  | 'innerPadding'
  | 'outerPadding'
  | 'showTicks'
  | 'filterTicks'
  | 'show'
  | 'stacked'
>

export type ChartValue<T> = T | null | undefined

export type AxisBase<TDatum> = {
  _?: TDatum
  isVertical: boolean
  range: [number, number]
  // isPrimary?: boolean
  // primaryAxisId?: string
  // isTimeType: boolean
  // uniquePrimariesSet: Set<unknown>
  // barSize: number
  // cursorSize: number
  // stepSize: number
  // seriesBandScale?: ScaleBand<string>
  // seriesBarSize: number
  // domain: [unknown, unknown] | unknown[]
  // directionMultiplier: -1 | 1
  // transform: typeof translateX | typeof translateY
  // ticks: unknown[]
  // format: (value: unknown, index: number) => string
  // tickSpacing: number
  // tickOffset: number
  // barOffset: number
  // gridOffset: number
}

export type AxisTime<TDatum> = Omit<
  AxisBase<TDatum> & ResolvedAxisOptions<AxisTimeOptions<TDatum>>,
  'format'
> & {
  axisFamily: 'time'
  scale: ScaleTime<number, number, never>
  outerScale: ScaleTime<number, number, never>
  bandScale: ScaleBand<number>
  format: ReturnType<ScaleTime<number, number, never>['tickFormat']>
}

export type AxisLinear<TDatum> = Omit<
  AxisBase<TDatum> & ResolvedAxisOptions<AxisLinearOptions<TDatum>>,
  'format'
> & {
  axisFamily: 'linear'
  scale: ScaleLinear<number, number, never>
  outerScale: ScaleLinear<number, number, never>
  bandScale: ScaleBand<number>
  format: ReturnType<ScaleLinear<number, number, never>['tickFormat']>
}

export type AxisBand<TDatum> = Omit<
  AxisBase<TDatum> & ResolvedAxisOptions<AxisBandOptions<TDatum>>,
  'format'
> & {
  axisFamily: 'band'
  scale: ScaleBand<any>
  outerScale: ScaleBand<any>
  format: (value: ChartValue<any>) => string
}

export type Axis<TDatum> =
  | AxisTime<TDatum>
  | AxisLinear<TDatum>
  | AxisBand<TDatum>

export type UserSerie<TDatum> = {
  data: TDatum[]
  id?: string
  label?: string
  color?: string
  primaryAxisId?: string
  secondaryAxisId?: string
}

//

export type Series<TDatum> = {
  originalSeries: UserSerie<TDatum>
  index: number
  id: string
  label: string
  secondaryAxisId?: string
  datums: Datum<TDatum>[]
  style?: CSSProperties
}

export type Datum<TDatum> = {
  originalSeries: UserSerie<TDatum>
  seriesIndex: number
  seriesId: string
  seriesLabel: string
  index: number
  originalDatum: TDatum
  secondaryAxisId?: string
  stackData?: StackDatum<TDatum>
  group?: Datum<TDatum>[]
  style?: CSSProperties
}

export type StackDatum<TDatum> = {
  0: number
  1: number
  data: Datum<TDatum>
}

//

export type Measurement = Side | 'width' | 'height'

export type GridDimensions = {
  gridX: number
  gridY: number
  gridWidth: number
  gridHeight: number
}

export type AxesInfo = {
  xKey: 'primary' | 'secondary'
  yKey: 'primary' | 'secondary'
}

export type CursorOptions = {
  value?: unknown
  show?: boolean
  render?: (meta: { formattedValue: string }) => React.ReactNode
  snap?: boolean
  showLine?: boolean
  showLabel?: boolean
  axisId?: string
  onChange?: () => void
}

export type SeriesFocusStatus = 'none' | 'focused'

export type DatumFocusStatus = 'none' | 'focused' | 'groupFocused'
