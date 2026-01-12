import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swup from 'swup';

/**
 * Adapter interface per integrare SPA routers (Swup, Barba.js, etc.)
 */
interface SPAAdapter {
    /** Nome identificativo dell'adapter */
    name: string;
    /** Hook chiamato prima della sostituzione del contenuto */
    onBeforeSwap(callback: () => void): void;
    /** Hook chiamato dopo la sostituzione del contenuto */
    onAfterSwap(callback: () => void): void;
    /** Rimuove gli hook e pulisce le risorse (opzionale) */
    destroy?(): void;
}
/**
 * Opzioni di configurazione per AnimationManager
 */
interface AnimationManagerOptions {
    /** Abilita logging di debug */
    debug?: boolean;
    /** Adapter SPA opzionale (Swup, Barba.js, etc.) */
    adapter?: SPAAdapter;
}
/**
 * Opzioni per registrazione animazioni
 */
interface AnimationOptions {
    /** Se true, l'animazione sopravvive ai cleanup non forzati */
    persist?: boolean;
}
/**
 * Opzioni per setup con context
 */
interface SetupOptions extends AnimationOptions {
    /** Elemento o selettore per scoping dei selettori GSAP */
    scope?: Element | string;
}
/**
 * Animation Manager - Singleton per gestire le animazioni GSAP in applicazioni SPA
 *
 * Caratteristiche:
 * - Gestione centralizzata di Tween/Timeline e ScrollTrigger, indicizzati per chiave
 * - Setup con gsap.context() e scope opzionale (via `setup(key, fn, { scope })`)
 * - Persistenza opzionale per animazioni, ScrollTrigger e setup (sopravvivono ai page swap)
 * - Cleanup automatico su navigazioni SPA (configurabile via adapter) e API esplicite
 * - Refresh controllato degli ScrollTrigger via `refresh()`
 * - Debug logging configurabile
 * - Agnostico rispetto al framework SPA (supporta Swup, Barba.js, custom routers)
 *
 * Linee guida d'uso:
 * - Chiamare `init({ adapter })` per collegare gli hook del ciclo di vita SPA
 * - Usa `setup()` per blocchi che includono più animazioni e side-effects
 * - Usa `animate()` per singole Timeline/Tween e `timeline()` come factory comoda
 * - Registra sempre gli ScrollTrigger con `scroll()` o `registerScrollTriggers()`
 */
