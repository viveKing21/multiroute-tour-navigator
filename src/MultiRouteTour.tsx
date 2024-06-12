import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import TourNavigator from 'tour-navigator'
import { TourNavigatorProps, HelperProps, Step } from 'tour-navigator/lib/TourNavigator/types'


export interface MultiRouteTourProps extends TourNavigatorProps{
  nextStepCount?: number;
  nextStepRoute?: string;
  number?: number;
  state?: Array<any>;
  onNavigate?: (route: string, state: Array<any>) => void
}

export interface MultiRouteTourRefProps {
  id: string;
  currentStep: Step | null;
  target: HTMLElement | null;
  currentStepIndex: number;
  previousStepIndex: number;
  steps: Step[] | null;
  isScrollingIntoView: boolean;
  focus: (scrollBehavior?: 'auto' | 'smooth') => void;
  goto: (stepIndex: number) => void;
  next: () => void;
  prev: () => void;
  onRequestClose: (params: { event: MouseEvent | PointerEvent; isMask: boolean; isOverlay: boolean }) => void;
}

const MultiRouteTour = forwardRef<MultiRouteTourRefProps, MultiRouteTourProps>(({
  id = TourNavigator.defaultProps.id,
  steps,
  startAt = TourNavigator.defaultProps.startAt || 0,
  nextStepCount = 0,
  nextStepRoute,
  number,
  state,
  onNavigate,
  ...props
}, ref) => {
  
  const tourRef = useRef<TourNavigator>(null)

  const pathname = window.location.pathname
  const search = window.location.search
  
  const __multiRouteTour: Array<any> = state || []
  const lastState = __multiRouteTour[__multiRouteTour.length-1]
  const currentStateIndex = number == undefined ? (__multiRouteTour.length - (lastState?.id == id ? 1:0)):number-1;
  const previousStateIndex = currentStateIndex - 1
  const previousState = __multiRouteTour?.[previousStateIndex]

  let currentState = __multiRouteTour?.[currentStateIndex]

  if(currentState?.id != id){
    currentState = {
      id,
      focusAt: ((previousState?.previousStepCount + previousState?.stepCount) || 0) + startAt,
      stepRoute: pathname + search,
      stepCount: steps.length,
      previousStepCount: (previousState?.previousStepCount + previousState?.stepCount) || 0,
      previousStepRoute: previousState?.stepRoute || null,
    }
  }

  const modifiedSteps = useMemo(() => {
    return [
      ...Array(currentState.previousStepCount).fill(steps[0]),
      ...steps,
      ...Array(nextStepCount).fill(steps[steps.length-1])
    ]
  }, [steps])

  const handleNext = (helperProps: HelperProps) => {
    const lastStepForThisRoute = currentState.previousStepCount + currentState.stepCount
    const isLast = helperProps.currentStepIndex == lastStepForThisRoute

    if(nextStepRoute && isLast){
      let newState = [...__multiRouteTour]
      if(lastState?.id != id) newState.push(currentState)
      onNavigate?.(nextStepRoute, newState)
    }else{
      currentState.focusAt = helperProps.currentStepIndex
      props.onNext?.(helperProps)
    }
  }

  const handlePrev = (helperProps: HelperProps) => {
    const isFirst = helperProps.currentStepIndex == (currentState.previousStepCount - 1)
    if(previousState && isFirst){
      onNavigate?.(currentState.previousStepRoute, __multiRouteTour.filter(item => item.id != id))
    }else{
      currentState.focusAt = helperProps.currentStepIndex
      props.onPrev?.(helperProps)
    }
  }

  useImperativeHandle(ref, () => ({
    get id() {
      return tourRef.current?.props.id ?? '';
    },
    get currentStep() {
      return tourRef.current?.currentStep ?? null;
    },
    get target() {
      return tourRef.current?.currentElement ?? null;
    },
    get currentStepIndex() {
      return tourRef.current?.currentStepIndex ?? 0;
    },
    get previousStepIndex() {
      return tourRef.current?.state.previousStepIndex ?? -1;
    },
    get steps() {
      return tourRef.current?.props.steps ?? TourNavigator.defaultProps.steps ?? null;
    },
    get isScrollingIntoView() {
      return tourRef.current?.state.isScrollingIntoView ?? false;
    },
    focus: (scrollBehavior = 'auto') => tourRef.current?.focus(scrollBehavior),
    goto: (stepIndex) => tourRef.current?.goto(stepIndex),
    next: () => tourRef.current?.next(),
    prev: () => tourRef.current?.prev(),
    onRequestClose: (params) => tourRef.current?.props.onRequestClose?.(params)
  }), [tourRef])

  if(currentStateIndex != 0 && !previousState) return null;
  return (
    <TourNavigator
      {...props}
      id={id}
      steps={modifiedSteps}
      startAt={currentState.focusAt}
      onNext={handleNext}
      onPrev={handlePrev}
      ref={tourRef}
    />
  )
})

export default MultiRouteTour