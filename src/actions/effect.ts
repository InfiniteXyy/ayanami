import { Subject, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { EffectAction } from '../types'
import { logStateAction, getAyanamiName } from '../dev-helper'
import { Ayanami } from '../ayanami'
import { BasicState } from '../state'
import { effectSymbols } from './symbols'
import { createActionDecorator, getActionNames, updateActions, getAllActions } from './utils'

export const Effect = createActionDecorator(effectSymbols)

export const setupEffectActions = <M extends Ayanami<S>, S>(
  ayanami: M,
  basicState: BasicState<S>,
): void => {
  getActionNames(effectSymbols, ayanami.constructor).forEach((methodName) => {
    const payload$ = new Subject<any>()
    const effect$: Observable<EffectAction<M>> = ((ayanami as any)[methodName] as Function).call(
      ayanami,
      payload$,
      basicState.state$,
    )

    updateActions(effectSymbols, ayanami, {
      [methodName](payload: any) {
        payload$.next(payload)
      },
    })

    effect$
      .pipe(
        tap(({ ayanami: currentAyanami, actionName, params }) => {
          logStateAction(ayanami, {
            params,
            actionName: `${methodName}/👉${getAyanamiName(currentAyanami)}/️${actionName}`,
          })

          const actions: any = getAllActions(currentAyanami)
          actions[actionName as string](params)
        }),
      )
      // TODO - able to unsubscribe?
      .subscribe({
        error(e) {
          console.error(e)
        },
      })
  })
}
