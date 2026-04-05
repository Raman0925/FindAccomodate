import {type Instance} from 'mobx-state-tree';
import {RootStoreModel} from './RootStoreModel';

export type RootStore = Instance<typeof RootStoreModel>;

export const rootStore = RootStoreModel.create({
  auth: {},
});
