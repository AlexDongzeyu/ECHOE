// 添加动态效果
document.addEventListener('DOMContentLoaded', function() {
    // 创建随机漂浮效果
    const healingElements = document.querySelectorAll('.healing-element');
    
    healingElements.forEach(element => {
        setInterval(() => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000);
    });

    // 添加光晕效果
    const glowEffects = document.querySelectorAll('.glow-effect');
    
    glowEffects.forEach(effect => {
        setInterval(() => {
            const randomX = Math.random() * 80 - 40;
            const randomY = Math.random() * 80 - 40;
            effect.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 8000);
    });
}); 