# Bruno Daniel | Portfólio

SPA de portfólio profissional construída com Angular 21, foco em UX premium, parallax multi-camadas, animações suaves e arquitetura preparada para evoluir de dados estáticos (JSON) para API.

## 1. Visão geral

Este projeto implementa uma landing page SPA com as seções:

- Home/Hero com efeito tecnológico e partículas interativas.
- Sobre com resumo profissional e foco técnico.
- Portfólio com cards, filtro por tecnologia e modal para projetos internos.
- Trajetória (timeline) com marcos de estudo e carreira.
- Footer com navegação, contato e link para código-fonte.

A aplicação é orientada a conteúdo (content-driven): os textos e dados principais vêm de JSON em `public/assets/data`, evitando hardcode no código de UI.

## 2. Stack técnica

- `Angular 21` (standalone components, signals, template control flow `@if/@for/@switch`).
- `TypeScript 5.9` com modo `strict` habilitado.
- `RxJS 7.8` para consumo de dados HTTP.
- `@tsparticles/angular` + `tsparticles` para o background interativo do Hero.
- `@fontsource/sora` e `@fontsource/manrope` para tipografia consistente e performática.
- `Vitest` via builder Angular para testes unitários.

## 3. Arquitetura da aplicação

### 3.1 Bootstrapping

- Entrada: `src/main.ts`
- Configuração global: `src/app/app.config.ts`
- Providers:
  - `provideRouter(routes)`
  - `provideHttpClient()`
  - `provideBrowserGlobalErrorListeners()`

### 3.2 Roteamento

Arquivo: `src/app/app.routes.ts`

- Rota raiz (`''`) renderiza `PortfolioPageComponent`.
- Wildcard (`'**'`) redireciona para raiz.

### 3.3 Organização por domínio

- `src/app/core`: modelos e serviços transversais (preferências de UI).
- `src/app/features/portfolio`: feature principal (página, seções, modelos, serviço de conteúdo).
- `src/app/shared`: diretivas e componentes reutilizáveis (parallax, reveal, tilt, controles de idioma/tema).
- `public/assets/data`: conteúdo dinâmico e textos multilíngues.

## 4. Estrutura de pastas

```text
src/
  app/
    core/
      models/preferences.models.ts
      services/ui-preferences.service.ts
    features/
      portfolio/
        models/portfolio.models.ts
        services/portfolio-content.service.ts
        pages/portfolio-page.component.{ts,html,css}
        sections/
          hero-section/
          about-section/
          projects-section/
          timeline-section/
          footer-section/
    shared/
      components/preferences-controls/
      directives/
        parallax-scene.directive.ts
        reveal-on-scroll.directive.ts
        tilt-card.directive.ts
  styles.css
  index.html
public/
  assets/
    icons/
      favicon.svg
    images/
      profile-avatar.jpg
    data/
      portfolio-data.json
      portfolio-i18n.json
```

## 5. Fluxo de dados e estado

### 5.1 Fonte de conteúdo

Arquivo: `src/app/features/portfolio/services/portfolio-content.service.ts`

- `getPortfolioData()` carrega `assets/data/portfolio-data.json`
- `getPortfolioI18n()` carrega `assets/data/portfolio-i18n.json`

### 5.2 Conversão para Signals

Arquivo: `src/app/features/portfolio/pages/portfolio-page.component.ts`

- Dados HTTP (`Observable`) são convertidos para `Signal` com `toSignal(...)`.
- Fallback local evita quebra visual quando JSON falha.
- Computeds derivam slices para cada seção:
  - `profile`, `socialLinks`, `projects`, `timeline`, `footerMeta`, `copy`.

### 5.3 Preferências globais (tema/idioma)

Arquivo: `src/app/core/services/ui-preferences.service.ts`

- `language` e `theme` são `signal` globais.
- Persistência em `localStorage`:
  - `portfolio.language`
  - `portfolio.theme`
- Efeitos reativos atualizam:
  - `document.documentElement.lang`
  - `document.body.dataset.theme`

## 6. Sistema visual e animações

