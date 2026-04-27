/**
 * JsonConfig.ts
 *
 * This module provides JSON config values embedded at build time.
 * The configuration is injected via the __FSS_JSON_CONFIG__ global variable
 * during the Vite build process.
 */

/**
 * Interface for the configuration object structure
 */
interface FssConfig {
  enableLabels?: boolean;
  enableLabelTabs?: boolean;
  enableOrder?: boolean;
  enableAllOrders?: boolean;
  enableThumbnail?: boolean;
  enableDetails?: boolean;
}

/**
 * JsonConfig class
 *
 * Provides access to build-time configuration values with fallback to default values.
 * This singleton pattern ensures consistent configuration access across the application.
 */
class JsonConfig {
  private readonly config: FssConfig;

  constructor() {
    // __FSS_JSON_CONFIG__ is embedded at Vite build time
    const config: FssConfig = typeof __FSS_JSON_CONFIG__ !== 'undefined' ? __FSS_JSON_CONFIG__ : {};
    if (Object.keys(config).length > 0) {
      console.group('[FSS] Load generated configs...');
      console.log(config);
      console.groupEnd();
    }
    this.config = config;
  }

  /**
   * Get enableLabels configuration value
   * @param defaultVal - Default value if not configured
   * @returns Configured value or default
   */
  enableLabels(defaultVal: boolean): boolean {
    return this.config.enableLabels !== undefined ? this.config.enableLabels : defaultVal;
  }

  /**
   * Get enableLabelTabs configuration value
   * @param defaultVal - Default value if not configured
   * @returns Configured value or default
   */
  enableLabelTabs(defaultVal: boolean): boolean {
    return this.config.enableLabelTabs !== undefined ? this.config.enableLabelTabs : defaultVal;
  }

  /**
   * Get enableOrder configuration value
   * @param defaultVal - Default value if not configured
   * @returns Configured value or default
   */
  enableOrder(defaultVal: boolean): boolean {
    return this.config.enableOrder !== undefined ? this.config.enableOrder : defaultVal;
  }

  /**
   * Get enableAllOrders configuration value
   * @param defaultVal - Default value if not configured
   * @returns Configured value or default
   */
  enableAllOrders(defaultVal: boolean): boolean {
    return this.config.enableAllOrders !== undefined ? this.config.enableAllOrders : defaultVal;
  }

  /**
   * Get enableThumbnail configuration value
   * @param defaultVal - Default value if not configured
   * @returns Configured value or default
   */
  enableThumbnail(defaultVal: boolean): boolean {
    return this.config.enableThumbnail !== undefined ? this.config.enableThumbnail : defaultVal;
  }

  /**
   * Get enableDetails configuration value
   * @param defaultVal - Default value if not configured
   * @returns Configured value or default
   */
  enableDetails(defaultVal: boolean): boolean {
    return this.config.enableDetails !== undefined ? this.config.enableDetails : defaultVal;
  }
}

const instance = new JsonConfig();
export default instance;
