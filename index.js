function setupAutoTrigger() {
    const context = getContext();
    if (!context?.eventSource) return;

    context.eventSource.on('message_received', (messageId) => {
        setTimeout(() => {
            const msg = getLastMessage();
            if (!msg || msg.is_user) return;
            
            // ALWAYS update scene context so discovery can work later
            // This is the key fix - context is now available even without auto-scan
            updateSceneContext(msg.mes);
            
            // Auto-scan for environmental awareness (runs independently)
            if (extensionSettings.autoScanEnabled) {
                autoScan(msg.mes);
            }
            
            // Auto-trigger voices (existing behavior)
            if (extensionSettings.enabled && extensionSettings.autoTrigger) {
                triggerVoices(msg.mes);
            }
        }, extensionSettings.triggerDelay || 1000);
    });
}