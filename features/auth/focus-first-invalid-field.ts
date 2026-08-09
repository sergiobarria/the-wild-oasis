import type { AnyFormApi } from '@tanstack/react-form';

/**
 * Spec §10's "focus the first invalid field on a failed submit" rule,
 * shared by sign-up and sign-in's submit handlers so it's implemented once.
 */
export function focusFirstInvalidField(form: AnyFormApi, fieldOrder: readonly string[]) {
    const firstInvalidField = fieldOrder.find(
        (name) => (form.getFieldMeta(name)?.errors.length ?? 0) > 0,
    );

    if (firstInvalidField) document.getElementById(firstInvalidField)?.focus();
}