### 6.1 Parallax (scroll-driven)

Arquivo: `src/app/shared/directives/parallax-scene.directive.ts`

Diretiva responsável por:

- Calcular progresso da cena com base na posição do elemento no viewport.
- Aplicar easing customizado (`parallaxEasePower`).
- Escrever variáveis CSS por cena:
  - `--parallax-progress`
  - `--parallax-center`
  - `--parallax-shift-soft`
  - `--parallax-shift-medium`
  - `--parallax-shift-deep`
- Usar `requestAnimationFrame` + `IntersectionObserver` para reduzir custo de scroll.
- Respeitar `prefers-reduced-motion`.

### 6.2 Reveal on scroll

Arquivo: `src/app/shared/directives/reveal-on-scroll.directive.ts`

- Marca elementos com classe `reveal-on-scroll`.
- Configura atraso, distância e origem (`top/right/bottom/left`).
- Ativa classe `is-visible` quando entra no viewport.
- Pode ser one-shot (`revealOnce`) ou reativo.

### 6.3 Tilt 3D em cards

Arquivo: `src/app/shared/directives/tilt-card.directive.ts`

- Movimento por `pointermove` com easing em RAF.
- Atualiza variáveis CSS:
  - `--tilt-rotate-x`
  - `--tilt-rotate-y`
  - `--tilt-glow-x`
  - `--tilt-glow-y`
- Desativa automaticamente em devices sem ponteiro fino ou com reduced motion.

### 6.4 Hero com partículas

Arquivos:

- `src/app/features/portfolio/sections/hero-section/hero-section.component.ts`
- `src/app/features/portfolio/sections/hero-section/hero-section.component.html`

Implementação:

- `ngx-particles` renderiza o canvas em camada dedicada.
- Dois presets de partículas: claro e escuro (`particlesOptions` computed pelo tema atual).
- Inicialização lazy após carregamento completo para evitar custo no início.
- Interações:
  - hover `grab`
  - click `push`
- Fundo com grid futurista, glow, scanlines e orbs para profundidade.

## 7. Comportamentos de UX implementados

### 7.1 Navegação contextual

Arquivo: `src/app/features/portfolio/pages/portfolio-page.component.ts`

- Top nav só aparece após scroll além da Home.
- Home mantém controles rápidos de tema/idioma sem exibir o nav completo.
- Menu mobile abre/fecha por estado local (`isMobileMenuOpen`).

### 7.2 Home com efeito de sobreposição

Arquivos:

- `src/app/features/portfolio/pages/portfolio-page.component.css`
- `src/app/features/portfolio/sections/hero-section/hero-section.component.css`

- Home usa `sticky` e camada fixa para efeito de profundidade.
- `content-layer` sobe com `margin-top` negativo para transição cinematográfica entre Hero e conteúdo.

### 7.3 Projetos com 2 modelos de exibição

Arquivo: `src/app/features/portfolio/sections/projects-section/projects-section.component.ts`

- `kind: 'public'`
  - botões para `liveUrl` e `repositoryUrl`.
- `kind: 'private'`
  - botão `Saiba mais`.
  - abre modal com `privateDetails`.
  - bloqueia scroll de fundo enquanto modal está aberto.

### 7.4 Filtro de tecnologias

- Filtros são derivados dinamicamente das tecnologias existentes no JSON.
- Seleção em signal (`selectedTechnology`) e lista derivada em `filteredProjects`.

## 8. Conteúdo desacoplado (JSON)

### 8.1 `portfolio-data.json`

Responsável por dados estruturais:

- `profile`
- `socialLinks`
- `projects`
- `timeline`
- `footerMeta`

### 8.2 `portfolio-i18n.json`

Responsável por textos de interface (PT/EN):

- Labels de navegação
- Textos de seção
- Labels de botão
- Mensagens do modal

### 8.3 Contrato principal de projeto

```ts
interface PortfolioProject {
  kind: 'public' | 'private';
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;         // obrigatório quando kind = public
  repositoryUrl?: string;   // obrigatório quando kind = public
  privateDetails?: { pt: string; en: string }; // obrigatório quando kind = private
}
```

