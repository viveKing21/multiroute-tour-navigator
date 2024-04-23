import React, { ReactNode, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import TourNavigator from 'tour-navigator'
import { TourNavigatorProps, HelperProps } from 'tour-navigator/lib/TourNavigator/types'


interface MultiRouteTourProps extends TourNavigatorProps{
  nextStepCount?: number;
  nextStepRoute?: string;
  number?: number;
  replace?: boolean
}

export default function MultiRouteTour({
  id,
  steps,
  startAt = TourNavigator.defaultProps.startAt || 0,
  nextStepCount = 0,
  nextStepRoute,
  number,
  replace = true,
  ...props
}: MultiRouteTourProps) {

  const navigate = useNavigate()
  const { state, pathname } = useLocation()
  
  const __multiRouteTour: Array<any> = state?.__multiRouteTour || []
  const lastState = __multiRouteTour[__multiRouteTour.length-1]
  const currentStateIndex = number == undefined ? (__multiRouteTour.length - (lastState?.id == id ? 1:0)):number-1;
  const previousStateIndex = currentStateIndex - 1
  const previousState = __multiRouteTour?.[previousStateIndex]

  let currentState = __multiRouteTour?.[currentStateIndex]

  if(currentState?.id != id){
    currentState = {
      id,
      focusAt: (previousState?.previousStepCount + previousState?.stepCount + startAt) || 0,
      stepRoute: pathname,
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
      navigate(nextStepRoute, {
        state: {
          __multiRouteTour: newState
        },
        replace
      })
    }else{
      currentState.focusAt = helperProps.currentStepIndex
      props.onNext?.(helperProps)
    }
  }

  const handlePrev = (helperProps: HelperProps) => {
    const isFirst = helperProps.currentStepIndex == (currentState.previousStepCount - 1)
    if(previousState && isFirst){
      navigate(currentState.previousStepRoute, {
        state: {__multiRouteTour: __multiRouteTour.filter(item => item.id != id)},
        replace
      })
    }else{
      currentState.focusAt = helperProps.currentStepIndex
      props.onPrev?.(helperProps)
    }
  }

  if(currentStateIndex != 0 && !previousState) return null;
  return (
    <TourNavigator
      {...props}
      id={id}
      steps={modifiedSteps}
      startAt={currentState.focusAt}
      onNext={handleNext}
      onPrev={handlePrev}
    />
  )
}
