import type { Page } from '@playwright/test';

export const openMobileMenu = async (page: Page, isMobile: boolean | undefined) => {
  if (!isMobile) return;
  const menuBtn = page.locator('button[aria-controls="menu-accordion-content"]');
  await menuBtn.waitFor({ state: 'visible' });
  await menuBtn.click();
};
