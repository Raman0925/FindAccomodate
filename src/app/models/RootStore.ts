import {types, type Instance} from 'mobx-state-tree';
import {AuthStoreModel} from './AuthStoreModel';

export const RootStoreModel = types.model('RootStore', {
  auth: AuthStoreModel,
});

export type RootStore = Instance<typeof RootStoreModel>;

export const rootStore = RootStoreModel.create({
  auth: {},
});
