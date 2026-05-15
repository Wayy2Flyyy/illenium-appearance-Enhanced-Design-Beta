import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import CameraAngleRail from './CameraAngleRail';
import {
  ComponentConfig,
  ComponentSettings,
  HairSettings,
  PedAppearance,
  PedComponent,
  PedHair,
  PedProp,
  PropConfig,
  PropSettings,
  CameraPreset,
} from './interfaces';

type CategoryType = 'component' | 'prop' | 'hair';

interface Category {
  id: string;
  title: string;
  type: CategoryType;
  targetId?: number;
  enabled: boolean;
}

interface ClothingHeroProps {
  componentSettings: ComponentSettings[];
  propSettings: PropSettings[];
  hairSettings: HairSettings;
  data: PedAppearance;
  storedData: PedAppearance;
  componentConfig: ComponentConfig;
  propConfig: PropConfig;
  hasTracker: boolean;
  isPedFreemodeModel: boolean | undefined;
  handleComponentDrawableChange: (component_id: number, drawable: number) => void;
  handleComponentTextureChange: (component_id: number, texture: number) => void;
  handlePropDrawableChange: (prop_id: number, drawable: number) => void;
  handlePropTextureChange: (prop_id: number, texture: number) => void;
  handleHairChange: (key: keyof PedHair, value: number) => void;
  handleSave: () => void;
  handleExit: () => void;
  enableExit: boolean;
  cameraPreset: CameraPreset;
  onCameraPreset: (preset: CameraPreset) => void;
}

interface PillProps {
  active?: boolean;
}

interface CardProps {
  active?: boolean;
  preview?: boolean;
}

const Layer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

/** Top chrome: category pills centered with ‹ › scroll arrows. */
const CategoryTopChrome = styled.div`
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: min(940px, 82vw);
  pointer-events: auto;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScrollArrowRound = styled.button`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: var(--w2f-text);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
  transition: border-color 0.12s, color 0.12s;

  &:hover {
    border-color: rgba(239, 68, 68, 0.85);
    color: #fff;
  }

  &:disabled {
    opacity: 0.25;
    pointer-events: none;
  }
`;

const CategoryScroll = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;

  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;

  scroll-behavior: smooth;
  cursor: grab;

  &.dragging {
    cursor: grabbing;
    scroll-behavior: auto;
    user-select: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 1px solid rgba(239, 68, 68, 0.45);
    outline-offset: 2px;
    border-radius: 999px;
  }
`;

const Pill = styled.button<PillProps>`
  flex-shrink: 0;
  padding: 8px 16px;
  height: 36px;
  border-radius: 999px;
  color: ${({ active }) => (active ? '#fff' : 'rgba(240, 242, 248, 0.55)')};
  border: 1px solid ${({ active }) => (active ? 'rgba(239, 68, 68, 0.7)' : 'transparent')};
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s;

  &:hover {
    color: #fff;
  }
`;

const StripWrap = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 168px;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavBtn = styled.button`
  width: 42px;
  height: 42px;
  margin: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: var(--w2f-text);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
  transition: border-color 0.12s, color 0.12s;

  &:hover {
    border-color: rgba(239, 68, 68, 0.85);
    color: #fff;
  }
`;

const Strip = styled.div`
  width: min(900px, 72vw);
  height: 168px;
  overflow: hidden;
  position: relative;
  cursor: grab;

  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);

  &.dragging {
    cursor: grabbing;
  }
`;

const StripInner = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  will-change: transform;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);

  &.no-anim {
    transition: none;
  }
