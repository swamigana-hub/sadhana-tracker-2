import { useCallback, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { tryGetSupabase } from '../lib/supabase/client';
import {
  applyListAction,
  getPracticeListMenuOptions,
  type ListMenuAction,
  type ListMenuContext,
} from '../services/practiceListMenu';
import { persistPracticeListChange } from '../services/practiceListChange';
import { setPracticeListTooltipDismissed } from '../services/localStore';

export interface MenuState {
  practiceId: string;
  instanceId: string | null;
  context: ListMenuContext;
  x: number;
  y: number;
}

export function usePracticeListManagement() {
  const { deviceId, practiceInstances } = useAppData();
  const { lists, replaceListsOptimistic } = practiceInstances;

  const [menu, setMenu] = useState<MenuState | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);

  const openMenu = useCallback(
    (
      practiceId: string,
      context: ListMenuContext,
      x: number,
      y: number,
      instanceId: string | null = null
    ) => {
      setPracticeListTooltipDismissed(true);
      setPressedId(instanceId ?? practiceId);
      setMenu({ practiceId, instanceId, context, x, y });
    },
    []
  );

  const closeMenu = useCallback(() => {
    setMenu(null);
    setPressedId(null);
  }, []);

  const applyAction = useCallback(
    async (action: ListMenuAction) => {
      if (!menu) return;

      const { lists: nextLists, previousStatus, newStatus } = applyListAction(
        lists,
        menu.instanceId,
        menu.practiceId,
        action
      );

      replaceListsOptimistic(nextLists, deviceId, tryGetSupabase());

      await persistPracticeListChange(tryGetSupabase(), deviceId, nextLists, {
        practiceId: menu.practiceId,
        previousStatus,
        newStatus,
      });

      closeMenu();
    },
    [menu, lists, deviceId, replaceListsOptimistic, closeMenu]
  );

  const contextMenuOptions = menu
    ? getPracticeListMenuOptions(menu.context, lists, menu.practiceId).map((opt) => ({
        label: opt.label,
        onClick: () => {
          void applyAction(opt.action);
        },
      }))
    : [];

  return {
    menu,
    pressedId,
    openMenu,
    closeMenu,
    contextMenuOptions,
    applyAction,
  };
}
