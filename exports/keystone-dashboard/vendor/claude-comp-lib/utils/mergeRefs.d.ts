import { Ref, RefCallback } from 'react';
/** Combine several refs (callback or object) into one callback ref. */
export declare function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T>;
