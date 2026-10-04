/**
 * Icon configuration - Single source of truth for all available icons.
 * The IconName type is derived from this mapping, ensuring type safety.
 *
 * To add a new icon:
 * 1. Add the icon name and its Iconify class to ICON_CLASSES below
 * 2. The IconName type will automatically include the new icon
 */
export const ICON_CLASSES = {
  // Navigation
  'chevron-down': 'icon-[carbon--chevron-down]',
  'chevron-up': 'icon-[carbon--chevron-up]',
  'chevron-left': 'icon-[carbon--chevron-left]',
  'chevron-right': 'icon-[carbon--chevron-right]',
  'arrow-left': 'icon-[carbon--arrow-left]',
  'arrow-right': 'icon-[carbon--arrow-right]',
  'launch': 'icon-[carbon--launch]',
  'close': 'icon-[carbon--close]',
  'overflow-menu-horizontal': 'icon-[carbon--overflow-menu-horizontal]',
  'add': 'icon-[carbon--add]',

  // Status & Feedback
  'warning-filled': 'icon-[carbon--warning-filled]',
  'warning-alt': 'icon-[carbon--warning-alt]',
  'warning-alt-filled': 'icon-[carbon--warning-alt-filled]',
  'checkmark-filled': 'icon-[carbon--checkmark-filled]',
  'checkmark-outline': 'icon-[carbon--checkmark-outline]',
  'information-filled': 'icon-[carbon--information-filled]',
  'information': 'icon-[carbon--information]',
  'close-large': 'icon-[carbon--close-large]',
  'idea': 'icon-[carbon--idea]',
  'renew': 'icon-[carbon--renew]',
  'time': 'icon-[carbon--time]',
  'timer': 'icon-[carbon--timer]',
  'user-admin': 'icon-[carbon--user-admin]',

  // Navigation tabs
  'home': 'icon-[carbon--home]',
  'dashboard': 'icon-[carbon--dashboard]',
  'document': 'icon-[carbon--document]',
  'wallet': 'icon-[carbon--wallet]',

  // Features & Actions
  'scales': 'icon-[carbon--scales]',
  'flash': 'icon-[carbon--flash]',
  'chart-bar': 'icon-[carbon--chart-bar]',
  'badge': 'icon-[carbon--badge]',
  'locked': 'icon-[carbon--locked]',
  'unlocked': 'icon-[carbon--unlocked]',
  'user-multiple': 'icon-[carbon--user-multiple]',
  'money': 'icon-[carbon--money]',
  'send': 'icon-[carbon--send]',

  // Rewards & Membership
  'gift': 'icon-[carbon--gift]',
  'trophy': 'icon-[carbon--trophy]',
  'star-filled': 'icon-[carbon--star-filled]',
  'box': 'icon-[carbon--box]',

  // Documents & Files
  'document-protected': 'icon-[carbon--document-protected]',
  'stacked-scrolling': 'icon-[carbon--stacked-scrolling-1]',
  'cloud-upload': 'icon-[carbon--cloud-upload]',
  'calculator': 'icon-[carbon--calculator]',
  'upload': 'icon-[carbon--upload]',
  'camera': 'icon-[carbon--camera]',
} as const

/** Available icon names - derived from ICON_CLASSES keys */
export type IconName = keyof typeof ICON_CLASSES

/** Icon size configuration */
export const ICON_SIZES = {
  'xs': 'h-3 w-3',
  'sm': 'h-4 w-4',
  'md': 'h-5 w-5',
  'lg': 'h-6 w-6',
  'xl': 'h-8 w-8',
  '2xl': 'h-12 w-12',
} as const

export type IconSize = keyof typeof ICON_SIZES
