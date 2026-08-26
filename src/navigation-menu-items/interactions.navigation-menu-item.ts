import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'f0dd945a-cbe0-450e-93e1-d91d87fef737',
  name: 'Переписки', icon: 'IconMessages', position: 4,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: OBJECT_IDS.interaction,
});
