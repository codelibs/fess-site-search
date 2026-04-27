/**
 * Component-related type definitions
 *
 * Common types used across Vue components.
 */

/**
 * Common component props that multiple components might share
 */
export interface BaseComponentProps {
  fessUrl: string;
  language?: string;
}

/**
 * Search-related component props
 */
export interface SearchComponentProps extends BaseComponentProps {
  pageSize?: number;
  enableOrder?: boolean;
  enableLabel?: boolean;
}
