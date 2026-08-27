import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '58b27e5b-cb55-4d11-a78e-2c7ed0cb9011',
  name: 'Комментарии к задачам', position: 9,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: OBJECT_IDS.taskComment,
});
