import { allActionSymbols, ActionSymbols } from '../symbols'
import { Ayanami } from '../ayanami'
import { ConstructorOf } from '../types'

export function createActionDecorator(symbols: ActionSymbols) {
  return () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    addActionName(symbols, target.constructor, propertyKey)
    return descriptor
  }
}

function addActionName(symbols: ActionSymbols, constructor: Function, actionName: string) {
  const decoratedActionNames = Reflect.getMetadata(symbols.decorator, constructor) || []
  Reflect.defineMetadata(symbols.decorator, [...decoratedActionNames, actionName], constructor)
}

export function getActionNames<T extends Ayanami<any>>(
  symbols: ActionSymbols,
  constructor: ConstructorOf<T>,
): (keyof T)[] {
  return Reflect.getMetadata(symbols.decorator, constructor) || []
}

export function getAllActionNames<T extends Ayanami<any>>(instance: T) {
  return allActionSymbols.reduce<(keyof T)[]>(
    (result, symbols) => [
      ...result,
      ...getActionNames(symbols, instance.constructor as ConstructorOf<T>),
    ],
    [],
  )
}