declare class AnimationManager {
    private static instance;
    private adapter;
    /** Track delle animazioni attive (array di animazioni) */
    private activeAnimations;
    /** Track degli ScrollTriggers attivi */
    private scrollTriggers;
    /** Track delle animazioni persistenti */
    private persistentAnimations;
    /** Track degli ScrollTriggers persistenti */
    private persistentScrollTriggers;
    /** Contesti gsap.context() per setup() multi-animazione */
    private contexts;
    /** Flag di debug */
    isDebug: boolean;
    private constructor();
    static getInstance(): AnimationManager;
    /**
     * Inizializza AnimationManager con opzioni
     *
     * @param options - Opzioni di configurazione
     */
    init(options?: AnimationManagerOptions): void;
    /**
     * Disconnette l'adapter corrente e pulisce tutte le animazioni.
     * Utile per cambiare adapter o per cleanup completo.
     */
    destroy(): void;
    /**
     * Setup degli hook dell'adapter SPA
     */
    private setupAdapterHooks;
    /**
     * Registra una nuova animazione GSAP creata esternamente (Tween o Timeline).
     */
    register(key: string, animation: gsap.core.Timeline | gsap.core.Tween | (gsap.core.Timeline | gsap.core.Tween)[], options?: AnimationOptions): void;
    /**
     * Registra ScrollTrigger per una specifica chiave
     */
    registerScrollTriggers(key: string, triggers: ScrollTrigger[], options?: AnimationOptions): void;
    /**
     * Crea e registra una singola animazione GSAP (Tween o Timeline).
     *
     * @template T Tipo di animazione (Timeline o Tween)
     * @param key Chiave univoca
     * @param animationFactory Factory che ritorna la Timeline/Tween o array di animazioni
     * @param options.persist Se true, l'animazione è preservata ai cleanup non forzati
     */
    animate<T extends gsap.core.Timeline | gsap.core.Tween>(key: string, animationFactory: T | T[], options?: AnimationOptions): T;
    /**
     * Esegue e registra un blocco di setup con `gsap.context()` per orchestrare animazioni e side-effects.
     *
     * @param key Chiave univoca del setup
     * @param setupFunction Funzione eseguita nel context (riceve `ctx`)
     * @param options.persist Se true, il setup è persistente
     * @param options.scope Elemento o selettore per scoping dei selettori GSAP
     *
     * @example
     * AM.setup('globalEffects', (ctx) => {
     *   gsap.to('.el', { opacity: 1 })
     *   ctx?.add(() => {
     *     window.addEventListener('scroll', onScroll)
     *     return () => window.removeEventListener('scroll', onScroll)
     *   })
     * }, { persist: true, scope: document.body })
     */
    setup(key: string, setupFunction: (ctx?: gsap.Context) => void, options?: SetupOptions): void;
    /**
     * Crea e registra una Timeline con opzioni GSAP standard.
     *
     * @param key Chiave univoca della timeline
     * @param vars Opzioni della timeline GSAP
     * @param options.persist Se true, la timeline è preservata ai cleanup non forzati
     * @returns Istanza di Timeline
     */
    timeline(key: string, vars?: gsap.TimelineVars, options?: AnimationOptions): gsap.core.Timeline;
    /**
     * Crea e registra un nuovo ScrollTrigger con la chiave indicata.
     *
     * @param key Chiave univoca dello ScrollTrigger
     * @param vars Configurazione di ScrollTrigger
     * @param options.persist Se true, lo ScrollTrigger è preservato ai cleanup non forzati
     * @returns L'istanza creata, o null se esiste già per quella chiave
     */
    scroll(key: string, vars: ScrollTrigger.Vars, options?: AnimationOptions): ScrollTrigger | null;
    /**
     * Helper per killare array di animazioni GSAP
     */
    private killAnimations;
    /**
     * Helper per killare array di ScrollTriggers
     */
    private killScrollTriggers;
    /**
     * Cleanup di una specifica chiave
     *
     * @param key Chiave da pulire
     * @param force Se true, forza la pulizia anche se l'animazione è persistente
     */
    cleanup(key: string, force?: boolean): void;
    /**
     * Cleanup degli ScrollTrigger associati a una chiave
     */
    private cleanupScrollTriggers;
    /**
     * Cleanup completo di tutte le animazioni non persistenti
     */
    cleanupAll(): void;
    /**
     * Cleanup forzato: rimuove tutto ignorando la persistenza
     */
    forceCleanupAll(): void;
    /**
     * Rimuovi persistenza da un'animazione specifica
     */
    removePersistence(key: string): void;
    /**
     * Verifica se un'animazione è persistente
     */
    isPersistent(key: string): boolean;
    /**
     * Aggiorna gli ScrollTrigger
     *
     * @param keys Chiave singola o array di chiavi da refreshare; se omesso, refresh globale
     */
    refresh(keys?: string | string[]): void;
    /**
     * Ottieni informazioni sullo stato corrente
     */
    getStatus(): {
        animations: number;
        scrollTriggers: number;
        persistent: number;
        keys: string[];
        persistentKeys: string[];
    };
    /**
     * Verifica se un'animazione è attiva
     */
    isActive(key: string): boolean;
    private logIcon;
    private logIconStyle;
    private logTitleStyle;
    private logTitle;
    private logResetStyle;
    /**
     * Logging con controllo debug
     */
    log(message: string | string[], groupTitle?: string): void;
    /**
     * Helper per tracciare chiamate di metodi critici
     */
    private trace;
    /**
     * Metodo per debugging - mostra stato completo
     */
    debug(): void;
}
declare const AM: AnimationManager;

/**
 * Adapter per integrare AnimationManager con Swup
 *
 * @example
 * import Swup from 'swup';
 * import { AM, createSwupAdapter } from 'gsap-spa-manager';
 *
 * const swup = new Swup();
 * AM.init({ adapter: createSwupAdapter(swup) });
 *
 * // Per disconnettere l'adapter:
 * AM.destroy();
 */
declare function swupAdapter(swup: Swup): SPAAdapter;

interface BarbaCore {
    hooks: {
        before(hook: string, callback: () => void): void;
        after(hook: string, callback: () => void): void;
    };
}
/**
 * Adapter per integrare AnimationManager con Barba.js
 *
 * @example
 * import barba from '@barba/core';
 * import { AM, createBarbaAdapter } from 'gsap-spa-manager';
 *
 * barba.init();
 * AM.init({ adapter: createBarbaAdapter(barba) });
 *
 * @note Barba.js non supporta la rimozione dinamica degli hooks,
 * quindi destroy() non rimuove i listener ma previene l'esecuzione
 */
declare function barbaAdapter(barba: BarbaCore): SPAAdapter;

/**
 * Adapter per integrare AnimationManager con Astro View Transitions
 *
 * Astro View Transitions usa eventi DOM nativi invece di un'istanza router,
 * quindi questo adapter non richiede parametri.
 *
 * @example
 * import { AM, createAstroAdapter } from 'gsap-spa-manager';
 *
 * // In un <script> tag o client-side script
 * AM.init({ adapter: createAstroAdapter() });
 *
 * @example
 * // Con opzioni
 * AM.init({
 *   debug: true,
 *   adapter: createAstroAdapter({ refreshDelay: 100 })
 * });
 *
 * @see https://docs.astro.build/en/guides/view-transitions/
 */
interface AstroAdapterOptions {
    /**
     * Ritardo in ms prima del refresh degli ScrollTrigger dopo lo swap.
     * Utile se il nuovo contenuto ha bisogno di tempo per il rendering.
     * @default 0
     */
    refreshDelay?: number;
}
declare function astroAdapter(options?: AstroAdapterOptions): SPAAdapter;

export { AM, AnimationManager, type AnimationManagerOptions, type AnimationOptions, type AstroAdapterOptions, type SPAAdapter, type SetupOptions, astroAdapter, barbaAdapter, swupAdapter };
