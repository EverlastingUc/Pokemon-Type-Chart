// ==UserScript==
// @name         Pokémon Type Chart
// @namespace    https://github.comEverlastingUc
// @version      1.0.0
// @description  Display type effectiveness chart on Pokémon Showdown
// @author       Everlasting
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.pokemonshowdown.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=play.pokemonshowdown.com
// @match        https://play.pokemonshowdown.com/*
// @grant        none
// @run-at       document-end
// @homepage     https://github.com/EverlastingUc/Pokemon-Type-Chart
// @supportURL   https://guns.lol/everlasting_uc
// @supportURL   mailto:everlastinguchiha@gmail.com
// @downloadURL  https://raw.githubusercontent.com/EverlastingUc/Pokemon-Type-Chart/main/typechart.user.js
// @updateURL    https://raw.githubusercontent.com/EverlastingUc/Pokemon-Type-Chart/main/typechart.user.js
// @made on      28-06-2026 12:00 AM IST
// @last updated 28-06-2026 12:00 AM IST
// @note         MIT License - Placed at the very bottom of this script.
// ==/UserScript==

// START

(function() {
    'use strict';

    const typeData = {
        Normal:   { Rock: 0.5, Ghost: 0,   Steel: 0.5 },
        Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
        Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
        Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
        Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
        Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
        Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
        Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
        Ground:   { Fire: 2, Grass: 0.5, Electric: 2, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
        Flying:   { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
        Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
        Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
        Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
        Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
        Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
        Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
        Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
        Fairy:    { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
    };

    const types = Object.keys(typeData);

    const typeColors = {
        Normal:   '#A8A878',
        Fire:     '#F08030',
        Water:    '#6890F0',
        Grass:    '#78C850',
        Electric: '#F8D030',
        Ice:      '#98D8D8',
        Fighting: '#C03028',
        Poison:   '#A040A0',
        Ground:   '#E0C068',
        Flying:   '#A890F0',
        Psychic:  '#F85888',
        Bug:      '#A8B820',
        Rock:     '#B8A038',
        Ghost:    '#705898',
        Dragon:   '#7038F8',
        Dark:     '#705848',
        Steel:    '#B8B8D0',
        Fairy:    '#EE99AC'
    };

    let isDarkMode = true;
    let showHelp = true;

    function getEffectiveness(attackType, defenseType) {
        return typeData[attackType]?.[defenseType] ?? 1;
    }

    function createEffectivenessCell(value) {
        const cell = document.createElement('td');
        cell.className = 'tc-cell';

        if (value === 2) {
            cell.className += ' tc-super';
            cell.textContent = '2×';
        } else if (value === 0.5) {
            cell.className += ' tc-not-very';
            cell.textContent = '½';
        } else if (value === 0) {
            cell.className += ' tc-no-effect';
            cell.textContent = '0';
        } else {
            cell.className += ' tc-normal';
            cell.textContent = '1';
        }

        return cell;
    }

    function buildHelpSection() {
        const container = document.createElement('div');
        container.className = 'tc-help';
        container.id = 'help-container';
        container.style.display = showHelp ? 'block' : 'none';

        const header = document.createElement('div');
        header.className = 'tc-help-header';
        header.innerHTML = `
            <span>How to Read This Chart</span>
            <span class="help-toggle">${showHelp ? '▼' : '▶'}</span>
        `;

        header.addEventListener('click', function() {
            showHelp = !showHelp;
            const content = container.querySelector('.help-content');
            const toggle = container.querySelector('.help-toggle');

            if (content) {
                content.style.display = showHelp ? 'block' : 'none';
            }
            if (toggle) {
                toggle.textContent = showHelp ? '▼' : '▶';
            }
        });

        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'help-content';
        content.innerHTML = `
            <div class="help-grid">
                <div>
                    <strong>Row (Attack Type)</strong>
                    <p>The type of the move being used</p>
                </div>
                <div>
                    <strong>Column (Defense Type)</strong>
                    <p>The type of the defending Pokémon</p>
                </div>
            </div>

            <div class="help-example">
                <div class="example-row">
                    <span class="example-label">Example:</span>
                    <span class="type-tag fire">Fire</span>
                    <span class="arrow">→</span>
                    <span class="type-tag grass">Grass</span>
                    <span class="equals">=</span>
                    <span class="result-tag super">2×</span>
                    <span class="result-label super">Super Effective</span>
                </div>
                <p class="hint">
                    Find Fire in the left column, go right to Grass → 2× damage
                </p>
            </div>

            <div class="help-legend">
                <span><span class="legend-box super">2×</span> Super Effective</span>
                <span><span class="legend-box not-very">½</span> Not Very Effective</span>
                <span><span class="legend-box no-effect">0</span> No Effect</span>
                <span><span class="legend-box normal">1</span> Normal Damage</span>
            </div>
        `;

        container.appendChild(content);
        return container;
    }

    function buildChart() {
        const wrapper = document.createElement('div');
        wrapper.className = 'tc-wrapper';
        wrapper.id = 'chart-wrapper';

        const header = document.createElement('div');
        header.className = 'tc-header';
        header.innerHTML = `<span>Type Effectiveness Chart</span>`;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const helpButton = document.createElement('button');
        helpButton.className = 'tc-button';
        helpButton.textContent = '?';
        helpButton.title = 'Toggle help';
        helpButton.addEventListener('click', function() {
            const helpEl = document.getElementById('help-container');
            if (helpEl) {
                showHelp = !showHelp;
                helpEl.style.display = showHelp ? 'block' : 'none';
                const toggle = helpEl.querySelector('.help-toggle');
                if (toggle) {
                    toggle.textContent = showHelp ? '▼' : '▶';
                }
            }
        });

        const themeButton = document.createElement('button');
        themeButton.className = 'tc-button';
        themeButton.id = 'theme-toggle';
        themeButton.textContent = '🌙';
        themeButton.title = 'Toggle dark/light mode';
        themeButton.addEventListener('click', toggleTheme);

        const closeButton = document.createElement('button');
        closeButton.className = 'tc-close';
        closeButton.textContent = '✕';
        closeButton.addEventListener('click', function() {
            wrapper.classList.remove('visible');
        });

        buttonGroup.appendChild(helpButton);
        buttonGroup.appendChild(themeButton);
        buttonGroup.appendChild(closeButton);
        header.appendChild(buttonGroup);
        wrapper.appendChild(header);

        wrapper.appendChild(buildHelpSection());

        const table = document.createElement('table');
        table.className = 'tc-table';

        const headerRow = document.createElement('tr');

        const cornerCell = document.createElement('th');
        cornerCell.textContent = '▼';
        cornerCell.className = 'corner-cell';
        headerRow.appendChild(cornerCell);

        types.forEach(function(type) {
            const th = document.createElement('th');
            th.textContent = type;
            th.style.backgroundColor = typeColors[type];
            headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        types.forEach(function(attackType) {
            const row = document.createElement('tr');

            const typeCell = document.createElement('td');
            typeCell.className = 'type-name';
            typeCell.textContent = attackType;
            typeCell.style.backgroundColor = typeColors[attackType];
            row.appendChild(typeCell);

            types.forEach(function(defenseType) {
                const value = getEffectiveness(attackType, defenseType);
                row.appendChild(createEffectivenessCell(value));
            });

            table.appendChild(row);
        });

        wrapper.appendChild(table);

        const legend = document.createElement('div');
        legend.className = 'tc-legend';

        const legendItems = [
            { label: '2×', text: 'Super Effective', className: 'super' },
            { label: '½', text: 'Not Very Effective', className: 'not-very' },
            { label: '0', text: 'No Effect', className: 'no-effect' },
            { label: '1', text: 'Normal', className: 'normal' }
        ];

        legendItems.forEach(function(item) {
            const itemEl = document.createElement('span');
            itemEl.className = 'legend-item';

            const box = document.createElement('span');
            box.className = 'legend-box ' + item.className;
            box.textContent = item.label;

            const text = document.createElement('span');
            text.className = 'legend-text';
            text.textContent = item.text;

            itemEl.appendChild(box);
            itemEl.appendChild(text);
            legend.appendChild(itemEl);
        });

        wrapper.appendChild(legend);

        const footer = document.createElement('div');
        footer.className = 'tc-footer';
        footer.innerHTML = 'Powered by <span class="brand">Pytret</span>';
        wrapper.appendChild(footer);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'tc-toggle';
        toggleButton.id = 'toggle-button';
        toggleButton.textContent = 'Type Chart';
        toggleButton.addEventListener('click', function(event) {
            event.stopPropagation();
            wrapper.classList.toggle('visible');
        });

        document.addEventListener('click', function(event) {
            if (wrapper.classList.contains('visible') &&
                !wrapper.contains(event.target) &&
                event.target.id !== 'toggle-button') {
                wrapper.classList.remove('visible');
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                wrapper.classList.remove('visible');
            }
        });

        return { wrapper, toggleButton };
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;

        const wrapper = document.getElementById('chart-wrapper');
        const toggle = document.getElementById('theme-toggle');
        const mainToggle = document.getElementById('toggle-button');

        if (wrapper) {
            wrapper.classList.toggle('light-mode', !isDarkMode);

            wrapper.querySelectorAll('.tc-normal').forEach(function(cell) {
                if (isDarkMode) {
                    cell.style.backgroundColor = '#546e7a';
                    cell.style.color = '#eceff1';
                } else {
                    cell.style.backgroundColor = '#90a4ae';
                    cell.style.color = '#263238';
                }
            });

            wrapper.querySelectorAll('.tc-no-effect').forEach(function(cell) {
                cell.style.backgroundColor = isDarkMode ? '#263238' : '#37474f';
            });

            const boxes = wrapper.querySelectorAll('.legend-box');
            if (boxes.length >= 4) {
                boxes[3].style.backgroundColor = isDarkMode ? '#546e7a' : '#90a4ae';
                boxes[3].style.color = isDarkMode ? '#eceff1' : '#263238';
                boxes[2].style.backgroundColor = isDarkMode ? '#263238' : '#37474f';
            }
        }

        if (toggle) {
            toggle.textContent = isDarkMode ? '🌙' : '☀️';
        }

        if (mainToggle) {
            mainToggle.style.background = isDarkMode
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'linear-gradient(135deg, #4a4a8a, #3a3a7a)';
        }
    }

    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .tc-wrapper {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 16px;
                border-radius: 16px;
                z-index: 9999;
                display: none;
                max-width: 94vw;
                max-height: 90vh;
                overflow: auto;
                background: linear-gradient(145deg, #1a1a2e, #16213e);
                border: 2px solid #4a4a8a;
                box-shadow: 0 0 60px rgba(100, 100, 255, 0.2);
                font-family: 'Segoe UI', Tahoma, sans-serif;
            }

            .tc-wrapper.visible {
                display: block;
                animation: fadeIn 0.3s ease;
            }

            .tc-wrapper.light-mode {
                background: linear-gradient(145deg, #f0f0f5, #e8e8ef);
                border-color: #8888bb;
            }

            .tc-wrapper::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .tc-wrapper::-webkit-scrollbar-track {
                background: #1a1a2e;
                border-radius: 10px;
            }

            .tc-wrapper::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 10px;
            }

            .tc-wrapper.light-mode::-webkit-scrollbar-track {
                background: #e8e8ef;
            }

            .tc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding: 0 4px;
            }

            .tc-header > span {
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .button-group {
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .tc-button {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #ffffff;
                padding: 2px 8px;
                border-radius: 6px;
                cursor: pointer;
                line-height: 24px;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .tc-button:hover {
                transform: scale(1.05);
                background: rgba(255, 255, 255, 0.2);
            }

            .tc-close {
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                border: none;
                color: #ffffff;
                padding: 0 10px;
                border-radius: 6px;
                cursor: pointer;
                line-height: 26px;
                font-weight: 700;
                font-size: 14px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 10px rgba(238, 90, 36, 0.3);
            }

            .tc-close:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(238, 90, 36, 0.5);
            }

            .tc-table {
                border-collapse: collapse;
                font-size: 10px;
                table-layout: fixed;
                margin: 0 auto;
                width: 100%;
                border-radius: 10px;
                overflow: hidden;
            }

            .tc-table th,
            .tc-table td {
                padding: 4px 3px;
                border: 1px solid #3a3a6a;
                text-align: center;
                width: 52px;
                min-width: 52px;
                max-width: 52px;
                height: 32px;
            }

            .tc-wrapper.light-mode .tc-table th,
            .tc-wrapper.light-mode .tc-table td {
                border-color: #bbbbdd;
            }

            .tc-table th {
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
                font-size: 8.5px;
                line-height: 1.1;
                word-break: break-word;
            }

            .type-name {
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
                font-size: 8.5px;
                line-height: 1.1;
                word-break: break-word;
            }

            .corner-cell {
                background: linear-gradient(135deg, #2d2d5e, #1a1a3e) !important;
                width: 55px;
                min-width: 55px;
                max-width: 55px;
                font-size: 11px;
            }

            .tc-cell {
                font-weight: 900;
                font-size: 12px;
                cursor: default;
                transition: all 0.2s ease;
                border-radius: 2px;
            }

            .tc-cell:hover {
                transform: scale(1.15);
                z-index: 10;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
                border-radius: 4px;
            }

            .tc-super {
                background: #ff1744;
                color: #ffffff;
            }

            .tc-normal {
                background: #546e7a;
                color: #eceff1;
            }

            .tc-not-very {
                background: #ffd600;
                color: #1a1a1a;
            }

            .tc-no-effect {
                background: #263238;
                color: #eceff1;
            }

            .tc-wrapper.light-mode .tc-normal {
                background: #90a4ae;
                color: #263238;
            }

            .tc-wrapper.light-mode .tc-no-effect {
                background: #37474f;
            }

            .tc-legend {
                display: flex;
                gap: 16px;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 12px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                font-size: 10px;
            }

            .tc-wrapper.light-mode .tc-legend {
                background: rgba(0, 0, 0, 0.05);
                border-color: rgba(0, 0, 0, 0.08);
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 2px 8px 2px 4px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.03);
            }

            .legend-box {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                font-weight: 900;
                font-size: 11px;
            }

            .legend-box.super {
                background: #ff1744;
                color: #ffffff;
            }

            .legend-box.not-very {
                background: #ffd600;
                color: #1a1a1a;
            }

            .legend-box.no-effect {
                background: #263238;
                color: #eceff1;
            }

            .legend-box.normal {
                background: #546e7a;
                color: #eceff1;
            }

            .tc-wrapper.light-mode .legend-box.normal {
                background: #90a4ae;
                color: #263238;
            }

            .tc-wrapper.light-mode .legend-box.no-effect {
                background: #37474f;
            }

            .legend-text {
                font-size: 9px;
                color: #cccccc;
                font-weight: 500;
            }

            .tc-wrapper.light-mode .legend-text {
                color: #444444;
            }

            .tc-footer {
                margin-top: 12px;
                text-align: center;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 1px;
                color: #666666;
                padding: 4px 0;
                opacity: 0.6;
            }

            .brand {
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 800;
            }

            .tc-help {
                margin-bottom: 12px;
                padding: 10px 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                font-size: 10.5px;
                line-height: 1.6;
                color: #b0b0d0;
            }

            .tc-wrapper.light-mode .tc-help {
                background: rgba(0, 0, 0, 0.04);
                border-color: rgba(0, 0, 0, 0.08);
                color: #555577;
            }

            .tc-help-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                cursor: pointer;
                font-weight: 700;
                font-size: 12px;
                color: #ffffff;
            }

            .tc-wrapper.light-mode .tc-help-header {
                color: #222244;
            }

            .help-toggle {
                font-size: 11px;
                color: #b0b0d0;
            }

            .help-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 8px;
            }

            .help-grid > div {
                padding: 6px 8px;
                border-radius: 4px;
                background: rgba(102, 126, 234, 0.2);
            }

            .help-grid strong {
                display: block;
                color: #ffffff;
                font-size: 10px;
            }

            .help-grid p {
                margin: 2px 0 0 0;
                font-size: 9.5px;
                color: #b0b0d0;
            }

            .tc-wrapper.light-mode .help-grid > div {
                background: rgba(102, 126, 234, 0.1);
            }

            .tc-wrapper.light-mode .help-grid strong {
                color: #222244;
            }

            .tc-wrapper.light-mode .help-grid p {
                color: #555577;
            }

            .help-example {
                padding: 8px 10px;
                border-radius: 4px;
                margin-bottom: 8px;
                border-left: 3px solid #667eea;
                background: rgba(255, 255, 255, 0.03);
            }

            .tc-wrapper.light-mode .help-example {
                background: rgba(0, 0, 0, 0.03);
            }

            .example-row {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }

            .example-label {
                font-weight: 700;
                color: #ffffff;
                font-size: 10.5px;
            }

            .tc-wrapper.light-mode .example-label {
                color: #222244;
            }

            .type-tag {
                padding: 1px 8px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: 700;
                color: #ffffff;
            }

            .type-tag.fire { background: #F08030; }
            .type-tag.grass { background: #78C850; }

            .arrow, .equals {
                color: #b0b0d0;
                font-size: 10px;
            }

            .result-tag {
                padding: 1px 8px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: 900;
                color: #ffffff;
            }

            .result-tag.super {
                background: #ff1744;
            }

            .result-label.super {
                color: #ff1744;
                font-size: 10px;
                font-weight: 900;
            }

            .hint {
                margin: 4px 0 0 0;
                font-size: 9px;
                color: #b0b0d0;
                opacity: 0.7;
            }

            .help-legend {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                font-size: 9px;
                padding-top: 4px;
                border-top: 1px solid rgba(255, 255, 255, 0.08);
            }

            .tc-wrapper.light-mode .help-legend {
                border-color: rgba(0, 0, 0, 0.08);
            }

            .help-legend .legend-box {
                width: 16px;
                height: 16px;
                font-size: 8px;
            }

            .tc-toggle {
                position: fixed;
                bottom: 25px;
                right: 25px;
                z-index: 9998;
                padding: 10px 24px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: #ffffff;
                border: none;
                border-radius: 50px;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 25px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                letter-spacing: 0.5px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                font-family: 'Segoe UI', Tahoma, sans-serif;
            }

            .tc-toggle:hover {
                transform: scale(1.08) translateY(-2px);
                box-shadow: 0 8px 40px rgba(102, 126, 234, 0.6);
                background: linear-gradient(135deg, #764ba2, #667eea);
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;

        document.head.appendChild(styleElement);
    }

    function initialize() {
        if (document.getElementById('chart-wrapper')) {
            return;
        }

        injectStyles();

        const { wrapper, toggleButton } = buildChart();
        document.body.appendChild(wrapper);
        document.body.appendChild(toggleButton);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();

// END

/*
MIT License
Copyright (c) 2026 Everlasting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
