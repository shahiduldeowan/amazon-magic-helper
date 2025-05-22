import { FloatingActionButton } from '../components/FAB';

function ContentPage() {
    const containers = document.querySelectorAll('div.puis-card-container.s-card-container');

    const handleClick = (e) => {
        // const target = e.target.closest('div.puis-card-container.s-card-container');
        // if (target) {
        //     const cardId = target.getAttribute('data-asin');
        //     if (cardId) {
        //         console.log(`Card ID: ${cardId}`);
        //         // Perform any action with the card ID
        //     }
        // }
        containers.forEach((container, index) => {
            const label = document.createElement('div');
            label.textContent = `#${index + 1}`;
            label.style.position = 'absolute';
            label.style.top = '5px';
            label.style.left = '5px';
            label.style.background = 'yellow';
            label.style.padding = '2px 5px';
            label.style.zIndex = '9999';
            label.style.fontSize = '14px';
            container.style.position = 'relative';
            container.appendChild(label);
        });
    }


    return (
        <div
            className='z-50'
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
            }}
        >
            <FloatingActionButton onClick={handleClick} />
        </div >
    )
}

export default ContentPage;