`;

const Card = styled.div<CardProps>`
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: 16px;
  border: 1px solid
    ${({ active, preview }) =>
      active
        ? 'rgba(239, 68, 68, 0.9)'
        : preview
          ? 'rgba(255, 255, 255, 0.22)'
          : 'rgba(255, 255, 255, 0.1)'};
  background: transparent;
  box-shadow: ${({ active }) =>
    active ? '0 0 34px rgba(239, 68, 68, 0.32), inset 0 0 0 1px rgba(239, 68, 68, 0.4)' : 'none'};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  color: ${({ active }) => (active ? '#fff' : 'rgba(240, 242, 248, 0.85)')};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  user-select: none;
  transform: ${({ active }) => (active ? 'scale(1)' : 'scale(0.86)')};
  opacity: ${({ active }) => (active ? 1 : 0.65)};
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, border-color 0.12s,
    box-shadow 0.12s;

  small {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  strong {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 116px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  pointer-events: auto;
`;

const Dot = styled.button<PillProps>`
  width: 9px;
  height: 9px;
  border: 0;
  border-radius: 999px;
  background: ${({ active }) => (active ? 'var(--w2f-red-hot)' : 'rgba(255, 255, 255, 0.16)')};
  box-shadow: ${({ active }) => (active ? '0 0 14px rgba(239, 68, 68, 0.74)' : 'none')};
  cursor: pointer;
  padding: 0;
  transition: background 0.12s, transform 0.12s;

  &:hover {
    transform: scale(1.2);
  }
`;

const BottomBar = styled.div`
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  width: min(820px, 70vw);
  pointer-events: auto;

  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: transparent;
`;

const Slots = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 6px;
`;

const Slot = styled.button<PillProps>`
  height: 36px;
  border-radius: 10px;
  border: 1px solid
    ${({ active }) => (active ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.14)')};
  background: transparent;
  color: ${({ active }) => (active ? '#fff' : 'rgba(240, 242, 248, 0.7)')};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
  cursor: pointer;
  transition: border-color 0.12s, color 0.12s;

  &:hover {
    color: #fff;
    border-color: rgba(239, 68, 68, 0.9);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Action = styled.button<{ tone?: 'primary' | 'ghost' | 'danger' }>`
  height: 36px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid
    ${({ tone }) =>
      tone === 'primary'
        ? 'rgba(239, 68, 68, 0.85)'
        : tone === 'danger'
          ? 'rgba(255, 255, 255, 0.18)'
          : 'rgba(255, 255, 255, 0.18)'};
  background: transparent;
  color: ${({ tone }) => (tone === 'primary' ? '#fff' : 'rgba(240, 242, 248, 0.9)')};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s, box-shadow 0.12s;

  &:hover {
    color: #fff;
    border-color: rgba(239, 68, 68, 0.95);
    box-shadow: ${({ tone }) =>
      tone === 'primary' ? '0 0 22px rgba(239, 68, 68, 0.45)' : '0 0 14px rgba(239, 68, 68, 0.28)'};
  }
`;

const DRAG_CLICK_THRESHOLD = 18;

const safeNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const safeRange = (min = 0, max = 0) => {
  const safeMin = safeNumber(min, 0);
  const safeMax = safeNumber(max, safeMin);

  if (safeMax < safeMin) return [safeMin];

  return Array.from({ length: Math.max(0, safeMax - safeMin + 1) }, (_, index) => safeMin + index);
};

const isEnabled = (value: unknown, fallback = true) => {
  if (typeof value === 'boolean') return value;
  return fallback;
};

const byComponentId = (items: PedComponent[]) =>
  items.reduce((result, item) => ({ ...result, [item.component_id]: item }), {} as Record<number, PedComponent>);

const byPropId = (items: PedProp[]) =>
  items.reduce((result, item) => ({ ...result, [item.prop_id]: item }), {} as Record<number, PedProp>);

const componentSettingsById = (items: ComponentSettings[]) =>
  items.reduce((result, item) => ({ ...result, [item.component_id]: item }), {} as Record<number, ComponentSettings>);

const propSettingsById = (items: PropSettings[]) =>
  items.reduce((result, item) => ({ ...result, [item.prop_id]: item }), {} as Record<number, PropSettings>);

const CARD_WIDTH = 150;
const CARD_GAP = 14;
const STRIDE = CARD_WIDTH + CARD_GAP;

const ClothingHero = ({
  componentSettings,
  propSettings,
  hairSettings,
  data,
  componentConfig,
  propConfig,
  hasTracker,
  isPedFreemodeModel,
  handleComponentDrawableChange,
  handleComponentTextureChange,
  handlePropDrawableChange,
  handlePropTextureChange,
  handleHairChange,
  handleSave,
  handleExit,
  enableExit,
  cameraPreset,
  onCameraPreset,
}: ClothingHeroProps) => {
  const componentData = useMemo(() => byComponentId(data.components), [data.components]);
  const propData = useMemo(() => byPropId(data.props), [data.props]);
  const compSettings = useMemo(() => componentSettingsById(componentSettings), [componentSettings]);
  const prSettings = useMemo(() => propSettingsById(propSettings), [propSettings]);

const categories = useMemo<Category[]>(() => {
  const all: Category[] = [
    {
      id: 'head',
      title: 'Head',
      type: 'component',
      targetId: 0,
      enabled: !isPedFreemodeModel,
    },
    {
      id: 'mask',
      title: 'Mask',
      type: 'component',
      targetId: 1,
      enabled: isEnabled(componentConfig?.masks),
    },
    {
      id: 'hair',
      title: 'Hair',
      type: 'hair',
      enabled: true,
    },
    {
      id: 'torso',
      title: 'Torso',
      type: 'component',
      targetId: 11,
      enabled: isEnabled(componentConfig?.jackets),
    },
    {
      id: 'shirt',
      title: 'Shirt',
      type: 'component',
      targetId: 8,
      enabled: isEnabled(componentConfig?.shirts),
    },
    {
      id: 'hands',
      title: 'Hands',
      type: 'component',
      targetId: 3,
      enabled: isEnabled(componentConfig?.upperBody),
    },
    {
      id: 'legs',
      title: 'Legs',
      type: 'component',
      targetId: 4,
      enabled: isEnabled(componentConfig?.lowerBody),
    },
    {
      id: 'shoes',
      title: 'Shoes',
      type: 'component',
      targetId: 6,
      enabled: isEnabled(componentConfig?.shoes),
    },
    {
      id: 'bag',
      title: 'Bag',
      type: 'component',
      targetId: 5,
      enabled: isEnabled(componentConfig?.bags),
    },
    {
      id: 'accessories',
      title: 'Chains',
      type: 'component',
      targetId: 7,
      enabled: isEnabled(componentConfig?.scarfAndChains) && !hasTracker,
    },
    {
      id: 'hat',
      title: 'Hat',
      type: 'prop',
      targetId: 0,
      enabled: isEnabled(propConfig?.hats),
    },
    {
      id: 'glasses',
      title: 'Glasses',
      type: 'prop',
      targetId: 1,
      enabled: isEnabled(propConfig?.glasses),
    },
    {
      id: 'earrings',
      title: 'Earrings',
      type: 'prop',
      targetId: 2,
      enabled: isEnabled(propConfig?.ear),
    },
    {
      id: 'watch',
      title: 'Watch',
      type: 'prop',
      targetId: 6,
      enabled: isEnabled(propConfig?.watches),
    },
    {
      id: 'bracelet',
      title: 'Bracelet',
      type: 'prop',
      targetId: 7,
      enabled: isEnabled(propConfig?.bracelets),
    },
  ];

  return all.filter(category => category.enabled);
}, [componentConfig, propConfig, hasTracker, isPedFreemodeModel]);

  const [activeId, setActiveId] = useState(categories[0]?.id ?? 'hair');
  const activeCategory = categories.find(c => c.id === activeId) || categories[0];

  const [slots, setSlots] = useState<(PedAppearance | null)[]>(Array(8).fill(null));

  // Top category pills: horizontal drag-scroll + ‹ › arrows.
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryDrag = useRef({ dragging: false, startX: 0, scroll0: 0, pointerId: 0 });
  const suppressCategoryClick = useRef(false);
  const [categoryBarDragging, setCategoryBarDragging] = useState(false);
  const [canScrollCatsLeft, setCanScrollCatsLeft] = useState(false);
  const [canScrollCatsRight, setCanScrollCatsRight] = useState(false);

  const updateCategoryScrollHints = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const eps = 2;
    setCanScrollCatsLeft(el.scrollLeft > eps);
    setCanScrollCatsRight(el.scrollLeft < maxScroll - eps);
  }, []);

  const scrollCategoryRow = useCallback(
    (dir: -1 | 1) => {
      const el = categoryScrollRef.current;
      if (!el) return;
      const step = Math.round(Math.min(340, Math.max(160, el.clientWidth * 0.42)));
      el.scrollBy({ left: dir * step, behavior: 'smooth' });
      window.setTimeout(updateCategoryScrollHints, 400);
    },
    [updateCategoryScrollHints],
  );

  useEffect(() => {
    updateCategoryScrollHints();

    const el = categoryScrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => updateCategoryScrollHints());
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories, updateCategoryScrollHints]);

  useEffect(() => {
    if (categoryBarDragging) return;
    const root = categoryScrollRef.current;
    if (!root) return;
    const btn = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-category]')).find(
      b => b.getAttribute('data-category') === activeId,
    );
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    const t = window.setTimeout(updateCategoryScrollHints, 380);
    return () => window.clearTimeout(t);
  }, [activeId, categories.length, categoryBarDragging, updateCategoryScrollHints]);

  const handleCategoryPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const el = categoryScrollRef.current;
    if (!el) return;

    suppressCategoryClick.current = false;
    categoryDrag.current = {
      dragging: true,
      startX: event.clientX,
      scroll0: el.scrollLeft,
      pointerId: event.pointerId,
    };
    setCategoryBarDragging(true);
    try {
      el.setPointerCapture(event.pointerId);
    } catch {
      /* CEF occasionally rejects capture */
    }
  }, []);

const handleCategoryPointerMove = useCallback(
  (event: React.PointerEvent<HTMLDivElement>) => {
    if (!categoryDrag.current.dragging || !categoryScrollRef.current) return;

    const dx = event.clientX - categoryDrag.current.startX;

    if (Math.abs(dx) > DRAG_CLICK_THRESHOLD) {
      suppressCategoryClick.current = true;
      categoryScrollRef.current.scrollLeft = categoryDrag.current.scroll0 - dx;
      updateCategoryScrollHints();
    }
  },
  [updateCategoryScrollHints],
);

  const handleCategoryPointerUpOrCancel = useCallback(
  (event: React.PointerEvent<HTMLDivElement>) => {
    if (!categoryDrag.current.dragging) return;
    if (categoryDrag.current.pointerId !== event.pointerId) return;

    categoryDrag.current.dragging = false;
    setCategoryBarDragging(false);

    try {
      categoryScrollRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }

    updateCategoryScrollHints();

    window.setTimeout(() => {
      suppressCategoryClick.current = false;
    }, 0);
  },
  [updateCategoryScrollHints],
);

const handleLostCategoryPointerCapture = useCallback(() => {
  categoryDrag.current.dragging = false;
  suppressCategoryClick.current = false;
  setCategoryBarDragging(false);
  updateCategoryScrollHints();
}, [updateCategoryScrollHints]);

  // Drag state for the carousel.
  const stripRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startOffset: 0, moved: 0 });
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(true);

  const drawableRange = useCallback(
    (category: Category): number[] => {
      if (category.type === 'hair') return safeRange(hairSettings?.style?.min ?? 0, hairSettings?.style?.max ?? 0);
      if (category.type === 'component' && category.targetId !== undefined) {
        const settings = compSettings[category.targetId];
        return safeRange(settings?.drawable.min ?? 0, settings?.drawable.max ?? 0);
      }
      if (category.type === 'prop' && category.targetId !== undefined) {
        const settings = prSettings[category.targetId];
        return safeRange(settings?.drawable.min ?? -1, settings?.drawable.max ?? -1);
      }
      return [];
    },
    [compSettings, prSettings, hairSettings],
  );

  const currentDrawable = useCallback(
    (category: Category) => {
      if (category.type === 'hair') return data.hair.style;
      if (category.type === 'component' && category.targetId !== undefined) return componentData[category.targetId]?.drawable ?? 0;
      if (category.type === 'prop' && category.targetId !== undefined) return propData[category.targetId]?.drawable ?? 0;
      return 0;
    },
    [componentData, propData, data.hair.style],
  );

  const currentTexture = useCallback(
    (category: Category) => {
      if (category.type === 'hair') return data.hair.texture;
      if (category.type === 'component' && category.targetId !== undefined) return componentData[category.targetId]?.texture ?? 0;
      if (category.type === 'prop' && category.targetId !== undefined) return propData[category.targetId]?.texture ?? 0;
      return 0;
    },
    [componentData, propData, data.hair.texture],
  );

  const textureRange = useCallback(
    (category: Category, drawable: number): number[] => {
      if (category.type === 'hair') {
        return safeRange(0, hairSettings?.texture?.max ?? 0);
      }
      if (category.type === 'component' && category.targetId !== undefined) {
        const settings = compSettings[category.targetId];
        return safeRange(0, settings?.texture.max ?? 0);
      }
      if (category.type === 'prop' && category.targetId !== undefined) {
        const settings = prSettings[category.targetId];
        return safeRange(0, settings?.texture.max ?? 0);
      }
      return [drawable];
    },
    [compSettings, prSettings, hairSettings],
  );

  const changeDrawable = (category: Category, drawable: number) => {
    if (category.type === 'hair') handleHairChange('style', drawable);
    if (category.type === 'component' && category.targetId !== undefined) handleComponentDrawableChange(category.targetId, drawable);
    if (category.type === 'prop' && category.targetId !== undefined) handlePropDrawableChange(category.targetId, drawable);
  };

  const changeTexture = (category: Category, texture: number) => {
    if (category.type === 'hair') handleHairChange('texture', texture);
    if (category.type === 'component' && category.targetId !== undefined) handleComponentTextureChange(category.targetId, texture);
    if (category.type === 'prop' && category.targetId !== undefined) handlePropTextureChange(category.targetId, texture);
  };

  // Sync strip offset with the actual current drawable each time the active category changes.
  const range = activeCategory ? drawableRange(activeCategory) : [];
  const activeIndex = activeCategory ? Math.max(0, range.indexOf(currentDrawable(activeCategory))) : 0;

  useEffect(() => {
    setAnimating(true);
    setOffset(-activeIndex * STRIDE - CARD_WIDTH / 2);
  }, [activeId, activeIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!stripRef.current) return;
    stripRef.current.setPointerCapture(event.pointerId);
    dragState.current = { dragging: true, startX: event.clientX, startOffset: offset, moved: 0 };
    setAnimating(false);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return;
    const dx = event.clientX - dragState.current.startX;
    dragState.current.moved = Math.abs(dx);
    setOffset(dragState.current.startOffset + dx);
  };

  const finishDrag = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;

    const total = range.length;
    if (total === 0 || !activeCategory) return;

    const ideal = -offset - CARD_WIDTH / 2;
    const targetIndex = Math.min(Math.max(Math.round(ideal / STRIDE), 0), total - 1);
    const drawable = range[targetIndex];

    setAnimating(true);
    setOffset(-targetIndex * STRIDE - CARD_WIDTH / 2);

    if (drawable !== currentDrawable(activeCategory)) {
      changeDrawable(activeCategory, drawable);
    }
  };

  const stepDrawable = (delta: number) => {
    if (!activeCategory || range.length === 0) return;
    const next = Math.min(Math.max(activeIndex + delta, 0), range.length - 1);
    changeDrawable(activeCategory, range[next]);
  };

  const saveSlot = (index: number) => {
    const next = [...slots];
    next[index] = JSON.parse(JSON.stringify(data));
    setSlots(next);
  };

  const loadSlot = (slot: PedAppearance | null) => {
    if (!slot) return;
    slot.components.forEach(c => handleComponentDrawableChange(c.component_id, c.drawable));
    slot.props.forEach(p => handlePropDrawableChange(p.prop_id, p.drawable));
    handleHairChange('style', slot.hair.style);
  };

  const randomLook = () => {
    categories.forEach(category => {
      const options = drawableRange(category);
      if (options.length === 0) return;
      const random = options[Math.floor(Math.random() * options.length)];
      changeDrawable(category, random);
    });
  };

  if (!activeCategory) return null;

  const textures = textureRange(activeCategory, currentDrawable(activeCategory));
  const activeTexture = currentTexture(activeCategory);

  return (
    <Layer>
      <CameraAngleRail cameraPreset={cameraPreset} onSelect={onCameraPreset} />

      <CategoryTopChrome>
        <ScrollArrowRound
          type="button"
          aria-label="Scroll categories left"
          disabled={!canScrollCatsLeft}
          onClick={() => scrollCategoryRow(-1)}
        >
          ‹
        </ScrollArrowRound>

        <CategoryScroll
          ref={categoryScrollRef}
          tabIndex={0}
          role="toolbar"
          aria-label="Clothing categories"
          className={categoryBarDragging ? 'dragging' : ''}
          onPointerDown={handleCategoryPointerDown}
          onPointerMove={handleCategoryPointerMove}
          onPointerUp={handleCategoryPointerUpOrCancel}
          onPointerCancel={handleCategoryPointerUpOrCancel}
          onScroll={updateCategoryScrollHints}
          onLostPointerCapture={handleLostCategoryPointerCapture}
        >
          {categories.map(category => (
            <Pill
              key={category.id}
              active={category.id === activeCategory.id}
              type="button"
              data-category={category.id}
              onClick={() => {
                if (suppressCategoryClick.current) {
                  suppressCategoryClick.current = false;
                  return;
  }

  setActiveId(category.id);
}}
            >
              {category.title}
            </Pill>
          ))}
        </CategoryScroll>

        <ScrollArrowRound
          type="button"
          aria-label="Scroll categories right"
          disabled={!canScrollCatsRight}
          onClick={() => scrollCategoryRow(1)}
        >
          ›
        </ScrollArrowRound>
      </CategoryTopChrome>

      <Dots>
        {textures.map(t => (
          <Dot
            key={t}
            active={t === activeTexture}
            onClick={() => changeTexture(activeCategory, t)}
            title={`Texture ${t}`}
          />
        ))}
      </Dots>

      <StripWrap>
        <NavBtn onClick={() => stepDrawable(-1)}>‹</NavBtn>

        <Strip
          ref={stripRef}
          className={dragState.current.dragging ? 'dragging' : ''}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onPointerLeave={finishDrag}
          onWheel={event => stepDrawable(event.deltaY > 0 ? 1 : -1)}
        >
          <StripInner
            ref={innerRef}
            className={animating ? '' : 'no-anim'}
            style={{ transform: `translate3d(${offset}px, 0, 0)` }}
          >
            {range.map((drawable, index) => {
              const isActive = drawable === currentDrawable(activeCategory);
              const distance = Math.abs(index - activeIndex);
              return (
                <Card
                  key={drawable}
                  active={isActive}
                  preview={distance === 1}
                  onClick={() => {
                    if (dragState.current.moved > 6) return;
                    if (!isActive) changeDrawable(activeCategory, drawable);
                  }}
                >
                  <small>{activeCategory.title}</small>
                  <strong>{drawable}</strong>
                </Card>
              );
            })}
          </StripInner>
        </Strip>

        <NavBtn onClick={() => stepDrawable(1)}>›</NavBtn>
      </StripWrap>

      <BottomBar>
        <Slots>
          {slots.map((slot, index) => (
            <Slot
              key={index}
              active={Boolean(slot)}
              title={slot ? `Right-click to overwrite slot ${index + 1}` : `Save current look to slot ${index + 1}`}
              onClick={() => (slot ? loadSlot(slot) : saveSlot(index))}
              onContextMenu={e => {
                e.preventDefault();
                saveSlot(index);
              }}
            >
              {slot ? `Look ${index + 1}` : `Slot ${index + 1}`}
            </Slot>
          ))}
        </Slots>

        <Actions>
          <Action onClick={randomLook}>Random</Action>
          <Action tone="primary" onClick={handleSave}>
            Save
          </Action>
          {enableExit && (
            <Action tone="danger" onClick={handleExit}>
              Exit
            </Action>
          )}
        </Actions>
      </BottomBar>
    </Layer>
  );
};

export default ClothingHero;
