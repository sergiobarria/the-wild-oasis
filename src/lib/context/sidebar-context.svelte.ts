import { getContext, setContext } from 'svelte';

class SidebarState {
	open = $state(true);

	constructor(initialOpen = true) {
		this.open = initialOpen;
	}

	toggle = () => {
		this.open = !this.open;
	};

	setOpen = (value: boolean) => {
		this.open = value;
	};
}

const SIDEBAR_CONTEXT_KEY = Symbol('sidebar-context');

/**
 * Provides the SidebarState instance in the context.
 * @param initialOpen The initial state of the sidebar (default: true).
 * @returns The SidebarState instance.
 */
export function setSidebarContext(initialOpen = true): SidebarState {
	const sidebarState = new SidebarState(initialOpen);
	setContext(SIDEBAR_CONTEXT_KEY, sidebarState);
	return sidebarState;
}

/**
 * Retrieves the SidebarState instance from context.
 * @returns The SidebarState instance.
 */
export function useSidebarContext(): SidebarState {
	return getContext(SIDEBAR_CONTEXT_KEY);
}