## 9. SEO e metadados

Arquivo: `src/index.html`

Implementado:

- `title`: `Bruno Daniel | Portfólio`
- `meta description`
- `meta robots`
- `canonical`
- Open Graph (`og:*`)
- Twitter Card
- `theme-color`
- `referrer`
- JSON-LD `schema.org/Person`

## 10. Acessibilidade

- Skip link para conteúdo principal.
- Labels ARIA em navegação e botões de preferência.
- `role="dialog"` e `aria-modal="true"` no modal de projeto interno.
- Fechamento do modal por `Esc` e clique no backdrop.
- Respeito a `prefers-reduced-motion` em animações e parallax.
- `lang` do documento atualizado automaticamente conforme idioma.

## 11. Performance

Estratégias usadas:

- `ChangeDetectionStrategy.OnPush` em componentes.
- Angular Signals para estado local e derivado.
- `requestAnimationFrame` para animações de scroll/pointer.
- `IntersectionObserver` para ativar efeitos apenas quando necessário.
- Lazy init de partículas após `window.load`.
- Imagens de projeto com `loading="lazy"`.
- CSS variables para reduzir recalculações de layout complexas.

## 12. Segurança (front-end)

- Links externos com `target="_blank" rel="noopener noreferrer"`.
- Sem uso de `innerHTML` dinâmico para conteúdo JSON.
- Dados renderizados como texto via template binding Angular.
- Preferências em `localStorage` envoltas em `try/catch`.

Observação: como é uma SPA estática, políticas de segurança HTTP (CSP, HSTS, X-Frame-Options) dependem do ambiente de hospedagem (CDN/servidor).

## 13. Scripts de execução

`package.json`:

- `npm start` -> inicia dev server (`ng serve`)
- `npm run build` -> build de produção (`ng build`)
- `npm run watch` -> build development em modo watch
- `npm test` -> testes unitários

Se PowerShell bloquear execução de `npm.ps1`, use:

```bash
cmd /c npm run build
```

## 14. Build e deploy

### 14.1 Build local

```bash
npm install
npm run build
```

Saída em:

- `dist/portfolio/browser`

### 14.2 Deploy estático

Pode ser hospedado em qualquer plataforma de arquivos estáticos:

- GitHub Pages
- Netlify
- Vercel (modo static)
- Nginx/Apache

## 15. Como manter e evoluir conteúdo

### 15.1 Atualizar textos e dados

- Edite `public/assets/data/portfolio-data.json` para dados do perfil/projetos/timeline.
- Edite `public/assets/data/portfolio-i18n.json` para textos da interface PT/EN.

### 15.2 Adicionar novo projeto público

1. Inserir item no array `projects` com `kind: "public"`.
2. Informar `liveUrl` e `repositoryUrl`.
3. Definir `technologies` para aparecer automaticamente nos filtros.

### 15.3 Adicionar novo projeto interno

1. Inserir item com `kind: "private"`.
2. Não informar `liveUrl/repositoryUrl`.
3. Preencher `privateDetails` para conteúdo do modal.

## 16. Qualidade de código

- Projeto em `strict mode` (TS + templates Angular).
- Componentização por responsabilidade.
- Separação entre layout (HTML), estilo (CSS) e comportamento (TS).
- Tipagem de domínio centralizada em `portfolio.models.ts`.

Cobertura atual de testes:

- Teste básico de criação da app e render do `router-outlet` em `src/app/app.spec.ts`.

## 17. Melhorias futuras sugeridas

- Introduzir testes de integração para interações críticas (filtro, modal, navegação mobile).
- Adicionar validação automática de schema dos JSONs (ex.: Zod/JSON Schema em CI).
- Implementar lazy loading de feature caso cresça para múltiplas páginas.
- Evoluir dados para API (mantendo mesmo contrato de modelos já tipados).
- Configurar pipeline CI/CD com checagem de build + testes + audit.

---

## Créditos

Desenvolvido por Bruno Daniel com Angular, foco em experiência visual, performance e arquitetura escalável para evolução contínua.
