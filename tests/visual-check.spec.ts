import { test, expect } from '@playwright/test';

// Configurações de Viewport
const VIEWPORTS = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  mobileLarge: { width: 430, height: 932 }, // iPhone 14 Pro Max
  tablet: { width: 768, height: 1024 }, // iPad Mini
  desktop: { width: 1366, height: 768 }, // Laptop
};

test.describe('Visual & Responsividade Check', () => {
  
  // --- HOME PAGE ---
  test('Home Page - Mobile - Visual e Scroll', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    
    // Check inicial
    await expect(page.locator('header').first()).toBeVisible();
    
    // Screenshot topo
    await page.screenshot({ path: 'test-results/responsive-home-mobile.png' });
    
    // Scroll até o footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500); // Esperar animações/scroll
    
    // Validar se footer existe (se houver um footer semantico) ou algo no fim da pagina
    // Se não tiver footer, apenas o scroll é verificado
  });

  test('Home Page - Desktop - Visual', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');
    await page.screenshot({ path: 'test-results/responsive-home-desktop.png' });
  });

  test('Home Page - Tablet - Visual', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/');
    await page.screenshot({ path: 'test-results/responsive-home-tablet.png' });
  });

  // --- CARDÁPIO ---
  test('Cardápio - Mobile - Lista de Produtos', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/cardapio');
    
    // Esperar produtos carregarem
    await expect(page.locator('text=Strogonoff Carne ou Frango').first()).toBeVisible({ timeout: 15000 });
    
    // Screenshot
    await page.screenshot({ path: 'test-results/responsive-cardapio-mobile.png' });
  });

  test('Cardápio - Desktop - Grid de Produtos', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/cardapio');
    
    // Esperar produtos
    await expect(page.locator('text=Strogonoff Carne ou Frango').first()).toBeVisible({ timeout: 15000 });
    
    await page.screenshot({ path: 'test-results/responsive-cardapio-desktop.png' });
  });

   test('Cardápio - Tablet - Visual', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/cardapio');
    
    // Esperar produtos
    await expect(page.locator('text=Strogonoff Carne ou Frango').first()).toBeVisible({ timeout: 15000 });
    
    await page.screenshot({ path: 'test-results/responsive-cardapio-tablet.png' });
  });


  // --- ADMIN (Responsividade do Dashboard) ---
  test('Admin - Mobile - Dashboard Layout', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/admin');
    
    // Se precisar de login, isso vai falhar ou cair na tela de login. 
    // Assumindo que pode redirecionar para login ou mostrar dashboard se nao tiver auth forte no teste
    // Vamos tirar print do que aparecer
    await page.screenshot({ path: 'test-results/responsive-admin-dashboard-mobile.png' });
  });
  
  test('Admin - Desktop - Dashboard Layout', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/admin');
    await page.screenshot({ path: 'test-results/responsive-admin-dashboard-desktop.png' });
  });

   test('Admin - Tablet - Dashboard Layout', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/admin');
    await page.screenshot({ path: 'test-results/responsive-admin-dashboard-tablet.png' });
  });
  
  // --- LOGIN ---
  test('Login - Mobile - Formulario', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await page.screenshot({ path: 'test-results/responsive-login-mobile.png' });
  });

   test('Login - Desktop - Formulario', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await page.screenshot({ path: 'test-results/responsive-login-desktop.png' });
  });

   test('Login - Tablet - Formulario', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await page.screenshot({ path: 'test-results/responsive-login-tablet.png' });
  });

  // --- CHECKOUT ---
  test('Checkout - Mobile - Responsividade', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/checkout');
    await page.screenshot({ path: 'test-results/responsive-checkout-mobile.png' });
  });
  
  test('Checkout - Desktop - Responsividade', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/checkout');
    await page.screenshot({ path: 'test-results/responsive-checkout-desktop.png' });
  });

   test('Checkout - Tablet - Responsividade', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/checkout');
    await page.screenshot({ path: 'test-results/responsive-checkout-tablet.png' });
  });

  // --- OUTRAS PAGINAS ---
   test('Termos - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/termos');
    await page.screenshot({ path: 'test-results/responsive-termos-mobile.png' });
  });

   test('Termos - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/termos');
    await page.screenshot({ path: 'test-results/responsive-termos-desktop.png' });
  });

   test('Termos - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/termos');
    await page.screenshot({ path: 'test-results/responsive-termos-tablet.png' });
  });

   test('Privacidade - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/privacidade');
    await page.screenshot({ path: 'test-results/responsive-privacidade-mobile.png' });
  });

  test('Privacidade - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/privacidade');
    await page.screenshot({ path: 'test-results/responsive-privacidade-desktop.png' });
  });

  test('Privacidade - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/privacidade');
    await page.screenshot({ path: 'test-results/responsive-privacidade-tablet.png' });
  });

  test('FAQ - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/faq');
    await page.screenshot({ path: 'test-results/responsive-faq-mobile.png' });
  });

   test('FAQ - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/faq');
    await page.screenshot({ path: 'test-results/responsive-faq-desktop.png' });
  });

   test('FAQ - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/faq');
    await page.screenshot({ path: 'test-results/responsive-faq-tablet.png' });
  });

   test('Entrega - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/entrega');
    await page.screenshot({ path: 'test-results/responsive-entrega-mobile.png' });
  });

   test('Entrega - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/entrega');
    await page.screenshot({ path: 'test-results/responsive-entrega-desktop.png' });
  });

   test('Entrega - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/entrega');
    await page.screenshot({ path: 'test-results/responsive-entrega-tablet.png' });
  });

   test('Carreiras - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/carreiras');
    await page.screenshot({ path: 'test-results/responsive-carreiras-mobile.png' });
  });

  test('Carreiras - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/carreiras');
    await page.screenshot({ path: 'test-results/responsive-carreiras-desktop.png' });
  });

  test('Carreiras - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/carreiras');
    await page.screenshot({ path: 'test-results/responsive-carreiras-tablet.png' });
  });

   test('Blog - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/blog');
    await page.screenshot({ path: 'test-results/responsive-blog-mobile.png' });
  });

   test('Blog - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/blog');
    await page.screenshot({ path: 'test-results/responsive-blog-desktop.png' });
  });

   test('Blog - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/blog');
    await page.screenshot({ path: 'test-results/responsive-blog-tablet.png' });
  });

    // --- ADMIN (Páginas Internas) ---
  test('Admin - Produtos - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/admin/produtos');
    await page.screenshot({ path: 'test-results/responsive-admin-produtos-mobile.png' });
  });
  
  test('Admin - Produtos - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/admin/produtos');
    await page.screenshot({ path: 'test-results/responsive-admin-produtos-desktop.png' });
  });

   test('Admin - Produtos - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/admin/produtos');
    await page.screenshot({ path: 'test-results/responsive-admin-produtos-tablet.png' });
  });

  test('Admin - Pedidos - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/admin/pedidos');
    await page.screenshot({ path: 'test-results/responsive-admin-pedidos-mobile.png' });
  });
  
  test('Admin - Pedidos - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/admin/pedidos');
    await page.screenshot({ path: 'test-results/responsive-admin-pedidos-desktop.png' });
  });

   test('Admin - Pedidos - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/admin/pedidos');
    await page.screenshot({ path: 'test-results/responsive-admin-pedidos-tablet.png' });
  });

  test('Admin - Usuarios - Mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/admin/usuarios');
    await page.screenshot({ path: 'test-results/responsive-admin-usuarios-mobile.png' });
  });
  
  test('Admin - Usuarios - Desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/admin/usuarios');
    await page.screenshot({ path: 'test-results/responsive-admin-usuarios-desktop.png' });
  });

   test('Admin - Usuarios - Tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/admin/usuarios');
    await page.screenshot({ path: 'test-results/responsive-admin-usuarios-tablet.png' });
  });

});
