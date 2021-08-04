export type Remote<T, E> = {
  isNotAsked(): boolean;
  isLoading(): boolean;
  isLoaded(): boolean;
  isFailed(): boolean;
  map<U>(fn: (val: T) => U): Remote<U, E>;
  mapErr<F>(fn: (err: E) => F): Remote<T, F>;
  andThen<U>(fn: (val: T) => Remote<U, E>): Remote<U, E>;
  match<U>(fn: Match<T, E, U>): U;
  unwrapOr(planB: T): T;
};

export type Match<T, E, U> = {
  notAsked: () => U;
  loading: () => U;
  loaded: (val: T) => U;
  failed: (error: E) => U;
};

export function NotAsked<T, E>(): Remote<T, E> {
  return {
    isNotAsked(): boolean {
      return true;
    },
    isLoading(): boolean {
      return false;
    },
    isLoaded(): boolean {
      return false;
    },
    isFailed(): boolean {
      return false;
    },
    map<U>(_: (val: T) => U): Remote<U, E> {
      return NotAsked();
    },
    mapErr<F>(_: (err: E) => F): Remote<T, F> {
      return NotAsked();
    },
    andThen<U>(_: (val: T) => Remote<U, E>): Remote<U, E> {
      return NotAsked();
    },
    match<U>(matchObj: Match<T, E, U>): U {
      return matchObj.notAsked();
    },
    unwrapOr(val: T): T {
      return val;
    },
  };
}

export function Loading<T, E>(): Remote<T, E> {
  return {
    isNotAsked(): boolean {
      return false;
    },
    isLoading(): boolean {
      return true;
    },
    isLoaded(): boolean {
      return false;
    },
    isFailed(): boolean {
      return false;
    },
    map<U>(_: (val: T) => U): Remote<U, E> {
      return Loading();
    },
    mapErr<F>(_: (err: E) => F): Remote<T, F> {
      return Loading();
    },
    andThen<U>(_: (val: T) => Remote<U, E>): Remote<U, E> {
      return Loading();
    },
    match<U>(matchObj: Match<T, E, U>): U {
      return matchObj.loading();
    },
    unwrapOr(val: T): T {
      return val;
    },
  };
}

export function Loaded<T, E>(val: T): Remote<T, E> {
  return {
    isNotAsked(): boolean {
      return false;
    },
    isLoading(): boolean {
      return false;
    },
    isLoaded(): boolean {
      return true;
    },
    isFailed(): boolean {
      return false;
    },
    map<U>(fn: (val: T) => U): Remote<U, E> {
      return Loaded(fn(val));
    },
    mapErr<F>(_: (err: E) => F): Remote<T, F> {
      return Loaded(val);
    },
    andThen<U>(fn: (val: T) => Remote<U, E>): Remote<U, E> {
      return fn(val);
    },
    match<U>(matchObj: Match<T, E, U>): U {
      return matchObj.loaded(val);
    },
    unwrapOr(_: T): T {
      return val;
    },
  };
}

export function Failed<E, T>(err: E): Remote<T, E> {
  return {
    isNotAsked(): boolean {
      return false;
    },
    isLoading(): boolean {
      return false;
    },
    isLoaded(): boolean {
      return false;
    },
    isFailed(): boolean {
      return true;
    },
    map<U>(_: (val: T) => U): Remote<U, E> {
      return Failed(err);
    },
    mapErr<F>(fn: (err: E) => F): Remote<T, F> {
      return Failed(fn(err));
    },
    andThen<U>(_: (val: T) => Remote<U, E>): Remote<U, E> {
      return Failed(err);
    },
    match<U>(matchObj: Match<T, E, U>): U {
      return matchObj.failed(err);
    },
    unwrapOr(val: T): T {
      return val;
    },
  };
}
