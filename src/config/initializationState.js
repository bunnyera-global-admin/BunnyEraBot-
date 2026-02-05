/**
 * Initialization State Module
 * 
 * This module manages the human initialization state of the BunnyEra HQ Discord Bot.
 * The bot will NOT perform any automated content publishing until the human operator
 * completes the initial manual setup by running /complete-initial-setup.
 */

let isHumanInitializationComplete = false;

/**
 * Mark the human initialization as complete.
 * This should only be called by the /complete-initial-setup command.
 */
export function markInitializationComplete() {
  isHumanInitializationComplete = true;
  console.log('[INITIALIZATION] Human initialization marked as COMPLETE. Automated systems are now ENABLED.');
}

/**
 * Check if human initialization is complete.
 * @returns {boolean} true if initialization is complete, false otherwise
 */
export function isInitializationComplete() {
  return isHumanInitializationComplete;
}

/**
 * Get the current initialization status as a human-readable string.
 * @returns {string} Status message
 */
export function getInitializationStatus() {
  return isHumanInitializationComplete 
    ? 'ENABLED - Automated systems are active'
    : 'DISABLED - Waiting for human operator to complete initial setup';
}
