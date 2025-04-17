import { FlowButton } from '../components/ai-flow/index.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化FlowButton
    const flowButtonContainer = document.getElementById('flow-button-container');
    if (flowButtonContainer) {
        const flowButton = new FlowButton();
        flowButton.mount(flowButtonContainer);
    }
}); 