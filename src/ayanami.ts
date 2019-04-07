import 'reflect-metadata'
import { ComponentType } from 'react'
import { Observable } from 'rxjs'

import { ConstructorOf, ActionOfAyanami, StateOfAyanami } from './types'
import { shared, getAllActionFactories } from './utils'
import { useAyanami } from './hooks'
import { connectAyanami } from './connect'

export abstract class Ayanami<State> {
  static connect<M extends Ayanami<any>, P>(this: ConstructorOf<M>, Component: ComponentType<P>) {
    return connectAyanami<M, StateOfAyanami<M>, P>(this, Component)
  }

  static useHooks<M extends Ayanami<any>>(this: ConstructorOf<M>) {
    return useAyanami<M, StateOfAyanami<M>>(this)
  }

  static getState<M extends Ayanami<any>>(this: ConstructorOf<M>) {
    return shared(this).getState<M>()
  }

  static getState$<M extends Ayanami<any>>(this: ConstructorOf<M>) {
    return shared(this).getState$<M>()
  }

  static getActions<M extends Ayanami<any>>(this: ConstructorOf<M>) {
    return shared(this).getActions<M>()
  }

  static getInstance<M extends Ayanami<S>, S>(this: ConstructorOf<M>): M {
    return new this()
  }

  abstract defaultState: State

  getState$!: <M extends Ayanami<any>>(
    this: M,
  ) => M extends Ayanami<infer S> ? Observable<Readonly<S>> : never

  getState!: <M extends Ayanami<any>>(this: M) => M extends Ayanami<infer S> ? Readonly<S> : never

  getActions<M extends Ayanami<any>>(
    this: M,
  ): M extends Ayanami<infer S> ? ActionOfAyanami<M, S> : never {
    return getAllActionFactories(this)
  }
}
