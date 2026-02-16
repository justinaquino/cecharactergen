// ============================================================
// TileManager — arranges tiles on screen based on device
//
// Phone (< 768px):    accordion — one tile open at a time
// Tablet (768-1400):  two-column grid — tiles side by side
// Desktop (> 1400):   free-form — draggable, resizable windows
// ============================================================

var TileManager = {
    tiles: [],
    activeLayout: '',
    manualLayout: null,
    _dragState: null,

    // Create a tile and add it to the workspace
    createTile: function(options) {
        var tile = {
            id: options.id,
            title: options.title,
            content: options.content,
            state: 'open' // 'open', 'minimized', 'maximized'
        };
        this.tiles.push(tile);
    },

    // Initialize — render tiles, detect layout, set up listeners
    init: function() {
        this._renderAllTiles();
        this._detectLayout();
        this._addLayoutIndicator();

        var self = this;
        window.addEventListener('resize', function() {
            self._detectLayout();
        });
    },

    // Render all registered tiles into the workspace
    _renderAllTiles: function() {
        var workspace = document.getElementById('workspace');
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            var el = document.createElement('div');
            el.id = 'tile-' + tile.id;
            el.className = 'tile';
            el.setAttribute('data-tile-id', tile.id);

            el.innerHTML =
                '<div class="tile-header">' +
                    '<div>' +
                        '<span class="tile-arrow">&#9660;</span>' +
                        '<span class="tile-title">' + tile.title + '</span>' +
                    '</div>' +
                    '<div class="tile-controls">' +
                        '<button class="tile-btn tile-btn-min" title="Minimize">&#8722;</button>' +
                        '<button class="tile-btn tile-btn-max" title="Maximize">&#9744;</button>' +
                    '</div>' +
                '</div>' +
                '<div class="tile-body">' + tile.content + '</div>';

            workspace.appendChild(el);
            this._attachTileEvents(el, tile);
        }
    },

    // Attach click/drag events to a tile element
    _attachTileEvents: function(el, tile) {
        var self = this;
        var header = el.querySelector('.tile-header');
        var btnMin = el.querySelector('.tile-btn-min');
        var btnMax = el.querySelector('.tile-btn-max');

        // Header click — toggle on phone, focus on desktop
        header.addEventListener('click', function(e) {
            if (e.target.classList.contains('tile-btn')) return;
            if (self.activeLayout === 'phone') {
                self._togglePhoneAccordion(tile.id);
            } else {
                self._focusTile(tile.id);
            }
        });

        // Minimize button
        btnMin.addEventListener('click', function(e) {
            e.stopPropagation();
            self._toggleMinimize(tile.id);
        });

        // Maximize button
        btnMax.addEventListener('click', function(e) {
            e.stopPropagation();
            self._toggleMaximize(tile.id);
        });

        // Desktop dragging
        header.addEventListener('mousedown', function(e) {
            if (self.activeLayout !== 'desktop') return;
            if (e.target.classList.contains('tile-btn')) return;
            self._startDrag(el, e);
        });

        // Touch dragging for tablet/desktop
        header.addEventListener('touchstart', function(e) {
            if (self.activeLayout !== 'desktop') return;
            if (e.target.classList.contains('tile-btn')) return;
            self._startDrag(el, e.touches[0]);
        }, { passive: true });
    },

    // Detect current layout mode based on viewport width
    _detectLayout: function() {
        var w = window.innerWidth;
        var newLayout;
        
        // Manual override
        if (this.manualLayout) {
            newLayout = this.manualLayout;
        } else {
            // Auto-detect with adjusted breakpoints for tablets
            if (w < 768) {
                newLayout = 'phone';
            } else if (w <= 1400) {  // Extended tablet range for larger tablets
                newLayout = 'tablet';
            } else {
                newLayout = 'desktop';
            }
        }

        if (newLayout !== this.activeLayout) {
            this.activeLayout = newLayout;
            this._applyLayout();
            this._updateIndicator();
        }
    },

    // Apply layout-specific behavior
    _applyLayout: function() {
        var allTileEls = document.querySelectorAll('.tile');

        if (this.activeLayout === 'phone') {
            // Collapse all except first
            for (var i = 0; i < allTileEls.length; i++) {
                if (i === 0) {
                    allTileEls[i].classList.remove('minimized');
                } else {
                    allTileEls[i].classList.add('minimized');
                }
                // Reset any absolute positioning
                allTileEls[i].style.left = '';
                allTileEls[i].style.top = '';
                allTileEls[i].style.width = '';
                allTileEls[i].style.height = '';
            }
        } else {
            // Open all tiles when switching to tablet/desktop
            for (var i = 0; i < allTileEls.length; i++) {
                allTileEls[i].classList.remove('minimized');
                if (this.activeLayout === 'tablet') {
                    allTileEls[i].style.left = '';
                    allTileEls[i].style.top = '';
                    allTileEls[i].style.width = '';
                    allTileEls[i].style.height = '';
                }
            }
        }
    },

    // Phone accordion — expand one, collapse others
    _togglePhoneAccordion: function(tileId) {
        var allTileEls = document.querySelectorAll('.tile');
        for (var i = 0; i < allTileEls.length; i++) {
            var el = allTileEls[i];
            if (el.getAttribute('data-tile-id') === tileId) {
                el.classList.toggle('minimized');
            } else {
                el.classList.add('minimized');
            }
        }
    },

    // Toggle minimize
    _toggleMinimize: function(tileId) {
        var el = document.getElementById('tile-' + tileId);
        if (el) el.classList.toggle('minimized');
    },

    // Toggle maximize
    _toggleMaximize: function(tileId) {
        var el = document.getElementById('tile-' + tileId);
        if (!el) return;

        if (el.classList.contains('maximized')) {
            el.classList.remove('maximized');
            el.style.left = el.getAttribute('data-prev-left') || '';
            el.style.top = el.getAttribute('data-prev-top') || '';
            el.style.width = el.getAttribute('data-prev-width') || '';
            el.style.height = el.getAttribute('data-prev-height') || '';
        } else {
            el.setAttribute('data-prev-left', el.style.left);
            el.setAttribute('data-prev-top', el.style.top);
            el.setAttribute('data-prev-width', el.style.width);
            el.setAttribute('data-prev-height', el.style.height);
            el.classList.add('maximized');
            el.style.left = '0';
            el.style.top = '0';
            el.style.width = '100%';
            el.style.height = 'calc(100vh - 100px)';
        }
    },

    // Bring a tile to the front
    _focusTile: function(tileId) {
        var allTileEls = document.querySelectorAll('.tile');
        for (var i = 0; i < allTileEls.length; i++) {
            allTileEls[i].style.zIndex = '1';
        }
        var el = document.getElementById('tile-' + tileId);
        if (el) el.style.zIndex = '10';
    },

    // Desktop dragging
    _startDrag: function(el, e) {
        var self = this;
        var rect = el.getBoundingClientRect();
        var offsetX = e.clientX - rect.left;
        var offsetY = e.clientY - rect.top;

        this._focusTile(el.getAttribute('data-tile-id'));

        function onMove(e2) {
            var clientX = e2.clientX || (e2.touches && e2.touches[0].clientX);
            var clientY = e2.clientY || (e2.touches && e2.touches[0].clientY);
            var workspace = document.getElementById('workspace');
            var wsRect = workspace.getBoundingClientRect();
            el.style.left = (clientX - wsRect.left - offsetX) + 'px';
            el.style.top = (clientY - wsRect.top - offsetY) + 'px';
        }

        function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove, { passive: true });
        document.addEventListener('touchend', onUp);
    },

    // Layout indicator bar at bottom of screen (for testing)
    _addLayoutIndicator: function() {
        var indicator = document.createElement('div');
        indicator.className = 'layout-indicator';
        indicator.id = 'layout-indicator';
        indicator.style.cursor = 'pointer';
        indicator.title = 'Click to cycle layouts, double-click to reset auto-detection';
        var self = this;
        indicator.addEventListener('click', function() {
            self._cycleLayout();
        });
        indicator.addEventListener('dblclick', function(e) {
            e.preventDefault();
            self.manualLayout = null;
            self._detectLayout();
        });
        document.body.appendChild(indicator);
        this._updateIndicator();
    },

    _updateIndicator: function() {
        var indicator = document.getElementById('layout-indicator');
        if (!indicator) return;
        var w = window.innerWidth;
        var labels = {
            phone: 'Phone layout (accordion) — ' + w + 'px',
            tablet: 'Tablet layout (grid) — ' + w + 'px',
            desktop: 'Desktop layout (free-form) — ' + w + 'px'
        };
        var prefix = this.manualLayout ? '[Manual] ' : '';
        indicator.textContent = prefix + labels[this.activeLayout] || '';
    },

    _cycleLayout: function() {
        var layouts = ['phone', 'tablet', 'desktop'];
        var currentIndex = layouts.indexOf(this.activeLayout);
        var nextIndex = (currentIndex + 1) % layouts.length;
        this.manualLayout = layouts[nextIndex];
        this._detectLayout(); // will use manualLayout
    }
};
