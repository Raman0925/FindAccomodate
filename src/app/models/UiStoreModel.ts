import {types} from 'mobx-state-tree';

/**
 * Lightweight UI store (MobX State Tree) — same pattern as our-app singleton stores.
 */
export const UiStoreModel = types
  .model('UiStore', {
    homeTapCount: types.optional(types.number, 0),
  })
  .actions(self => ({
    incrementHomeTaps() {
      self.homeTapCount += 1;
    },
    resetHomeTaps() {
      self.homeTapCount = 0;
    },
  }));

export type UiStore = typeof UiStoreModel.Type;
