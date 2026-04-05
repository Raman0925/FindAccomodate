import {types} from 'mobx-state-tree';
import {AuthStoreModel} from './AuthStoreModel';

export const RootStoreModel = types.model('RootStore', {
  auth: AuthStoreModel,
});
