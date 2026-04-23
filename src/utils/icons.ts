// 图标管理工具

// 图标映射
const icons: Record<string, string> = {
  // 选择工具图标
  select: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer"><!-- Lucide: mouse-pointer -->
    <path d="M15 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    <path d="m19 18-2-2"></path>
    <path d="m13 11-2-2"></path>
    <path d="M13 11a2 2 0 1 0 4 0"></path>
  </svg>`,
  
  // 绘制工具图标
  draw: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><!-- Lucide: square -->
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
  </svg>`,
  
  // 删除图标
  trash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><!-- Lucide: trash -->
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>`,
  
  // 撤销图标
  undo: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo"><!-- Lucide: undo -->
    <path d="M9 14 4 9l5-5"></path>
    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"></path>
  </svg>`,
  
  // 重做图标
  redo: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-redo"><!-- Lucide: redo -->
    <path d="M15 14l5-5-5-5"></path>
    <path d="M20 9H9.5a5.5 5.5 0 0 0-5.5 5.5a5.5 5.5 0 0 0 5.5 5.5H13"></path>
  </svg>`
}

// 根据图标名称获取SVG代码
export function getSvgIcon(iconName: string): string {
  return icons[iconName] || ''
}