/**
 * Country Selector Plugin
 * A lightweight, customizable country selector with flags and search functionality
 * Built with vanilla JavaScript
 */

class CountrySelector {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = { ...this.getDefaultOptions(), ...options };
        this.countries = [];
        this.filteredCountries = [];
        this.selectedCountry = null;
        this.highlightedIndex = -1;
        this.elements = {};
        this.isOpen = false;
        
        // Use requestIdleCallback for non-critical initialization
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.init());
        } else {
            setTimeout(() => this.init(), 0);
        }
    }
    
    // Lazy load countries data only when needed
    getCountriesData() {
        if (this.countries.length > 0) return this.countries;
        
        // Move country data to a separate file and load it lazily
        return this.loadCountriesAsync();
    }
    
    async loadCountriesAsync() {
        try {
            const response = await fetch('assets/js/countries-data.json');
            this.countries = await response.json();
            return this.countries;
        } catch (error) {
            // Fallback to inline data
            return this.getInlineCountriesData();
        }
    }
    
    // Debounce search to reduce processing
    handleSearch(searchTerm) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(searchTerm);
        }, 150);
    }
    
    performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredCountries = this.countries;
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredCountries = this.countries.filter(country => 
                country.name.toLowerCase().includes(term) || 
                country.code.includes(term)
            );
        }
        this.renderCountryList();
    }
    
    getDefaultOptions() {
        return {
            defaultCountry: 'DE',
            showFlags: true,
            searchPlaceholder: 'Search country...',
            hiddenInputName: 'countryCode',
            phoneInputSelector: null,
            onSelect: null,
        };
    }
    
    init() {
        if (!this.container) {
            console.error('CountrySelector: Container not found');
            return;
        }
        this.getCountriesData().then(countries => {
        this.render();
        this.bindEvents();
        this.setDefaultCountry();
        });
        
    }
    
    render() {
        const defaultCountry = this.countries.find(c => c.iso === this.options.defaultCountry) || this.countries[0];
        
        this.container.innerHTML = `
            <div class="cs-selected-country" role="button" tabindex="0" aria-label="Select country code" aria-expanded="false">
                <span class="cs-flag">${defaultCountry.flag}</span>
                <span class="cs-code">${defaultCountry.code}</span>
                <span class="cs-arrow">▼</span>
            </div>
            <div class="cs-dropdown" role="listbox" aria-hidden="true">
                <input type="text" class="cs-search" placeholder="${this.options.searchPlaceholder}" role="searchbox" aria-label="Search countries">
                <ul class="cs-country-list" role="listbox">
                    ${this.renderCountryList()}
                </ul>
            </div>
            <input type="hidden" name="${this.options.hiddenInputName}" value="${defaultCountry.code}">
        `;
        
        this.elements = {
            selected: this.container.querySelector('.cs-selected-country'),
            dropdown: this.container.querySelector('.cs-dropdown'),
            search: this.container.querySelector('.cs-search'),
            list: this.container.querySelector('.cs-country-list'),
            hiddenInput: this.container.querySelector('input[type="hidden"]'),
            flag: this.container.querySelector('.cs-flag'),
            code: this.container.querySelector('.cs-code'),
            arrow: this.container.querySelector('.cs-arrow')
        };
    }
    
    renderCountryList(countries = this.countries) {
        return countries.map((country, index) => `
            <li class="cs-country-item" role="option" data-index="${index}" data-iso="${country.iso}">
                <span class="cs-flag">${country.flag}</span>
                <div class="cs-country-info">
                    <span class="cs-country-name">${country.name}</span>
                    <span class="cs-country-code">${country.code}</span>
                </div>
            </li>
        `).join('');
    }
    
    bindEvents() {
        // Toggle dropdown
        this.elements.selected.addEventListener('click', () => this.toggleDropdown());
        this.elements.selected.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDropdown();
            }
        });
        
        // Search functionality
        this.elements.search.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.search.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
        
        // Country selection
        this.elements.list.addEventListener('click', (e) => {
            const item = e.target.closest('.cs-country-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                this.selectCountry(this.filteredCountries[index]);
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
            }
        });
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        this.isOpen = true;
        this.elements.dropdown.classList.add('cs-open');
        this.elements.selected.setAttribute('aria-expanded', 'true');
        this.elements.dropdown.setAttribute('aria-hidden', 'false');
        this.elements.selected.classList.add('cs-open');
        
        // Focus search input
        setTimeout(() => this.elements.search.focus(), 100);
    }
    
    closeDropdown() {
        this.isOpen = false;
        this.elements.dropdown.classList.remove('cs-open');
        this.elements.selected.setAttribute('aria-expanded', 'false');
        this.elements.dropdown.setAttribute('aria-hidden', 'true');
        this.elements.selected.classList.remove('cs-open');
        this.highlightedIndex = -1;
        this.updateHighlight();
        this.elements.search.value = '';
        this.handleSearch(''); // Reset search
    }
    
    handleSearch(searchTerm) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(searchTerm);
        }, 150);
    }
    
    performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredCountries = this.countries;
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredCountries = this.countries.filter(country => 
                country.name.toLowerCase().includes(term) || 
                country.code.includes(term)
            );
        }
        this.renderCountryList();
    }
    
    handleSearchKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateList('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateList('up');
                break;
            case 'Enter':
                e.preventDefault();
                if (this.highlightedIndex >= 0 && this.filteredCountries[this.highlightedIndex]) {
                    this.selectCountry(this.filteredCountries[this.highlightedIndex]);
                }
                break;
            case 'Escape':
                this.closeDropdown();
                break;
        }
    }
    
    navigateList(direction) {
        const maxIndex = this.filteredCountries.length - 1;
        if (direction === 'down') {
            this.highlightedIndex = this.highlightedIndex < maxIndex ? this.highlightedIndex + 1 : 0;
        } else {
            this.highlightedIndex = this.highlightedIndex > 0 ? this.highlightedIndex - 1 : maxIndex;
        }
        this.updateHighlight();
        this.scrollToHighlighted();
    }
    
    updateHighlight() {
        const items = this.elements.list.querySelectorAll('.cs-country-item');
        items.forEach((item, index) => {
            item.classList.toggle('cs-highlighted', index === this.highlightedIndex);
            item.setAttribute('aria-selected', index === this.highlightedIndex);
        });
    }
    
    scrollToHighlighted() {
        const highlightedItem = this.elements.list.querySelector('.cs-highlighted');
        if (highlightedItem) {
            highlightedItem.scrollIntoView({ block: 'nearest' });
        }
    }
    
    selectCountry(country) {
        this.elements.flag.textContent = country.flag;
        this.elements.code.textContent = country.code;
        this.elements.hiddenInput.value = country.code;
        
        this.closeDropdown();
        
        // Callback
        if (this.options.onSelect && typeof this.options.onSelect === 'function') {
            this.options.onSelect(country);
        }
        
        // Custom event
        this.container.dispatchEvent(new CustomEvent('countrySelected', {
            detail: { country }
        }));
    }
    
    setDefaultCountry() {
        const defaultCountry = this.countries.find(c => c.iso === this.options.defaultCountry);
        if (defaultCountry) {
            this.selectCountry(defaultCountry);
        }
    }
    
    // Public API methods
    getSelectedCountry() {
        const code = this.elements.hiddenInput.value;
        return this.countries.find(c => c.code === code);
    }
    
    setCountry(iso) {
        const country = this.countries.find(c => c.iso === iso);
        if (country) {
            this.selectCountry(country);
        }
    }
    
    destroy() {
        // Remove event listeners and clean up
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleEscapeKey);
        this.container.innerHTML = '';
    }
}

// Auto-initialize if jQuery is available (for compatibility)
if (typeof window !== 'undefined' && window.jQuery) {
    (function($) {
        $.fn.countrySelector = function(options) {
            return this.each(function() {
                if (!$(this).data('countrySelector')) {
                    const instance = new CountrySelector(this, options);
                    $(this).data('countrySelector', instance);
                }
            });
        };
    })(window.jQuery);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountrySelector;
}

// Global export
if (typeof window !== 'undefined') {
    window.CountrySelector = CountrySelector;
}