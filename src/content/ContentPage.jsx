import { useRef } from 'react';
import { FloatingActionButton } from '../components/FAB';
import ProductSpecsSection from '../components/product/ProductSpecsSection';
import { CONTAINER_SELECTORS, CREATED_SELECTORS, PRODUCT_INFO_SELECTORS } from '../constants/selectors';
import { createRoot } from 'react-dom/client';

function ContentPage() {
    const hasInitialized = useRef(false);

    const injectProductSpecs = () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const productElements = document.querySelectorAll(CONTAINER_SELECTORS.PRODUCT_ASIN_ATTRIBUTE);

        productElements.forEach((element) => {
            const productContainer = element.querySelector(CONTAINER_SELECTORS.PRODUCT_SECTION);
            const asin = element.getAttribute(PRODUCT_INFO_SELECTORS.ASIN_ATTRIBUTE);

            if (productContainer && asin) {
                const existingSpecs = productContainer.querySelector(`#${CREATED_SELECTORS.PRODUCT_SPECS_SECTION}`);
                if (!existingSpecs) {
                    const div = document.createElement('div');
                    div.id = CREATED_SELECTORS.PRODUCT_SPECS_SECTION;
                    productContainer.insertBefore(div, productContainer.firstChild);

                    // Pass the ASIN to your component
                    const root = createRoot(div);
                    root.render(<ProductSpecsSection asin={asin} />);
                }
            }
        });

        // Number containers (optional)
        const containers = document.querySelectorAll('div.puis-card-container.s-card-container');
        containers.forEach((container, index) => {
            if (!container.querySelector('.product-index-label')) {
                const label = document.createElement('div');
                label.className = 'product-index-label';
                label.textContent = `#${index + 1}`;
                container.classList.add('relative');
                label.classList.add(
                    'absolute', 'top-1', 'left-1', 'bg-yellow-400',
                    'px-1', 'py-0.5', 'z-[9999]', 'text-sm',
                    'font-medium', 'text-gray-900'
                );
                container.appendChild(label);
            }
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <FloatingActionButton onClick={injectProductSpecs} />
        </div>
    );
}

export default ContentPage;