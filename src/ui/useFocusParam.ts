import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Screens are reachable from the command palette as /route?focus=<id>. This keeps
 * the selected row in local state so closing the panel does not push history,
 * but still reacts when the palette navigates to a new id on the same screen.
 */
export function useFocusParam(): [string | null, (id: string | null) => void] {
  const [params, setParams] = useSearchParams();
  const focus = params.get('focus');
  const [selected, setSelected] = useState<string | null>(focus);

  useEffect(() => {
    if (focus) setSelected(focus);
  }, [focus]);

  const set = (id: string | null) => {
    setSelected(id);
    if (!id && focus) {
      const next = new URLSearchParams(params);
      next.delete('focus');
      setParams(next, { replace: true });
    }
  };

  return [selected, set];
}
